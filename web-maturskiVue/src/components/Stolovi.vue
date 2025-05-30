<script setup>
import { ref, onMounted } from 'vue'

const tables = ref([])
const loading = ref(true)
const error = ref(null)

const showPopup = ref(false)
const selectedTable = ref(null)

async function fetchTables() {
  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/api/tables')
    if (!res.ok) throw new Error('Greska pri preuzimanju stolova')
    tables.value = await res.json()
    error.value = null
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function izmeniSto(id) {
  const table = tables.value.find(t => t.id === id)
  selectedTable.value = table
  showPopup.value = true
}

function closePopup() {
  showPopup.value = false
  selectedTable.value = null
}

function seatSomeone() {
  if (!selectedTable.value) return;
  // Locally update the table as occupied
  selectedTable.value.occupied = true;
  // Update in the tables array as well
  const idx = tables.value.findIndex(t => t.id === selectedTable.value.id);
  if (idx !== -1) tables.value[idx].occupied = true;

  // Update the API
  fetch(`http://localhost:8080/api/tables/${selectedTable.value.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...selectedTable.value, occupied: true })
  })
    .then(res => {
      if (!res.ok) throw new Error('Greška pri ažuriranju stola');
      return res.json();
    })
    .then(() => {
      
    })
    .catch(e => {
      alert(e.message || 'Greška pri ažuriranju stola');
    });
}

onMounted(fetchTables)
</script>

<template>
  <div class="stolovi">
    <h2>Stolovi</h2>
    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="tables.length === 0">Nema stolova.</div>
      <div class="tables-list">
        <div v-for="table in tables" :key="table.id" class="table-card" @click="izmeniSto(table.id)">
          <h3>Sto #{{ table.number }}</h3>
          <p>Status: {{ table.occupied ? 'Zauzet' : 'Slobodan' }}</p>
        </div>
      </div>
    </div>
    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <button class="close-btn" @click="closePopup">×</button>
        <h3>Sto #{{ selectedTable.number }}</h3>
        <p>Status: {{ selectedTable.occupied ? 'Zauzet' : 'Slobodan' }}</p>
        <h4>Poručene stavke:</h4>
        <ul>
          <li v-if="!selectedTable.items || selectedTable.items.length === 0">Nema poručenih stavki.</li>
          <li v-for="item in selectedTable.items" :key="item.id">
            {{ item.name }} x{{ item.quantity }}
          </li>
        </ul>
        <button @click="seatSomeone">Sedi korisnika</button>
        <button @click="addItemToBill">Dodaj stavku na račun</button>
      </div>
    </div>
  </div>
</template>

<style>
.stolovi {
  padding: 20px;
}
.tables-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.table-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  min-width: 150px;
  background: #f8fff8;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.table-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  min-width: 320px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}
.popup-box button {
  margin: 10px 8px 0 0;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #aeeaaa;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.popup-box button:hover {
  background: #7fd67f;
}
</style>

