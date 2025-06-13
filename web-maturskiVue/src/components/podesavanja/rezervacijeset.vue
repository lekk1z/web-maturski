<template>
  <div class="reservation-settings">
    <h2>Sve rezervacije</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-if="reservations.length === 0">Nema rezervacija</div>
      <ul v-else>
        <li v-for="reservation in reservations" :key="reservation.id">
          <div v-if="editingId === reservation.id">
            <input v-model="editForm.name" placeholder="Name" />
            <input v-model="editForm.date" type="datetime-local" />
            <select v-model="editForm.tableId">
              <option v-for="table in tables" :key="table.id" :value="table.id">
                {{ table.number }}
              </option>
            </select>
            <button @click="saveEdit(reservation.id)">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </div>
          <div v-else>
            <strong>{{ reservation.name }}</strong> -
            {{ formatDate(reservation.date) }} - Sto
            {{ reservation.tableInfo?.number || "Unknown" }}
            <span class="action-buttons">
              <button @click="startEdit(reservation)" id="editbtn">Edit</button>
              <button @click="deleteReservation(reservation.id)" id="delbtn">
                Delete
              </button>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const tables = ref([]);
const reservations = ref([]);
const loading = ref(true);
const editingId = ref(null);
const editForm = ref({
  name: "",
  date: "",
  tableId: "",
});

function toJavaLocalDateTime(dateStr) {
  if (!dateStr) return "";
  if (dateStr.length === 16) return dateStr + ":00";
  return dateStr;
}

async function fetchReservations() {
  try {
    const tableResponse = await fetch("http://localhost:8080/api/tables");
    tables.value = await tableResponse.json();

    const response = await fetch("http://localhost:8080/api/reservations");
    const data = await response.json();

    const reservationsWithTable = await Promise.all(
      data.map(async (reservation) => {
        if (reservation.tableId) {
          try {
            const tableRes = await fetch(
              `http://localhost:8080/api/tables/${reservation.tableId}`
            );
            const tableData = await tableRes.json();
            reservation.tableInfo = tableData;
          } catch (err) {
            reservation.tableInfo = { number: "Unknown" };
          }
        } else {
          reservation.tableInfo = { number: "Unknown" };
        }
        return reservation;
      })
    );

    reservations.value = reservationsWithTable;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
  } finally {
    loading.value = false;
  }
}

function parseLocalDateTime(dateStr) {
  if (!dateStr) return new Date();
  const [datePart, timePart] = dateStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = (timePart || "").split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, second || 0);
}

function formatDate(dateStr) {
  const date = parseLocalDateTime(dateStr);
  return date.toLocaleString();
}

function startEdit(reservation) {
  editingId.value = reservation.id;
  editForm.value = {
    name: reservation.name,
    date: reservation.date.slice(0, 16),
    tableId:
      reservation.tableId ||
      (reservation.tableInfo && reservation.tableInfo.id) ||
      null,
  };
}

function cancelEdit() {
  editingId.value = null;
  editForm.value = { name: "", date: "", tableId: null };
}

async function saveEdit(id) {
  try {
    const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: editForm.value.tableId,
        name: editForm.value.name,
        date: toJavaLocalDateTime(editForm.value.date),
      }),
    });
    if (!res.ok) throw new Error("Failed to update reservation");
    await fetchReservations();
    cancelEdit();
  } catch (e) {
    alert("Error updating reservation");
  }
}

async function deleteReservation(id) {
  if (!confirm("Are you sure you want to delete this reservation?")) return;
  try {
    const res = await fetch(`http://localhost:8080/api/reservations/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete reservation");
    await fetchReservations();
  } catch (e) {
    alert("Error deleting reservation");
  }
}

onMounted(fetchReservations);
</script>

<style scoped>
#editbtn,
#delbtn {
  text-align: end;
}
.reservation-settings {
  padding: 1.5rem 1rem;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  max-width: 600px;
  margin: 0 auto;
}

.reservation-settings h2 {
  margin-bottom: 18px;
  color: #388e3c;
  font-size: 1.4em;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  background: #fff;
  border-radius: 7px;
  margin-bottom: 12px;
  padding: 12px 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

li > div {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
}

input,
select {
  padding: 5px 8px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 1em;
  margin-right: 6px;
}

button {
  background: #e0f2e0;
  border: none;
  border-radius: 5px;
  padding: 6px 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  color: #388e3c;
  margin-left: 6px;
}

button:hover {
  background: #388e3c;
  color: #fff;
}

button:last-child {
  background: #ffebee;
  color: #c62828;
}

button:last-child:hover {
  background: #c62828;
  color: #fff;
}

strong {
  color: #222;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 600px) {
  .reservation-settings {
    padding: 1rem 2vw;
  }
  li > div {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
