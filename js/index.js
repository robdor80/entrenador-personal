// js/index.js
import { loginWithGoogle, logout, monitorAuthState } from "../firebase/firebaseInit.js";

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const contenido = document.getElementById("contenido");

// Menú móvil
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Login
loginBtn.addEventListener("click", () => {
  loginWithGoogle().catch((error) => {
    console.error("Error al iniciar sesión:", error);
  });
});

logoutBtn.addEventListener("click", () => {
  logout().catch((error) => {
    console.error("Error al cerrar sesión:", error);
  });
});

// Detectar login activo
const userInfo = document.getElementById("user-info");

monitorAuthState((user) => {
  if (user) {
    if (loginBtn) loginBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");
    if (userInfo) {
      userInfo.classList.remove("hidden");
      const nombre = user.displayName || "Usuario";
      userInfo.textContent = `Hola, ${nombre}`;
    }
    mostrarCalendario();
  } else {
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
    if (userInfo) {
      userInfo.classList.add("hidden");
      userInfo.textContent = "";
    }
    contenido.innerHTML = `<p class="aviso">Inicia sesión para acceder al calendario.</p>`;
  }
});



// Calendario base (solo título de momento)
function mostrarCalendario() {
  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const month = fechaActual.getMonth();

  const diasMes = new Date(year, month + 1, 0).getDate();
  const primerDiaSemana = new Date(year, month, 1).getDay(); // 0 = domingo
  const diasAntes = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

  // Fecha base real desde la que empieza tu ciclo MMTTNNSLLLLL
  const fechaBase = new Date("2025-07-04");

  const cicloTurnos = ["M", "M", "T", "T", "N", "N", "S", "L", "L", "L", "L", "L"];
  const colores = {
    M: "red",
    T: "gold",
    N: "royalblue",
    S: "green",
    L: "darkgray"
  };

  let html = `<section class="calendario">
    <h2>${fechaActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).toUpperCase()}</h2>
    <div class="grid-calendario">`;

  // Rellenar días en blanco antes del 1º
  for (let i = 0; i < diasAntes; i++) {
    html += `<div class="dia dia-vacio"></div>`;
  }

  for (let dia = 1; dia <= diasMes; dia++) {
    const fecha = new Date(year, month, dia);
    const diffDias = Math.floor((fecha - fechaBase) / (1000 * 60 * 60 * 24));
    const tipoTurno = cicloTurnos[((diffDias % cicloTurnos.length) + cicloTurnos.length) % cicloTurnos.length];

    const color = colores[tipoTurno] || "#ccc";

    html += `
      <div class="dia" style="border-left: 6px solid ${color}" title="Turno: ${tipoTurno}">
        <strong>${dia}</strong><br />
        <span class="turno">${tipoTurno}</span>
      </div>`;
  }

  html += `</div></section>`;
  contenido.innerHTML = html;
}

