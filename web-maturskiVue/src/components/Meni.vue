<script setup>
import { ref, onMounted } from "vue";

const menuItems = ref([]);
const loading = ref(true);
const error = ref(null);

const CATEGORY_MAP = {
  1: "Topli napici",
  2: "Hladni napici",
  3: "Jela",
  4: "Dezerti",
  // Dodaj još po potrebi
};

function groupMenuByCategory(items) {
  return items.reduce((acc, item) => {
    const catNum = item.categoryId || 0;
    const catName = CATEGORY_MAP[catNum] || `Kategorija ${catNum}`;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:8080/api/menu");
    if (!res.ok) throw new Error("Greška pri preuzimanju menija");
    menuItems.value = await res.json();
    error.value = null;
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="meni-container">
    <h1>Meni</h1>
    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="error" style="color: red">{{ error }}</div>
    <div v-else>
      <div
        v-for="(items, category) in groupMenuByCategory(menuItems)"
        :key="category"
        class="menu-category"
      >
        <h2>{{ category }}</h2>
        <ul class="menu-list">
          <li v-for="item in items" :key="item.id">
            <span class="menu-item-name">{{ item.name }}</span>
            <span class="menu-item-price">{{ item.price }} EUR</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meni-container {
  max-width: 500px;
  margin: 32px auto;
  background: #f9f9f9;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 24px;
}

.meni-container h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #2d5c2d;
}

.menu-category {
  margin-bottom: 28px;
}

.menu-category h2 {
  border-bottom: 1.5px solid #b6e2b6;
  margin-bottom: 10px;
  color: #388e3c;
  font-size: 1.2em;
  padding-bottom: 3px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  padding: 8px 0;
  border-bottom: 1px dashed #d0e6d0;
  font-size: 1.07em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-list li:last-child {
  border-bottom: none;
}

.menu-item-name {
  font-weight: 500;
}

.menu-item-price {
  color: #388e3c;
  font-weight: bold;
  margin-left: 12px;
}
</style>
