import { loginWithGoogle, logout, monitorAuthState } from "../firebase/firebaseInit.js";

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();

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

  function mostrarCalendario() {
    const year = anioActual;
    const month = mesActual;
    const fechaActual = new Date(year, month);

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
      <h2 class="encabezado-mes">
  <div class="fila-mes">
    <button id="mes-anterior" class="flecha-mes">◀</button>
    <span class="mes-texto">${fechaActual.toLocaleDateString("es-ES", { month: "long", year: "numeric" }).toUpperCase()}</span>
    <button id="mes-siguiente" class="flecha-mes">▶</button>
  </div>
  <button id="mes-hoy" class="btn-hoy">Hoy <i class="fas fa-calendar-day"></i></button>


</h2>


      <div class="grid-calendario">
        <div class="dia-header">L</div>
        <div class="dia-header">M</div>
        <div class="dia-header">X</div>
        <div class="dia-header">J</div>
        <div class="dia-header">V</div>
        <div class="dia-header">S</div>
        <div class="dia-header">D</div>
    `;

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

      const estiloHoy = esHoy
        ? `background: linear-gradient(to bottom, #ffffff, #1f4b6aff);`
        : "";

      html += `
        <div class="dia" style="border-left: 6px solid ${color}; ${estiloHoy}" title="Turno: ${tipoTurno}">
          <strong>${dia}</strong><br />
          <span class="turno">${tipoTurno}</span>
        </div>`;
    }

    html += `</div></section>`;
    contenido.innerHTML = html;

    // Eventos para cambiar de mes
    document.getElementById("mes-anterior").addEventListener("click", () => {
      mesActual--;
      if (mesActual < 0) {
        mesActual = 11;
        anioActual--;
      }
      mostrarCalendario();
    });

    document.getElementById("mes-siguiente").addEventListener("click", () => {
      mesActual++;
      if (mesActual > 11) {
        mesActual = 0;
        anioActual++;
      }
      mostrarCalendario();
    });

    document.getElementById("mes-hoy").addEventListener("click", () => {
  const ahora = new Date();
  mesActual = ahora.getMonth();
  anioActual = ahora.getFullYear();
  mostrarCalendario();
});

  }
});
