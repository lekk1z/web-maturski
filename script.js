let users=[{
    id: 0,
    name: "Marko"
},
{
    id: 1,
name:"Ana"},
{
    id: 2,
name:"Petar"},];
let currentUser=users[0];
let tables=[{
    id:0, occupied:false, serverID:0, orders:[], rezervacije:[{
        idRezervacije:0,
        imeKlijenta:"Marko",
        datum:new Date("2025-04-19T10:00:00")
    },
{
        idRezervacije:1,
        imeKlijenta:"Ana",
        datum:new Date("2025-04-19T15:00:00")
},
{
        idRezervacije:2,
        imeKlijenta:"Goran",
        datum:new Date("2025-04-19T20:00:00")
    }]},
    {
    id:1, occupied:true, serverID:1, orders:["Pica", "Coca-cola","Pomfrit"], rezervacije:[{idRezervacije:0,
        imeKlijenta:"Nikola",
        datum:new Date("2025-04-19T16:00:00")}]},
    {
        id:2, occupied:false, serverID:0, orders:[], rezervacije:[]},
];
const floorPlan = document.getElementById("stolovi");
document.getElementById('hamburger').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
});
document.getElementById('nav-menu').addEventListener('click', function () {
    this.classList.add('hidden');
});
document.getElementById("pocetnabtn").addEventListener("click", function() {
    const stolovi = document.getElementById("stolovi");
   stolovi.style.display = "grid";
    const meni= document.getElementById("meni");
    if(!meni.classList.contains("hidden")) {
        meni.classList.add("hidden");
    }
    const rezervacije = document.getElementById("rezervacije");
    if(!rezervacije.classList.contains("hidden")) {
        rezervacije.classList.add("hidden");
    }
    const podesavanja = document.getElementById("podesavanja");
    if(!podesavanja.classList.contains("hidden")) {
        podesavanja.classList.add("hidden");
    }
});

document.getElementById("menibtn").addEventListener("click", function() {
    const meni= document.getElementById("meni");
    if(meni.classList.contains("hidden")) {
        meni.classList.remove("hidden");
    }
    const stolovi = document.getElementById("stolovi");
   stolovi.style.display = "none";
    const rezervacije = document.getElementById
("rezervacije");
    if(!rezervacije.classList.contains("hidden")) {
        rezervacije.classList.add("hidden");
    }
    const podesavanja = document.getElementById("podesavanja");
    if(!podesavanja.classList.contains("hidden")) {
        podesavanja.classList.add("hidden");
    }
}
);

document.getElementById("rezervacijebtn").addEventListener("click", function() {
    const rezervacije = document.getElementById("rezervacije");
    if(rezervacije.classList.contains("hidden")) {
        rezervacije.classList.remove("hidden");
    }
    const meni= document.getElementById("meni");
    if(!meni.classList.contains("hidden")) {
        meni.classList.add("hidden");
    }
    const stolovi = document.getElementById("stolovi");
    stolovi.style.display = "none";
    const podesavanja = document.getElementById("podesavanja");
    if(!podesavanja.classList.contains("hidden")) {
        podesavanja.classList.add("hidden");
    }
}
);

document.getElementById("podesavanjabtn").addEventListener("click", function() {
    const podesavanja = document.getElementById("podesavanja");
    if(podesavanja.classList.contains("hidden")) {
        podesavanja.classList.remove("hidden");
    }
    const meni= document.getElementById("meni");
    if(!meni.classList.contains("hidden")) {
        meni.classList.add("hidden");
    }
    const rezervacije = document.getElementById("rezervacije");
    if(!rezervacije.classList.contains("hidden")) {
        rezervacije.classList.add("hidden");
    }
    const stolovi = document.getElementById("stolovi");
    stolovi.style.display = "none";
    
});
document.getElementById("user").addEventListener("click", function() {
    const usermenu = document.getElementById("change-user-container");
    usermenu.classList.toggle("hidden");
});
document.getElementById("change-user-button").addEventListener("click", function() {
    const usermenu = document.getElementById("change-user-container");
    usermenu.classList.toggle("hidden");
    const user = document.getElementById("user");
    let userText = document.getElementById("user-select").value;
    currentUser = users.find(user => user.name === userText);
    user.textContent = "Zdravo, "+currentUser.name+"!";
    renderTables();
    //console.log(currentUser.name);
    
});
document.getElementById("dialog-container").addEventListener("click", function (event) {
    const dialogBox = document.getElementById("dialog-box");
    if (!dialogBox.contains(event.target)) {
        closeDiag();
    }
});
const dialog = document.getElementById("dialog-container");
const dialogcontent = document.getElementById("dialog-content");
function closeDiag() {
    dialog.style.display = "none";
}
function openDiag(content) {
    dialogcontent.innerHTML = content;
    dialog.style.display = "flex";
};

function renderTables() {
    floorPlan.innerHTML = "";
    tables.forEach(table => {if(table.serverID==currentUser.id) {
      const div = document.createElement("div");
      div.className = "table" + (table.occupied ? " occupied" : "");
      div.innerText = `Table ${table.id}`;
      div.onclick = () => {
        let content = `<h2>Table ${table.id}</h2>`;
        if (table.occupied) {
          content += `<p><strong>Current Orders:</strong></p><ul>`;
          table.orders.forEach(item => {
            content += `<li>${item}</li>`;
          });
          content += `</ul>`;
        } else {
          content += `<p><strong>Upcoming Reservations:</strong></p><ul>`;
          if (table.rezervacije.length === 0) {
            content += `<li>No reservations</li>`;
          } else {
            table.rezervacije.forEach(res => {
              content += `<li>${res.imeKlijenta} - ${res.datum.toLocaleString('en-GB')}</li>`;
            });
          }
          content += `</ul><button onclick="zapocniracun(${table.id})">Zapocni racun</button>`;
         
        }
        content += `<button onclick="dodajhranu()">Dodaj stavke</button>`;
        content += `<button onclick="printRacun()">Odstampaj racun</button>`;
        openDiag(content);
      };
      floorPlan.appendChild(div);
}});
  }
  function zapocniracun(idStola) {
    const table = tables.find(t => t.id === idStola);
        table.occupied = true;
        table.serverID = currentUser.id;
        renderTables();
        closeDiag();
        dodajhranu(idStola);
    }
  renderTables();
