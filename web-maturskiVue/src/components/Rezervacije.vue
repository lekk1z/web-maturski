<template>
  <div class="rezervacije-container">
    <h1>Rezervacije</h1>
    <form @submit.prevent="submitReservation" class="reservation-form">
      <div>
        <label for="tableId">Sto:</label>
        <select v-model="form.tableId" id="tableId" required>
          <option value="" disabled>Izaberite sto</option>
          <option v-for="table in tables" :key="table.id" :value="table.id">
            Sto #{{ table.number }}
          </option>
        </select>
      </div>
      <div>
        <label for="name">Ime gosta:</label>
        <input
          v-model="form.name"
          id="name"
          type="text"
          required
          placeholder="Unesite ime gosta"
        />
      </div>
      <div>
        <label for="date">Datum:</label>
        <input v-model="form.date" id="date" type="date" required />
      </div>
      <div>
        <label for="time">Vreme:</label>
        <input v-model="form.time" id="time" type="time" required />
      </div>
      <button type="submit" :disabled="submitting || loadingTables">
        Rezerviši
      </button>
      <span v-if="submitSuccess" style="color: green; margin-left: 10px"
        >Rezervacija uspešno poslata!</span
      >
      <span v-if="submitError" style="color: red; margin-left: 10px">{{
        submitError
      }}</span>
    </form>
    <div v-if="loadingTables" style="margin-top: 12px">
      Učitavanje stolova...
    </div>
    <div v-if="error" style="color: red; margin-top: 12px">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const tables = ref([]);
const loadingTables = ref(true);
const error = ref(null);

const form = ref({
  tableId: "",
  name: "",
  date: "",
  time: "",
});

const submitting = ref(false);
const submitError = ref(null);
const submitSuccess = ref(false);

async function fetchTables() {
  loadingTables.value = true;
  try {
    const res = await fetch("http://localhost:8080/api/tables");
    if (!res.ok) throw new Error("Greška pri preuzimanju stolova");
    tables.value = await res.json();
    error.value = null;
  } catch (e) {
    error.value = e.message;
  } finally {
    loadingTables.value = false;
  }
}

// Helper to combine date and time to Java LocalDateTime format (e.g. "2024-06-01T18:30")
function toLocalDateTime(date, time) {
  return `${date}T${time}`;
}

async function submitReservation() {
  submitError.value = null;
  submitSuccess.value = false;
  submitting.value = true;
  try {
    const payload = {
      tableId: form.value.tableId,
      name: form.value.name,
      date: toLocalDateTime(form.value.date, form.value.time),
    };
    const res = await fetch("http://localhost:8080/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Greška pri slanju rezervacije");
    submitSuccess.value = true;
    form.value = { tableId: "", name: "", date: "", time: "" };
  } catch (e) {
    submitError.value = e.message;
  } finally {
    submitting.value = false;
  }
}

onMounted(fetchTables);
</script>

<style scoped>
.rezervacije-container {
  max-width: 400px;
  margin: 32px auto;
  background: #f9f9f9;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
}
.reservation-form > div {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
input,
select {
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #b6e2b6;
  font-size: 1em;
}
button[type="submit"] {
  background: #388e3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
button[type="submit"]:hover {
  background: #2d5c2d;
}
</style>
