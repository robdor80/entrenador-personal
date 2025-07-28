console.log("📦 calendario-v3.js cargado correctamente");

import { auth, db } from "../firebase/firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let mesActual = new Date().getMonth();
let anioActual = new Date().getFullYear();
let usuario = null;
let entrenosGuardados = {};
let diaSeleccionado = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    document.getElementById("contenido").innerHTML =
      "<p class='aviso'>Debes iniciar sesión desde la página principal.</p>";
    return;
  }

  console.log("👤 Usuario logueado:", user.email);
  usuario = user;
  cargarEntrenosDelMes().then(() => {
    mostrarCalendario();
  });
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
    L: "darkgray",
  };

  let html = `<section class="calendario">
    <h2 class="encabezado-mes">
      <div class="fila-mes">
        <button id="mes-anterior" class="flecha-mes">◀</button>
        <span class="mes-texto">${fechaActual.toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        }).toUpperCase()}</span>
        <button id="mes-siguiente" class="flecha-mes">▶</button>
      </div>
      <button id="mes-hoy" class="btn-hoy"><i class="fas fa-calendar-day"></i> Hoy</button>
    </h2>
    <div class="grid-calendario">
      <div class="dia-header">L</div>
      <div class="dia-header">M</div>
      <div class="dia-header">X</div>
      <div class="dia-header">J</div>
      <div class="dia-header">V</div>
      <div class="dia-header">S</div>
      <div class="dia-header">D</div>`;

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
      ? `background: linear-gradient(to bottom, #ffffff, #e3f2fd);`
      : "";

    const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    const entrenoDelDia = entrenosGuardados[fechaStr] || "";

    html += `
      <div class="dia" style="border-left: 6px solid ${color}; ${estiloHoy}" data-dia="${dia}" title="Turno: ${tipoTurno}">
        <strong>${dia}</strong><br />
        <span class="turno">${tipoTurno}</span>
        ${entrenoDelDia ? `<span class="entreno-asignado">${entrenoDelDia}</span>` : ""}
      </div>`;
  }

  html += `</div></section>`;
  document.getElementById("contenido").innerHTML = html;

  document.querySelectorAll(".dia[data-dia]").forEach((diaEl) => {
    diaEl.addEventListener("click", () => {
      diaSeleccionado = parseInt(diaEl.dataset.dia);
      abrirModal();
    });
  });

  document.getElementById("mes-anterior").addEventListener("click", () => {
    mesActual--;
    if (mesActual < 0) {
      mesActual = 11;
      anioActual--;
    }
    cargarEntrenosDelMes().then(() => mostrarCalendario());
  });

  document.getElementById("mes-siguiente").addEventListener("click", () => {
    mesActual++;
    if (mesActual > 11) {
      mesActual = 0;
      anioActual++;
    }
    cargarEntrenosDelMes().then(() => mostrarCalendario());
  });

  document.getElementById("mes-hoy").addEventListener("click", () => {
    const ahora = new Date();
    mesActual = ahora.getMonth();
    anioActual = ahora.getFullYear();
    cargarEntrenosDelMes().then(() => mostrarCalendario());
  });
}

function abrirModal() {
  document.getElementById("modal-entreno").classList.remove("hidden");
  document.querySelectorAll(".entreno-btn").forEach((btn) =>
    btn.classList.remove("seleccionado")
  );
}

function cerrarModal() {
  document.getElementById("modal-entreno").classList.add("hidden");
  diaSeleccionado = null;
}

async function cargarEntrenosDelMes() {
  if (!usuario) return;
  const ref = doc(db, "entrenos", usuario.uid);
  const snap = await getDoc(ref);
  entrenosGuardados = snap.exists() ? snap.data() : {};
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("entreno-btn")) {
    document.querySelectorAll(".entreno-btn").forEach((btn) =>
      btn.classList.remove("seleccionado")
    );
    e.target.classList.add("seleccionado");
  }
});

document.getElementById("guardar-entreno").addEventListener("click", async () => {
  const tipo = document.querySelector(".entreno-btn.seleccionado")?.dataset.tipo;
  if (!tipo || !diaSeleccionado) return;

  const fechaStr = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(diaSeleccionado).padStart(2, "0")}`;
  const ref = doc(db, "entrenos", usuario.uid);
  await setDoc(ref, { [fechaStr]: tipo }, { merge: true });

  entrenosGuardados[fechaStr] = tipo;
  cerrarModal();
  mostrarCalendario();
});

document.getElementById("cancelar-entreno").addEventListener("click", cerrarModal);
