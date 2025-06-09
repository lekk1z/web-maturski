<template>
  <div v-if="props.user.superuser" class="podesavanja-container">
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
        <StoloviSet />
      </div>
      <div v-else-if="activeTab === 'Meni'">
        <MeniSet />
      </div>
      <div v-else-if="activeTab === 'Rezervacije'">
        <RezervacijeSet />
      </div>
      <div v-else-if="activeTab === 'Korisnici'">
        <UserSet />
      </div>
    </div>
  </div>
  <div v-else>
    <p style="text-align: center; margin-top: 50px">
      Nemate dozvolu za pristup podešavanjima.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import StoloviSet from "./podesavanja/stoloviset.vue";
import MeniSet from "./podesavanja/meniset.vue";
import RezervacijeSet from "./podesavanja/rezervacijeset.vue";
import UserSet from "./podesavanja/userset.vue";

const props = defineProps({
  user: Object,
});

const tabs = ["Stolovi", "Meni", "Rezervacije", "Korisnici"];
const activeTab = ref(tabs[0]);
</script>

<style scoped>
.podesavanja-container {
  max-width: 100%;
  margin: 12px auto;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
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
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  font-size: 1.05em;
}
h1 {
  margin-bottom: 5px;
}
</style>
