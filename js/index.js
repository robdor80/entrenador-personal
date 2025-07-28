import { loginWithGoogle, logout, monitorAuthState } from "../firebase/firebaseInit.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const contenido = document.getElementById("contenido");
  const userInfo = document.getElementById("user-info");
  const menuDesktop = document.querySelector(".menu-desktop");

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

  monitorAuthState((user) => {
    if (user) {
      if (loginBtn) loginBtn.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
      if (userInfo) {
        userInfo.classList.remove("hidden");
        const nombre = user.displayName || "Usuario";
        userInfo.textContent = `Hola, ${nombre}`;
      }
      if (menuDesktop) menuDesktop.classList.remove("hidden");
      mostrarCalendario();
    } else {
      if (loginBtn) loginBtn.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
      if (userInfo) {
        userInfo.classList.add("hidden");
        userInfo.textContent = "";
      }
      if (menuDesktop) menuDesktop.classList.add("hidden");
      contenido.innerHTML = `<p class="aviso">Inicia sesión para acceder al calendario.</p>`;
    }
  });

  // Calendario base
  function mostrarCalendario() {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth();

    const diasMes = new Date(year, month + 1, 0).getDate();
    const primerDiaSemana = new Date(year, month, 1).getDay();
    const diasAntes = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    const fechaBase = new Date("2025-07-03");

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

    for (let i = 0; i < diasAntes; i++) {
      html += `<div class="dia dia-vacio"></div>`;
    }

    for (let dia = 1; dia <= diasMes; dia++) {
  const fecha = new Date(year, month, dia);
  const diffDias = Math.floor((fecha - fechaBase) / (1000 * 60 * 60 * 24));
  const tipoTurno = cicloTurnos[((diffDias % cicloTurnos.length) + cicloTurnos.length) % cicloTurnos.length];
  const color = colores[tipoTurno] || "#ccc";

  const hoy = new Date();
  const esHoy =
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();

  const bordeHoy = esHoy ? 'border: 1px solid orange;' : '';

  html += `
    <div class="dia" style="border-left: 6px solid ${color}; ${bordeHoy}" title="Turno: ${tipoTurno}">
      <strong>${dia}</strong><br />
      <span class="turno">${tipoTurno}</span>
    </div>`;
}



    html += `</div></section>`;
    contenido.innerHTML = html;
  }
});
