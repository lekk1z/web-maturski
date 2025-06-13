<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  user: Object,
  users: Array,
  addUser: Function,
});
const emit = defineEmits(["select", "user-change"]);

const vidljivost = ref(false);
const iconica = ref("☰");
const promenividljivost = () => {
  vidljivost.value = !vidljivost.value;
  iconica.value = vidljivost.value ? "✖" : "☰";
};
function selectItem(item) {
  emit("select", item);
  promenividljivost();
}
const selectedUser = ref(null);

watch(
  () => props.user,
  (newUser) => {
    const found = props.users.find(
      (u) => u.name === (newUser?.name || newUser)
    );
    selectedUser.value = found || null;
  },
  { immediate: true }
);

function promeniUser() {
  toggleChangeUser();
  const found = props.users.find((u) => u.name === props.user?.name);
  selectedUser.value = found || null;
}

async function confirmUserChange() {
  if (selectedUser.value === "add_new") {
    const newName = prompt("Unesite ime novog korisnika:");
    if (newName && newName.trim()) {
      try {
        const added = await props.addUser(newName.trim());
        if (added) {
          emit("user-change", added);
        }
      } catch (e) {
        alert(e.message || "Greška pri dodavanju korisnika");
      } finally {
        toggleChangeUser();
      }
    } else {
      toggleChangeUser();
    }
    return;
  }
  if (selectedUser.value && selectedUser.value.name !== props.user?.name) {
    emit("user-change", selectedUser.value);
  }
  toggleChangeUser();
}

const vidljivostChangeUser = ref(false);
function toggleChangeUser() {
  vidljivostChangeUser.value = !vidljivostChangeUser.value;
}
function returnToMain() {
  emit("select", "Stolovi");
}
</script>
<template>
  <div class="topbar">
    <h1 @click="returnToMain()" class="logo">Restoran Pita</h1>
    <h2 id="user" class="centered-user" @click="promeniUser">
      Zdravo, {{ props.user?.name }}!
    </h2>

    <div
      class="change-user-container"
      id="change-user-container"
      v-if="vidljivostChangeUser"
    >
      <div class="change-user-box">
        <h2>Izaberi korisnika</h2>
        <div v-if="usersLoading">Učitavanje korisnika...</div>
        <div v-else-if="usersError" style="color: red">{{ usersError }}</div>
        <select
          v-else
          id="user-select"
          class="user-select"
          v-model="selectedUser"
        >
          <option v-for="u in users" :key="u.name" :value="u">
            {{ u.name }}
          </option>
          <option :value="'add_new'">Dodaj korisnika...</option>
        </select>
        <button
          id="change-user-button"
          @click="confirmUserChange"
          :disabled="usersLoading || usersError"
        >
          Izaberi
        </button>
      </div>
    </div>

    <div class="menu-container">
      <button class="hamburger" id="hamburger" @click="promenividljivost">
        {{ iconica }}
      </button>
      <nav v-if="vidljivost">
        <ul>
          <li id="pocetnabtn" @click="selectItem('Stolovi')">Pocetna</li>
          <li id="menibtn" @click="selectItem('Meni')">Meni</li>
          <li id="rezervacijebtn" @click="selectItem('Rezervacije')">
            Rezervacije
          </li>
          <li
            class="no-divider"
            id="podesavanjabtn"
            @click="selectItem('Podesavanja')"
          >
            Podesavanja
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(171, 238, 171);
  border: 10px solid rgb(171, 238, 171);
  padding: 10px;
  position: relative;
}
.centered-user {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  z-index: 1;
}

.centered-user:hover {
  border: 3px solid grey;
  padding: 5px;
  border-radius: 7px;
}
.hamburger {
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
}
.menu-container {
  position: relative;
}
nav ul {
  list-style: none;
  padding: 1em;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  position: absolute;
  top: 30px;
  right: 0;
  width: 150px;
  border: 1px solid #ccc;
}
nav ul li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
nav ul a::before {
  color: #000;
}
.no-divider {
  border-bottom: 0;
}
.change-user-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-user-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  text-align: center;
}

.logo:hover {
  cursor: pointer;
}
</style>
