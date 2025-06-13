<script setup>
import { ref, computed, onMounted } from "vue";

const users = ref([]);
const tables = ref([]);
const showModal = ref(false);
const editUserData = ref({
  id: "",
  name: "",
  tableIds: [],
  superuser: null,
});
const loading = ref(false);
const superUserCount = computed(
  () => users.value.filter((u) => u.superuser).length
);

const isOnlySuperUser = computed(
  () =>
    editUserData.value.superuser &&
    superUserCount.value === 1 &&
    users.value.find((u) => u.id === editUserData.value.id)?.superuser
);

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8080/api/users");
    users.value = await response.json();
  } catch (e) {
    console.error(e.message || "Greška pri preuzimanju korisnika");
  }
}

async function fetchTables() {
  try {
    const response = await fetch("http://localhost:8080/api/tables");
    tables.value = await response.json();
  } catch (e) {
    console.error(e.message || "Greška pri preuzimanju stolova");
  }
}

function openEditUser(user) {
  editUserData.value = {
    id: user.id,
    name: user.name,
    tableIds: [...(user.tableIds || [])],
    superuser: user.superuser ?? false,
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function toggleTable(tableId) {
  const idx = editUserData.value.tableIds.indexOf(tableId);
  if (idx === -1) {
    editUserData.value.tableIds.push(tableId);
  } else {
    editUserData.value.tableIds.splice(idx, 1);
  }
}

async function saveUser() {
  loading.value = true;
  try {
    await fetch(`http://localhost:8080/api/users/${editUserData.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editUserData.value.name,
        tableIds: editUserData.value.tableIds,
        superuser: editUserData.value.superuser || false,
      }),
    });
    await fetchUsers();
    closeModal();
  } catch (e) {
    alert("Greška pri čuvanju korisnika");
  } finally {
    loading.value = false;
  }
}

async function deleteUser(id) {
  if (!confirm("Obrisati korisnika?")) return;
  try {
    await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" });
    await fetchUsers();
  } catch (e) {
    alert("Greška pri brisanju korisnika");
  }
}

onMounted(() => {
  fetchUsers();
  fetchTables();
});
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id">
      <span @click="openEditUser(user)" class="user-link">{{ user.name }}</span>
      <div class="action-buttons">
        <button @click="openEditUser(user)">Uredi</button>
        <button @click="deleteUser(user.id)">Obriši</button>
      </div>
    </li>
  </ul>

  <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <h3>Uredi korisnika</h3>
      <label>
        Ime:
        <input v-model="editUserData.name" />
      </label>
      <div class="table-list">
        <span>Stolovi:</span>
        <div v-for="table in tables" :key="table.id" class="table-checkbox">
          <input
            type="checkbox"
            :id="'table-' + table.id"
            :value="table.id"
            :checked="editUserData.tableIds.includes(table.id)"
            @change="toggleTable(table.id)"
          />
          <label :for="'table-' + table.id">Sto {{ table.number }}</label>
        </div>
        <div class="superuser-checkbox" style="margin-top: 12px">
          <input
            type="checkbox"
            id="superuser"
            v-model="editUserData.superuser"
            :disabled="isOnlySuperUser"
          />
          <label for="superuser">Superuser</label>
          <span
            v-if="isOnlySuperUser"
            style="color: #c62828; font-size: 0.95em; margin-left: 8px"
          >
            Mora postojati bar jedan superuser
          </span>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="saveUser" :disabled="loading">Sačuvaj</button>
        <button @click="closeModal" :disabled="loading">Otkaži</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.user-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  justify-content: space-between;
}
.user-link {
  cursor: pointer;
  color: #388e3c;
  font-weight: bold;
  margin-right: 8px;
  transition: color 0.2s;
}
.user-link:hover {
  text-decoration: underline;
  color: #256029;
}
.user-list button {
  background: #e0f2e0;
  border: none;
  border-radius: 5px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  color: #388e3c;
}
.user-list button:hover {
  background: #388e3c;
  color: #fff;
}
.user-list button:last-child {
  background: #ffebee;
  color: #c62828;
}
.user-list button:last-child:hover {
  background: #c62828;
  color: #fff;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px 20px;
  min-width: 320px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  max-width: 95vw;
}
.modal h3 {
  margin-top: 0;
  color: #388e3c;
  text-align: center;
}
label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}
input[type="text"],
input[type="checkbox"],
input[type="number"] {
  margin-top: 4px;
  margin-bottom: 8px;
}
input[type="text"] {
  padding: 6px 8px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.table-list {
  margin: 16px 0;
}
.table-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.superuser-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.superuser-checkbox label {
  margin: 0;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}
.modal-actions button {
  min-width: 90px;
  background: #e0f2e0;
  border: none;
  border-radius: 5px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  color: #388e3c;
}
.modal-actions button:hover {
  background: #388e3c;
  color: #fff;
}
.modal-actions button:last-child {
  background: #ffebee;
  color: #c62828;
}
.modal-actions button:last-child:hover {
  background: #c62828;
  color: #fff;
}
@media (max-width: 600px) {
  .modal {
    padding: 12px 4vw;
    min-width: unset;
  }
  .user-list {
    max-width: 98vw;
  }
}
.action-buttons {
  gap: 5px;
  display: flex;
}
</style>
