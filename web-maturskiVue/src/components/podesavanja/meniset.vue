<template>
  <div class="meni-container">
    <h3>Meni</h3>
    <div v-for="(cat, catId) in groupedMenu" :key="catId">
      <h2 class="category-title">{{ categoryName(catId) }}</h2>
      <div v-for="(item, idx) in cat" :key="item.id" class="menu-item">
        <input
          v-model="item.name"
          placeholder="Naziv stavke"
          class="menu-input"
        />
        <input
          v-model.number="item.price"
          type="number"
          placeholder="Cena"
          class="menu-input price"
        />
        <select v-model="item.categoryId" class="menu-select">
          <option :value="1">Topli napici</option>
          <option :value="2">Hladni napici</option>
          <option :value="3">Hrana</option>
          <option :value="4">Dezerti</option>
        </select>
        <button
          @click="deleteItemById(item.id)"
          class="delete-btn"
          title="Obriši"
        >
          🗑️
        </button>
      </div>
    </div>
    <button @click="addItem" class="add-btn" title="Dodaj novu stavku">
      <span>➕ Dodaj stavku</span>
    </button>
    <button @click="saveMenu" class="save-btn" :disabled="saving">
      <span v-if="saving" class="spinner"></span>
      <span v-else>Sačuvaj</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: [],
      saving: false,
      nextId: 100000,
      categories: {
        1: "Topli napici",
        2: "Hladni napici",
        3: "Hrana",
        4: "Dezerti",
      },
    };
  },
  computed: {
    groupedMenu() {
      // Group items by categoryId
      return this.menu.reduce((acc, item) => {
        const cat = item.categoryId;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {});
    },
  },
  methods: {
    categoryName(catId) {
      return this.categories[catId] || "Nepoznata kategorija";
    },
    async fetchMenu() {
      const res = await fetch("http://localhost:8080/api/menu");
      this.menu = await res.json();
      const maxId = this.menu.reduce(
        (max, item) => (item.id > max ? item.id : max),
        0
      );
      this.nextId = maxId + 1;
    },
    async saveMenu() {
      this.saving = true;
      for (const item of this.menu) {
        await fetch(`http://localhost:8080/api/menu/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }
      this.saving = false;
      alert("Meni je ažuriran!");
    },
    async deleteItemById(id) {
      if (!confirm("Da li ste sigurni da želite da obrišete ovu stavku?"))
        return;
      const res = await fetch(`http://localhost:8080/api/menu/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await this.fetchMenu();
      } else {
        alert("Greška pri brisanju stavke.");
      }
    },
    async addItem() {
      const newItem = {
        name: "",
        price: 0,
        categoryId: 4,
      };
      const res = await fetch("http://localhost:8080/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        await this.fetchMenu();
      } else {
        alert("Greška pri dodavanju stavke.");
      }
    },
  },
  mounted() {
    this.fetchMenu();
  },
};
</script>

<style scoped>
.meni-container {
  max-width: 600px;
  margin: 32px auto;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(56, 142, 60, 0.08);
  padding: 24px 20px;
  font-family: "Segoe UI", Arial, sans-serif;
}

h3 {
  text-align: center;
  color: #388e3c;
  margin-bottom: 18px;
  font-weight: 600;
}

.category-title {
  margin-top: 24px;
  margin-bottom: 10px;
  color: #388e3c;
  font-size: 1.1em;
  border-bottom: 1.5px solid #b6e2b6;
  padding-bottom: 3px;
  font-weight: 500;
}

.menu-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 12px 10px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #b6e2b6;
  gap: 10px;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-input,
.menu-select {
  padding: 7px 10px;
  border: 1px solid #b6e2b6;
  border-radius: 5px;
  font-size: 1em;
  background: #fff;
  font-family: inherit;
}

.menu-input {
  flex: 1;
  min-width: 120px;
}

.menu-input.price {
  width: 90px;
  min-width: 70px;
}

.menu-select {
  min-width: 120px;
}

.delete-btn {
  background: #ffebee;
  border: none;
  border-radius: 5px;
  color: #c62828;
  font-size: 1.3em;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  margin-left: 0.5em;
  padding: 6px 14px;
}

.delete-btn:hover {
  background: #c62828;
  color: #fff;
}

.add-btn {
  background: #e0f2e0;
  color: #388e3c;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  margin-bottom: 1em;
  margin-top: 0.5em;
  padding: 7px 18px;
  font-weight: bold;
  transition: background 0.2s, color 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: #388e3c;
  color: #fff;
}

.save-btn {
  width: 100%;
  padding: 0.8em;
  background: #388e3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 1em;
  font-weight: bold;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(56, 142, 60, 0.12);
  transition: background 0.2s;
}

.save-btn:hover {
  background: #25692a;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid #b6e2b6;
  border-top: 3px solid #388e3c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 8px;
  box-sizing: border-box;
  vertical-align: middle;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .meni-container {
    padding: 12px 4vw;
    min-width: unset;
    max-width: 98vw;
  }
  .menu-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
