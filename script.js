let meni = [
  {
    id: 0,
    name: "Kafa",
    idkategorije: "Topli napici",
    cena: 100,
  },
  {
    id: 1,
    name: "Caj",
    idkategorije: "Topli napici",
    cena: 80,
  },
  {
    id: 2,
    name: "Cokolada",
    idkategorije: "Topli napici",
    cena: 120,
  },
  {
    id: 3,
    name: "Coca-cola",
    idkategorije: "Hladna pica",
    cena: 100,
  },
  {
    id: 4,
    name: "Fanta",
    idkategorije: "Hladna pica",
    cena: 100,
  },
  {
    id: 5,
    name: "Sprite",
    idkategorije: "Hladna pica",
    cena: 100,
  },
  {
    id: 6,
    name: "Pomfrit",
    idkategorije: "Fast Food",
    cena: 150,
  },
  {
    id: 7,
    name: "Pica",
    idkategorije: "Fast Food",
    cena: 300,
  },
  {
    id: 8,
    name: "Hamburger",
    idkategorije: "Fast Food",
    cena: 350,
  },
  {
    id: 9,
    name: "Torta",
    idkategorije: "Dezert",
    cena: 200,
  },
  {
    id: 10,
    name: "Kolac",
    idkategorije: "Dezert",
    cena: 150,
  },
  {
    id: 11,
    name: "Sladoled",
    idkategorije: "Dezert",
    cena: 120,
  },
];
let users = [
  {
    id: 0,
    name: "Marko",
  },
  {
    id: 1,
    name: "Ana",
  },
  {
    id: 2,
    name: "Petar",
  },
];
let currentUser = users[0];
let tables = [
  {
    id: 0,
    occupied: false,
    serverID: 0,
    orders: [],
    rezervacije: [
      {
        idRezervacije: 0,
        imeKlijenta: "Marko",
        datum: new Date("2025-04-19T10:00:00"),
      },
      {
        idRezervacije: 1,
        imeKlijenta: "Ana",
        datum: new Date("2025-04-19T15:00:00"),
      },
      {
        idRezervacije: 2,
        imeKlijenta: "Goran",
        datum: new Date("2025-04-19T20:00:00"),
      },
    ],
  },
  {
    id: 1,
    occupied: true,
    serverID: 1,
    orders: [
      { id: 7, kolicina: 2 },
      { id: 3, kolicina: 4 },
      { id: 6, kolicina: 1 },
    ],
    rezervacije: [
      {
        idRezervacije: 0,
        imeKlijenta: "Nikola",
        datum: new Date("2025-04-19T16:00:00"),
      },
    ],
  },
  {
    id: 2,
    occupied: false,
    serverID: 0,
    orders: [],
    rezervacije: [],
  },
];
const floorPlan = document.getElementById("stolovi");
const editFloorPlan = document.getElementById("editFloorPlan");
document.getElementById("hamburger").addEventListener("click", function () {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("hidden");
});
document.getElementById("nav-menu").addEventListener("click", function () {
  this.classList.add("hidden");
});
document.getElementById("pocetnabtn").addEventListener("click", function () {
  const stolovi = document.getElementById("stolovi");
  stolovi.style.display = "grid";
  const meni = document.getElementById("meni");
  if (!meni.classList.contains("hidden")) {
    meni.classList.add("hidden");
  }
  const rezervacije = document.getElementById("rezervacije");
  if (!rezervacije.classList.contains("hidden")) {
    rezervacije.classList.add("hidden");
  }
  const podesavanja = document.getElementById("podesavanja");
  if (!podesavanja.classList.contains("hidden")) {
    podesavanja.classList.add("hidden");
  }
});

document.getElementById("menibtn").addEventListener("click", function () {
  const meni = document.getElementById("meni");
  if (meni.classList.contains("hidden")) {
    meni.classList.remove("hidden");
  }
  const stolovi = document.getElementById("stolovi");
  stolovi.style.display = "none";
  const rezervacije = document.getElementById("rezervacije");
  if (!rezervacije.classList.contains("hidden")) {
    rezervacije.classList.add("hidden");
  }
  const podesavanja = document.getElementById("podesavanja");
  if (!podesavanja.classList.contains("hidden")) {
    podesavanja.classList.add("hidden");
  }
});

document
  .getElementById("rezervacijebtn")
  .addEventListener("click", function () {
    const rezervacije = document.getElementById("rezervacije");
    if (rezervacije.classList.contains("hidden")) {
      rezervacije.classList.remove("hidden");
    }
    const meni = document.getElementById("meni");
    if (!meni.classList.contains("hidden")) {
      meni.classList.add("hidden");
    }
    const stolovi = document.getElementById("stolovi");
    stolovi.style.display = "none";
    const podesavanja = document.getElementById("podesavanja");
    if (!podesavanja.classList.contains("hidden")) {
      podesavanja.classList.add("hidden");
    }
  });

