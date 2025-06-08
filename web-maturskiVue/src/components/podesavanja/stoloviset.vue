<script setup>
import { ref, onMounted } from 'vue'

const tables = ref([])
const loading = ref(true)
const error = ref(null)
const changed = ref(false)
const dragIndex = ref(null)
const saving = ref(false)

async function fetchTables() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/api/tables')
    if (!res.ok) throw new Error('Greška pri preuzimanju stolova')
    tables.value = await res.json()
    error.value = null
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function addTable() {
  const maxNumber = tables.value.reduce((max, t) => Math.max(max, t.number || 0), 0)
  const newTable = {
    number: maxNumber + 1,
    occupied: false,
    ordersId: []
  }
  fetch('http://localhost:8080/api/tables', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTable)
  })
    .then(async res => {
      if (!res.ok) throw new Error('Greška pri dodavanju stola')
      const created = await res.json()
      tables.value.push(created)
      changed.value = true
    })
    .catch(e => {
      alert(e.message || 'Greška pri dodavanju stola')
    })
}

async function deleteTable(idx, id) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovaj sto?')) return
  try {
    const res = await fetch(`http://localhost:8080/api/tables/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Greška pri brisanju stola')
    tables.value.splice(idx, 1)
    changed.value = true
  } catch (e) {
    alert(e.message || 'Greška pri brisanju stola')
  }
}

async function saveTables() {
  saving.value = true
  try {
    for (let i = 0; i < tables.value.length; i++) {
      const table = tables.value[i]
      await fetch(`http://localhost:8080/api/tables/${table.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...table, placement: i })
      })
    }
    changed.value = false
    await fetchTables()
    alert('Promene su sačuvane.')
  } catch (e) {
    alert(e.message || 'Greška pri čuvanju stolova')
  } finally {
    saving.value = false
  }
}

// Drag and drop handlers
function onDragStart(idx) {
  dragIndex.value = idx
}
function onDragOver(idx, e) {
  e.preventDefault()
  if (dragIndex.value === idx) return
}
function onDrop(idx) {
  if (dragIndex.value === null || dragIndex.value === idx) return
  const dragged = tables.value[dragIndex.value]
  tables.value.splice(dragIndex.value, 1)
  tables.value.splice(idx, 0, dragged)
  changed.value = true
  dragIndex.value = null
}
function onDragEnd() {
  dragIndex.value = null
}

function moveUp(idx) {
  if (idx === 0) return
  const temp = tables.value[idx - 1]
  tables.value[idx - 1] = tables.value[idx]
  tables.value[idx] = temp
  changed.value = true
}
function moveDown(idx) {
  if (idx === tables.value.length - 1) return
  const temp = tables.value[idx + 1]
  tables.value[idx + 1] = tables.value[idx]
  tables.value[idx] = temp
  changed.value = true
}

onMounted(fetchTables)
</script>

<template>
  <div>
    <h3>Stolovi</h3>
    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="error" style="color:red;">{{ error }}</div>
    <div v-else>
      <table style="width:100%;margin-bottom:16px;">
        <thead>
          <tr>
            <th>#</th>
            <th>Broj stola</th>
            <th>Redosled</th>
            <th>Obriši</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(table, idx) in tables"
            :key="table.id"
            draggable="true"
            @dragstart="onDragStart(idx)"
            @dragover="onDragOver(idx, $event)"
            @drop="onDrop(idx)"
            @dragend="onDragEnd"
            :class="{ dragging: dragIndex === idx }"
            style="cursor: move;"
          >
            <td>{{ idx + 1 }}</td>
            <td>
              <input
                type="text"
                v-model="table.number"
                @input="changed = true"
                style="width: 60px; text-align: center;"
              />
            </td>
            <td>
              <button @click="moveUp(idx)" :disabled="idx === 0">▲</button>
              <button @click="moveDown(idx)" :disabled="idx === tables.length - 1">▼</button>
            </td>
            <td>
              <button @click="deleteTable(idx, table.id)" style="color:#e74c3c;" title="Obriši sto">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="addTable" style="margin-right:12px;">Novi sto</button>
      <button @click="saveTables" :disabled="!changed || saving">
        <span v-if="saving" class="spinner"></span>
        <span v-else>Sačuvaj</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  border: 1px solid #b6e2b6;
  padding: 6px 10px;
  text-align: center;
}
button {
  margin: 0 2px;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #b6e2b6;
  background: #e0f2e0;
  cursor: pointer;
  font-size: 1em;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
tr.dragging {
  opacity: 0.5;
  background: #d0f5d0;
}
h3 {
  text-align: center;
  color: #388e3c;
  margin-bottom: 16px;

}
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid #b6e2b6;
  border-top: 3px solid #388e3c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
  margin-right: 4px;
}
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
</style>