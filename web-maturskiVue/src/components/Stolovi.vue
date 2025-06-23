<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  user: Object,
});

const tables = ref([]);
const loading = ref(true);
const error = ref(null);

const showPopup = ref(false);
const selectedTable = ref(null);

const showMenuPopup = ref(false);
const menuItems = ref([]);
const menuLoading = ref(false);
const menuError = ref(null);

const selectedOrderItems = ref({}); 


const orders = ref([]);

const reservations = ref([]);

const showEditOrderPopup = ref(false);
const editOrderItems = ref({}); 

async function fetchTables() {
  loading.value = true;
  try {
    const res = await fetch("http://localhost:8080/api/tables");
    if (!res.ok) throw new Error("Greska pri preuzimanju stolova");
    tables.value = await res.json();
    error.value = null;

    const ordersRes = await fetch("http://localhost:8080/api/orders");
    if (!ordersRes.ok) throw new Error("Greška pri preuzimanju porudžbina");
    orders.value = await ordersRes.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function fetchReservations() {
  try {
    const res = await fetch("http://localhost:8080/api/reservations");
    if (!res.ok) throw new Error("Greška pri preuzimanju rezervacija");
    reservations.value = await res.json();
  } catch (e) {
  }
}

function izmeniSto(id) {
  const table = tables.value.find((t) => t.id === id);
  selectedTable.value = table;
  showPopup.value = true;
}

function closePopup() {
  showPopup.value = false;
  selectedTable.value = null;
}


async function openMenuPopup() {
  menuLoading.value = true;
  showMenuPopup.value = true;
  selectedOrderItems.value = {}; 
  try {
    const res = await fetch("http://localhost:8080/api/menu");
    if (!res.ok) throw new Error("Greška pri preuzimanju menija");
    menuItems.value = await res.json();
    menuError.value = null;
  } catch (e) {
    menuError.value = e.message;
  } finally {
    menuLoading.value = false;
  }
}

function closeMenuPopup() {
  showMenuPopup.value = false;
}

function addItemToOrder(item) {
  const id = item.id;
  if (!selectedOrderItems.value[id]) {
    selectedOrderItems.value[id] = { ...item, quantity: 1 };
  } else {
    selectedOrderItems.value[id].quantity += 1;
  }
}

function removeItemFromOrder(item) {
  const id = item.id;
  if (selectedOrderItems.value[id]) {
    if (selectedOrderItems.value[id].quantity > 1) {
      selectedOrderItems.value[id].quantity -= 1;
    } else {
      delete selectedOrderItems.value[id];
    }
  }
}

async function confirmOrder() {
  if (!selectedTable.value) return;
  const orderItems = Object.values(selectedOrderItems.value)
    .filter((i) => i.quantity > 0)
    .map((i) => ({
      menuItemId: i.id,
      quantity: i.quantity,
    }));
  if (orderItems.length === 0) {
    closeMenuPopup();
    return;
  }
  try {
    // 1. Create the order
    const orderRes = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: selectedTable.value.id,
        items: orderItems,
      }),
    });
    if (!orderRes.ok) throw new Error("Greška pri slanju porudžbine");
    const order = await orderRes.json();

    // 2. Update the table with the new order ID
    const updatedOrdersId = Array.isArray(selectedTable.value.ordersId)
      ? [...selectedTable.value.ordersId, order.id]
      : [order.id];

    await fetch(`http://localhost:8080/api/tables/${selectedTable.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selectedTable.value,
        ordersId: updatedOrdersId,
      }),
    });

    
    await fetchTables();

    const tableId = selectedTable.value.id;
    closePopup();
    // Wait for next tick to ensure DOM updates
    setTimeout(() => {
      izmeniSto(tableId);
    }, 0);
  } catch (e) {
    alert(e.message || "Greška pri slanju porudžbine");
  } finally {
    closeMenuPopup();
  }
}


function changeTableoccupancy(occupiedBool) {
  if (!selectedTable.value) return;
  selectedTable.value.occupied = occupiedBool;
  const idx = tables.value.findIndex((t) => t.id === selectedTable.value.id);
  if (idx !== -1) tables.value[idx].occupied = occupiedBool;

  fetch(`http://localhost:8080/api/tables/${selectedTable.value.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...selectedTable.value, occupied: occupiedBool }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Greška pri ažuriranju stola");
      return res.json();
    })
    .catch((e) => {
      alert(e.message || "Greška pri ažuriranju stola");
    });
}


