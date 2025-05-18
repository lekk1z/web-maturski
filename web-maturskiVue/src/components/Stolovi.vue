<script setup>
import { ref, onMounted } from 'vue'

const tables = ref([])
const loading = ref(true)
const error = ref(null)

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
        <div v-for="table in tables" :key="table.id" class="table-card">
          <h3>Sto #{{ table.number }}</h3>
          <p>Status: {{ table.status }}</p>
          <p>Broj mesta: {{ table.seats }}</p>
        </div>
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
}
</style>

