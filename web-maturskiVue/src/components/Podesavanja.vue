<template>
  <div class="podesavanja-container">
    <h1>Podešavanja</h1>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="tab-content">
      <div v-if="activeTab === 'Stolovi'">
        <!-- Ovde ide komponenta ili forma za uređivanje stolova -->
        <h2>Uredi stolove</h2>
        <!-- ... -->
      </div>
      <div v-else-if="activeTab === 'Meni'">
        <!-- Ovde ide komponenta ili forma za uređivanje menija -->
        <h2>Uredi meni</h2>
        <!-- ... -->
      </div>
      <div v-else-if="activeTab === 'Rezervacije'">
        <!-- Ovde ide komponenta ili forma za uređivanje rezervacija -->
        <h2>Uredi rezervacije</h2>
        <!-- ... -->
      </div>
      <div v-else-if="activeTab === 'Korisnici'">
        <!-- Ovde ide komponenta ili forma za uređivanje korisnika -->
        <h2>Uredi korisnike</h2>
        <!-- ... -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ['Stolovi', 'Meni', 'Rezervacije', 'Korisnici']
const activeTab = ref(tabs[0])
</script>

<style scoped>
.podesavanja-container {
  max-width: 100%;
  margin: 12px auto;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  padding: 10px 12px;
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tabs button {
  background: #e0f2e0;
  border: none;
  border-radius: 5px 5px 0 0;
  padding: 7px 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  color: #388e3c;
  font-size: 1em;
  outline: none;
}
.tabs button.active {
  background: #388e3c;
  color: #fff;
}
.tab-content {
  background: #fff;
  border-radius: 0 0 6px 6px;
  padding: 14px 10px;
  min-height: 120px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
  font-size: 1.05em;
}
h1{
    margin-bottom: 5px;
}
</style>