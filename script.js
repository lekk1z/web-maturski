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

document.getElementById('hamburger').addEventListener('click', function () {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('hidden');
});
document.getElementById('nav-menu').addEventListener('click', function () {
    this.classList.add('hidden');
});
document.getElementById("pocetnabtn").addEventListener("click", function() {
    const stolovi = document.getElementById("stolovi");
    if(stolovi.classList.contains("hidden")) {
            stolovi.classList.remove("hidden");
    }
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
    if(!stolovi.classList.contains("hidden")) {
        stolovi.classList.add("hidden");
    }
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
    if(!stolovi.classList.contains("hidden")) {
        stolovi.classList.add("hidden");
    }
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
    if(!stolovi.classList.contains("hidden")) {
        stolovi.classList.add("hidden");
    }
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
    
});