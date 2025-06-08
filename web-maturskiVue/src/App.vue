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
    // Set default user from sessionStorage or first user
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      const found = users.value.find(u => u.name === parsed.name)
      user.value = found || users.value[0]
    } else if (users.value.length > 0) {
      user.value = users.value[0]
    }
  } catch (e) {
    // fallback if error
    user.value = { name: "Marko" }
  }
}

async function addUser(newName) {
  const res = await fetch('http://localhost:8080/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName, tableIds: [] })
  })
  if (!res.ok) throw new Error('Greška pri dodavanju korisnika')
  await fetchUsers()
  // Return the added user object
  return users.value.find(u => u.name === newName)
}

function handleSelect(item) {
  selectedItem.value = item
}

function handleUserChange(newUser) {
  user.value = newUser
  sessionStorage.setItem('user', JSON.stringify(newUser))
  fetchUsers()
}

onMounted(fetchUsers)
</script>

<template>
  <Navbar
    :user="user"
    :users="users"
    :addUser="addUser"
    @select="handleSelect"
    @user-change="handleUserChange"
  />
  <Stolovi :user="user" v-if="selectedItem === 'Stolovi'" />
  <Meni v-if="selectedItem === 'Meni'" />
  <Rezervacije v-if="selectedItem === 'Rezervacije'" />
  <Podesavanja v-if="selectedItem === 'Podesavanja'" :user="user" />
</template>