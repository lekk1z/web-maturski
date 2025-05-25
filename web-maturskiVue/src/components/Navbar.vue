<script setup>
import { ref } from 'vue';
const vidljivost = ref(false)
const iconica=ref('☰');
const promenividljivost=()=>{
  vidljivost.value= !vidljivost.value;
  if(vidljivost.value){
    iconica.value='✖'; 
  }
  else{
    iconica.value='☰';
  }
}
const emit = defineEmits(['select']);
function selectItem(item) {
  emit('select', item)
  promenividljivost();
}
const user=ref("Marko");
</script>
<template>
    <div class="topbar">
      <h1>Restoran Pita</h1>
      <h2 id="user">Zdravo, {{user}}!</h2>
      <div class="menu-container">
        <button class="hamburger" id="hamburger" @click="promenividljivost">{{iconica}}</button>
        <nav v-if="vidljivost">
          <ul>
            <li id="pocetnabtn" @click="selectItem('Stolovi')">Pocetna</li>
            <li id="menibtn" @click="selectItem('Meni')">Meni</li>
            <li id="rezervacijebtn" @click="selectItem('Rezervacije')">Rezervacije</li>
            <li class="no-divider" id="podesavanjabtn" @click="selectItem('Podesavanja')">Podesavanja</li>
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
.topbar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(171, 238, 171);
  border: 10px solid rgb(171, 238, 171);
  padding: 10px;
}
.hamburger {
  font-size:30px;
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
  cursor:pointer;
}
nav ul a::before {
  color: #000;
}
.no-divider {
  border-bottom: 0;
}
</style>