const CATEGORY_MAP = {
  1: "Hladni napici",
  2: "Topli napici",
  3: "Hrana",
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

function getTableOrders(table) {
  if (table.orderId) {
    return orders.value.filter((o) => o.id === table.orderId);
  }
  if (Array.isArray(table.ordersId)) {
    return orders.value.filter((o) => table.ordersId.includes(o.id));
  }
  return [];
}

function getUniqueOrderedItems(table) {
  const ordersForTable = getTableOrders(table);
  const itemMap = {};
  ordersForTable.forEach((order) => {
    (order.items || []).forEach((item) => {
      const id = item.menuItemId;
      const menuItem = menuItems.value.find((m) => String(m.id) === String(id));
      if (!itemMap[id]) {
        itemMap[id] = {
          menuItemId: id,
          name: menuItem ? menuItem.name : item.name || "Nepoznato",
          quantity: item.quantity,
        };
      } else {
        itemMap[id].quantity += item.quantity;
      }
    });
  });
  return Object.values(itemMap);
}

function itemPrice(item) {
  const menuItem = menuItems.value.find(
    (m) => String(m.id) === String(item.menuItemId)
  );
  return menuItem ? menuItem.price : item.price || 0;
}
function itemTotal(item) {
  return itemPrice(item) * item.quantity;
}

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch tables
    const res = await fetch("http://localhost:8080/api/tables");
    if (!res.ok) throw new Error("Greska pri preuzimanju stolova");
    tables.value = await res.json();
    error.value = null;

    // Fetch all orders
    const ordersRes = await fetch("http://localhost:8080/api/orders");
    if (!ordersRes.ok) throw new Error("Greška pri preuzimanju porudžbina");
    orders.value = await ordersRes.json();

    // Fetch menu items
    const menuRes = await fetch("http://localhost:8080/api/menu");
    if (!menuRes.ok) throw new Error("Greška pri preuzimanju menija");
    menuItems.value = await menuRes.json();
    menuError.value = null;

    // Fetch reservations
    await fetchReservations();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// Helper to get today's date in YYYY-MM-DD format
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getTodaysReservations(table) {
  if (!table) return [];
  const today = todayISO();
  return reservations.value.filter(
    (r) => r.tableId === table.id && r.date && r.date.slice(0, 10) === today
  );
}

async function printBillAndClearTable() {
  if (!selectedTable.value) return;
  try {
    // Clear ordersId and set occupied to false
    await fetch(`http://localhost:8080/api/tables/${selectedTable.value.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...selectedTable.value,
        ordersId: [],
        occupied: false,
      }),
    });
    await fetchTables();
    closePopup();
  } catch (e) {
    alert(e.message || "Greška pri štampanju računa i oslobađanju stola");
  }
  try {
    const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Greška pri brisanju računa");
    await fetchOrders();
    alert("Račun je odštampan i obrisan!");
  } catch (e) {
    alert(e.message || "Greška pri brisanju računa");
  }
}

function openEditOrderPopup() {
  editOrderItems.value = {};
  getUniqueOrderedItems(selectedTable.value).forEach((item) => {
    editOrderItems.value[item.menuItemId] = { ...item };
  });
  showEditOrderPopup.value = true;
}

function closeEditOrderPopup() {
  showEditOrderPopup.value = false;
}

async function saveEditedOrder() {
  const newItems = Object.values(editOrderItems.value)
    .filter((i) => i.quantity > 0)
    .map((i) => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity,
    }));
  const tableOrders = getTableOrders(selectedTable.value);
  if (tableOrders.length === 0) return closeEditOrderPopup();
  const latestOrder = tableOrders[tableOrders.length - 1];
  await fetch(`http://localhost:8080/api/orders/${latestOrder.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...latestOrder, items: newItems }),
  });
  await fetchTables();
  closeEditOrderPopup();
}
</script>

<template>
  <div class="stolovi">
    <h2>Stolovi</h2>
    <div v-if="loading">Učitavanje...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="tables.length === 0">Nema stolova.</div>
      <div class="tables-list">
        <div
          v-for="table in tables.filter((t) =>
            props.user?.superuser
              ? true
              : Array.isArray(props.user?.tableIds)
              ? props.user.tableIds.includes(t.id)
              : true
          )"
          :key="table.id"
          class="table-card"
          :class="{ occupied: table.occupied }"
          @click="izmeniSto(table.id)"
        >
          <h3>Sto #{{ table.number }}</h3>
          <p>Status: {{ table.occupied ? "Zauzet" : "Slobodan" }}</p>
        </div>
      </div>
    </div>
    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-box">
        <button class="close-btn" @click="closePopup">×</button>
        <h3>Sto #{{ selectedTable.number }}</h3>
        <p>Status: {{ selectedTable.occupied ? "Zauzet" : "Slobodan" }}</p>
        <h4>Poručene stavke:</h4>
        <ul>
          <li v-if="getTableOrders(selectedTable).length === 0">
            Nema poručenih stavki.
          </li>
          <li
            v-for="item in getUniqueOrderedItems(selectedTable)"
            :key="item.menuItemId"
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span>
              {{ item.name }}
              x{{ item.quantity }}
              <span style="color: #888; font-size: 0.95em">
                ({{ itemPrice(item) }} × {{ item.quantity }} =
                {{ itemTotal(item) }} EUR)
              </span>
            </span>
          </li>
          <li
            v-if="getUniqueOrderedItems(selectedTable).length > 0"
            style="
              margin-top: 8px;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
            "
          >
            <span>Ukupno:</span>
            <span>
              {{
                getUniqueOrderedItems(selectedTable).reduce(
                  (sum, item) => sum + itemTotal(item),
                  0
                )
              }}
              EUR
            </span>
          </li>
        </ul>

        <h4>Rezervacije za danas ({{ todayISO() }}):</h4>
        <ul>
          <li v-if="getTodaysReservations(selectedTable).length === 0">
            Nema rezervacija za danas.
          </li>
          <li v-for="rez in getTodaysReservations(selectedTable)" :key="rez.id">
            {{ rez.date ? rez.date.slice(11, 16) : "" }} -
            {{ rez.name ? rez.name : "Nepoznat gost" }}
          </li>
        </ul>

        <button
          v-if="!selectedTable.occupied"
          @click="changeTableoccupancy(true)"
        >
          Sedi korisnika
        </button>
        <button v-else @click="printBillAndClearTable">Odstampaj racun</button>

        <button @click="openMenuPopup" v-if="selectedTable.occupied">
          Dodaj stavku na račun
        </button>

        <button
          v-if="
            selectedTable.occupied &&
            getUniqueOrderedItems(selectedTable).length > 0
          "
          @click="openEditOrderPopup"
          style="margin-top: 10px"
        >
          Izmeni porudžbinu
        </button>
      </div>
    </div>

    <!-- Menu popup -->
    <div v-if="showMenuPopup" class="popup-overlay">
      <div class="popup-box menu-popup-box">
        <button class="close-btn" @click="closeMenuPopup">×</button>
        <h3>Dodaj stavku</h3>
        <div v-if="menuLoading">Učitavanje...</div>
        <div v-else-if="menuError" style="color: red">{{ menuError }}</div>
        <div v-else class="menu-grid-scroll">
          <template
            v-for="(items, category) in groupMenuByCategory(menuItems)"
            :key="category"
          >
            <div class="menu-category-divider">{{ category }}</div>
            <div class="menu-grid">
              <div v-for="item in items" :key="item.id" class="menu-grid-item">
                <button id="no-color" @click="addItemToOrder(item)">
                  {{ item.name }}<br />
                  <span class="menu-price">{{ item.price }} EUR</span>
                  <span v-if="selectedOrderItems[item.id]"
                    >x{{ selectedOrderItems[item.id].quantity }}</span
                  >
                </button>
                <button
                  v-if="selectedOrderItems[item.id]"
                  @click="removeItemFromOrder(item)"
                  style="margin-top: 4px; font-size: 0.9em"
                >
                  -
                </button>
              </div>
            </div>
          </template>
        </div>
        <div style="margin-top: 18px; text-align: right">
          <button
            @click="confirmOrder"
            :disabled="Object.keys(selectedOrderItems).length === 0"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Edit order popup -->
    <div v-if="showEditOrderPopup" class="popup-overlay">
      <div class="popup-box menu-popup-box">
        <button class="close-btn" @click="closeEditOrderPopup">×</button>
        <h3>Izmeni porudžbinu</h3>
        <div v-if="Object.keys(editOrderItems).length === 0">
          Nema stavki za izmenu.
        </div>
        <div v-else>
          <div
            v-for="item in Object.values(editOrderItems)"
            :key="item.menuItemId"
            style="
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 10px;
            "
          >
            <span style="min-width: 120px">{{ item.name }}</span>
            <button
              @click="
                item.quantity > 0 && editOrderItems[item.menuItemId].quantity--
              "
              :disabled="item.quantity === 0"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button @click="editOrderItems[item.menuItemId].quantity++">
              +
            </button>
            <button
              @click="editOrderItems[item.menuItemId].quantity = 0"
              style="color: #c62828"
            >
              Ukloni
            </button>
          </div>
          <div style="text-align: right; margin-top: 18px">
            <button @click="saveEditedOrder">Sačuvaj izmene</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stolovi {
  padding: 20px;
}

.tables-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.table-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  min-width: 150px;
  background: #f8fff8;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.table-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-box ul {
  max-height: 600px;
  /* Set a fixed height for scrolling */
  overflow-y: auto;
  /* Enable vertical scrollbar */
  overflow-x: hidden;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.popup-box button {
  margin: 10px 8px 0 0;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #aeeaaa;
  font-weight: bold;
  cursor: pointer;
}

#no-color {
  background-color: #fff;
}

.popup-box button:hover {
  background: #7fd67f;
}

.table-card.occupied {
  background-color: lightcoral;
}

.menu-grid-scroll {
  max-height: 520px;
  overflow-y: auto;
  margin-top: 10px;
}

.menu-category-divider {
  font-weight: bold;
  margin: 12px 0 4px;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #333;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.menu-grid-item {
  background: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  transition: transform 0.2s;
}

.menu-grid-item:hover {
  transform: translateY(-2px);
}

.menu-price {
  color: #333;
  font-weight: bold;
  display: block;
  margin-top: 4px;
  font-weight: bold;
  color: #007bff;
}


.popup-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
  position: relative;
}

.menu-popup-box {
  min-width: 600px;
  max-width: 900px;
  min-height: 400px;
  padding: 2.5rem 3.5rem;
}
</style>