document
  .getElementById("podesavanjabtn")
  .addEventListener("click", function () {
    const podesavanja = document.getElementById("podesavanja");
    if (podesavanja.classList.contains("hidden")) {
      podesavanja.classList.remove("hidden");
    }
    const meni = document.getElementById("meni");
    if (!meni.classList.contains("hidden")) {
      meni.classList.add("hidden");
    }
    const rezervacije = document.getElementById("rezervacije");
    if (!rezervacije.classList.contains("hidden")) {
      rezervacije.classList.add("hidden");
    }
    const stolovi = document.getElementById("stolovi");
    stolovi.style.display = "none";
  });
document.getElementById("user").addEventListener("click", function () {
  const usermenu = document.getElementById("change-user-container");
  usermenu.classList.toggle("hidden");
});
document
  .getElementById("change-user-button")
  .addEventListener("click", function () {
    const usermenu = document.getElementById("change-user-container");
    usermenu.classList.toggle("hidden");
    const user = document.getElementById("user");
    let userText = document.getElementById("user-select").value;
    currentUser = users.find((user) => user.name === userText);
    user.textContent = "Zdravo, " + currentUser.name + "!";
    renderTables();
    //console.log(currentUser.name);
  });
/*document
  .getElementById("dialog-container")
  .addEventListener("click", function (event) {
    const dialogBox = document.getElementById("dialog-box");
    if (!dialogBox.contains(event.target)) {
      closeDiag();
    }
  });
*/
document
  .getElementById("dialog-box")
  .addEventListener("click", function (event) {
    event.stopPropagation();
  });
const dialog = document.getElementById("dialog-container");
const dialogcontent = document.getElementById("dialog-content");
function closeDiag() {
  dialog.style.display = "none";
  dialogcontent.innerHTML = "";
}

function openDiag(content) {
  dialogcontent.innerHTML = content;
  dialog.style.display = "flex";
}
function ukupnaCena(idStola) {
  const table = tables.find((t) => t.id === idStola);
  let total = 0;
  table.orders.forEach((item) => {
    let meniItem = meni.find((m) => m.id === item.id);
    total += item.kolicina * meniItem.cena;
  });
  return total;
}

