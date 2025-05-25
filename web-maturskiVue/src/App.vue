<script setup>
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue"
import Stolovi from "@/components/Stolovi.vue"
import Meni from "@/components/Meni.vue"
import Rezervacije from "@/components/Rezervacije.vue"
import Podesavanja from "@/components/Podesavanja.vue"

const selectedItem = ref("Stolovi")

function handleSelect(item) {
  selectedItem.value = item
}
</script>

<template>
  <Navbar @select="handleSelect" />
  <Stolovi v-if="selectedItem === 'Stolovi'" />
  <Meni v-if="selectedItem === 'Meni'" />
  <Rezervacije v-if="selectedItem === 'Rezervacije'" />
  <Podesavanja v-if="selectedItem === 'Podesavanja'" />
  <div>
    Izabrana stavka: {{ selectedItem }}
  </div>
</template>