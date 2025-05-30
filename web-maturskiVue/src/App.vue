<script setup>
import { ref, onMounted } from 'vue'
import Navbar from "@/components/Navbar.vue"
import Stolovi from "@/components/Stolovi.vue"
import Meni from "@/components/Meni.vue"
import Rezervacije from "@/components/Rezervacije.vue"
import Podesavanja from "@/components/Podesavanja.vue"

const selectedItem = ref("Stolovi")
const user = ref(null)
const users = ref([])

async function fetchUsers() {
  try {
    const res = await fetch('http://localhost:8080/api/users')
    if (!res.ok) throw new Error('Greška pri preuzimanju korisnika')
    users.value = await res.json()
    // Set default user to the first user from API
    if (users.value.length > 0) {
      user.value = users.value[0]
    }
  } catch (e) {
    // fallback if error
    user.value = { name: "Marko" }
  }
}

function handleSelect(item) {
  selectedItem.value = item
}

function handleUserChange(newUser) {
  user.value = newUser
}

onMounted(fetchUsers)
</script>

<template>
  <Navbar :user="user" @select="handleSelect" @user-change="handleUserChange" />
  <Stolovi :user="user" v-if="selectedItem === 'Stolovi'" />
  <Meni v-if="selectedItem === 'Meni'" />
  <Rezervacije v-if="selectedItem === 'Rezervacije'" />
  <Podesavanja v-if="selectedItem === 'Podesavanja'" />
  <div>
    <p>Ulogovan korisnik: {{ user?.name }}</p>
  </div>
</template>