function renderTables() {
  floorPlan.innerHTML = "";
  tables.forEach((table) => {
    if (table.serverID == currentUser.id) {
      const div = document.createElement("div");
      div.className = "table" + (table.occupied ? " occupied" : "");
      div.innerText = `Table ${table.id}`;
      div.onclick = () => renderSingleTable(table.id);
      floorPlan.appendChild(div);
    }
  });
}
function renderSingleTable(tableid) {
  {
    let table = tables.find((t) => t.id === tableid);
    let content = `<h2>Table ${table.id}</h2>`;
    if (table.occupied) {
      content += `<p><strong>Porudzbina:</strong></p><ul>`;
      table.orders.sort();
      table.orders.forEach((item) => {
        let meniItem = meni.find((m) => m.id === item.id);
        content += `<li>${item.kolicina} x ${meniItem.name} (${
          meniItem.cena
        }RSD) <span class='right-side'>${
          item.kolicina * meniItem.cena
        }RSD</li>`;
      });
      content += `</ul>`;
      content += `<h3>Racun: <span class="right-side">${ukupnaCena(
        table.id
      )}RSD</span></h3>`;
    }
    content += `<p><strong>Rezervacije:</strong></p><ul>`;
    if (table.rezervacije.length === 0) {
      content += `<li>No reservations</li>`;
    } else {
      table.rezervacije.forEach((res) => {
        content += `<li>${res.imeKlijenta} - ${res.datum.toLocaleString(
          "en-GB"
        )}</li>`;
      });
    } 
    content += `</ul>`;
    if (!table.occupied) {
      content += `<button onclick="zapocniracun(${table.id})">Zapocni racun</button>`;
    } else {
      content += `<button onclick="dodajhranu(${table.id})">Dodaj stavke</button>`;
      content += `<button onclick="printRacun(${table.id})">Odstampaj racun</button>`;
    }
    openDiag(content);
  }
}
function dodajhranu(idStola) {
  let table = tables.find((t) => t.id === idStola);
  let content = `<div><h2>Dodaj stavku</h2><div id="meni"></div>`;
  const meniContainer = document.createElement("div");
  meniContainer.className = "meni-container";

  const groupedMeni = meni.reduce((acc, item) => {
    if (!acc[item.idkategorije]) {
      acc[item.idkategorije] = [];
    }
    acc[item.idkategorije].push(item);
    return acc;
  }, {});

  Object.keys(groupedMeni).forEach((categoryId) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "meni-category";
    categoryDiv.innerHTML = `<h3>${categoryId}</h3>`;
    groupedMeni[categoryId].forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "meni-item";
      const order = table.orders.find((o) => o.id === item.id) || {
        kolicina: 0,
      };
      itemDiv.innerHTML = `
                <span>${item.name} (${item.cena}RSD)</span>
                <button onclick="dodajStavku(${item.id}, ${idStola})">+</button>
                <span id="kolicina-${item.id}-${idStola}">${order.kolicina}</span>
                <button id='minusbtn' onclick="oduzmiStavku(${item.id}, ${idStola})">-</button>
            `;
      categoryDiv.appendChild(itemDiv);
    });
    meniContainer.appendChild(categoryDiv);
  });

  content += meniContainer.outerHTML;
  content += `<button id="closebtn" onclick="renderSingleTable(${idStola})">OK</button>`;
  openDiag(content);
}
function dodajStavku(idHrane, idStola) {
  const table = tables.find((t) => t.id === idStola);
  if (!table.orders.find((o) => o.id === idHrane)) {
    table.orders.push({ id: idHrane, kolicina: 1 });
  } else table.orders.find((o) => o.id === idHrane).kolicina++;
  dodajhranu(idStola);
}
function oduzmiStavku(idHrane, idStola) {
  const table = tables.find((t) => t.id === idStola);
  if (
    table.orders.find((o) => o.id === idHrane) &&
    table.orders.find((o) => o.id === idHrane).kolicina > 0
  ) {
    table.orders.find((o) => o.id === idHrane).kolicina--;
  } else {
    const minusbtn = document.getElementById("minusbtn");
    console.log(meni.find((m) => m.id === idHrane).name);
    minusbtn.disabled = true;
    minusbtn.style.cursor = "not-allowed";
    // dodajhranu(idStola);
  }
  dodajhranu(idStola);
}
function zapocniracun(idStola) {
  const table = tables.find((t) => t.id === idStola);
  table.occupied = true;
  renderTables();
  closeDiag();
  dodajhranu(idStola);
}
function printRacun(idStola) {
  const table = tables.find((t) => t.id === idStola);
  table.occupied = false;
  table.orders = [];
  renderTables();
  closeDiag();
}
renderTables();
renderMeni();
function renderMeni() {
  const meniContainer = document.getElementById("meni");
  meniContainer.innerHTML = "";

  const groupedMeni = meni.reduce((acc, item) => {
    if (!acc[item.idkategorije]) {
      acc[item.idkategorije] = [];
    }
    acc[item.idkategorije].push(item);
    return acc;
  }, {});

  Object.keys(groupedMeni).forEach((categoryId) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "meni-category";
    categoryDiv.innerHTML = `<h3>${categoryId}</h3>`;
    groupedMeni[categoryId].forEach((item) => {
      const div = document.createElement("div");
      div.className = "meni-item";
      div.innerHTML = `
  <span class="item-name">${item.name}</span> 
  <span class="item-price">${item.cena}RSD</span>
`;
      categoryDiv.appendChild(div);
    });
    categoryDiv.innerHTML += "<hr>";
    meniContainer.appendChild(categoryDiv);
  });
}
function renderEditableTables() {
  editFloorPlan.innerHTML = "";
  tables.forEach((table, index) => {
    const div = document.createElement("div");
    div.className = "table draggable";
    div.innerText = `Table ${table.id}`;
    div.title = "Drag to move | Click to remove";
    div.draggable = true;
    div.ondragstart = (e) => {
      e.dataTransfer.setData("text/plain", index);
    };
    div.ondragover = (e) => {
      e.preventDefault();
    };
    div.ondrop = (e) => {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData("text/plain");
      const toIndex = index;
      const dragged = tables[fromIndex];
      tables.splice(fromIndex, 1);
      tables.splice(toIndex, 0, dragged);
      renderEditableTables();
    };
    div.onclick = () => {
      if (confirm(`Remove Table ${table.id}?`)) {
        tables.splice(index, 1);
        renderEditableTables();
      }
    };
    editFloorPlan.appendChild(div);
  });
}
renderEditableTables();
function addTable() {
  const newId = tables.length ? Math.max(...tables.map((t) => t.id)) + 1 : 1;
  const serverOptions = users
    .map((user) => `${user.id}: ${user.name}`)
    .join("\n");
  const serverIDthis = parseInt(
    prompt(`Select the server for the new table:\n${serverOptions}`),
    10
  );
  tables.push({ id: newId,serverID:serverIDthis, orders:[],occupied: false, rezervacije: [] });
  renderEditableTables();
}
