<script setup>
import { ref } from 'vue'
import Navbar from "@/components/Navbar.vue"
import Stolovi from "@/components/Stolovi.vue"
import Meni from "@/components/Meni.vue"
import Rezervacije from "@/components/Rezervacije.vue"
import Podesavanja from "@/components/Podesavanja.vue"

const selectedItem = ref("Stolovi")
const user = ref("Marko")

function handleSelect(item) {
  selectedItem.value = item
}

function handleUserChange(newUser) {
  user.value = newUser
}
</script>

<template>
  <Navbar :user="user" @select="handleSelect" @user-change="handleUserChange" />
  <Stolovi v-if="selectedItem === 'Stolovi'" />
  <Meni v-if="selectedItem === 'Meni'" />
  <Rezervacije v-if="selectedItem === 'Rezervacije'" />
  <Podesavanja v-if="selectedItem === 'Podesavanja'" />
  <div>
    <p>Ulogovan korsisnik: {{user}}</p>
  </div>
</template>