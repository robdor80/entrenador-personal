// rutina-a.js

import { db } from "../firebase/firebaseInit.js";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let tiempoGeneral = 0;
let intervaloGeneral = null;
let tiempoHIIT = 0;
let intervaloHIIT = null;
let usuario = null;

onAuthStateChanged(auth, (user) => {
  if (user) usuario = user;
});

function iniciarCronoGeneral() {
  if (intervaloGeneral) return;
  intervaloGeneral = setInterval(() => {
    tiempoGeneral++;
    document.getElementById("tiempo-general").textContent = formatearTiempo(tiempoGeneral);
  }, 1000);
}

function pausarCronoGeneral() {
  clearInterval(intervaloGeneral);
  intervaloGeneral = null;
}

function reiniciarCronoGeneral() {
  pausarCronoGeneral();
  tiempoGeneral = 0;
  document.getElementById("tiempo-general").textContent = "00:00:00";
}

function iniciarHIIT() {
  if (intervaloHIIT) return;
  intervaloHIIT = setInterval(() => {
    tiempoHIIT++;
    document.getElementById("hiit-timer").textContent = formatearMinSeg(tiempoHIIT);
  }, 1000);
}

function pausarHIIT() {
  clearInterval(intervaloHIIT);
  intervaloHIIT = null;
}

function reiniciarHIIT() {
  pausarHIIT();
  tiempoHIIT = 0;
  document.getElementById("hiit-timer").textContent = "00:00";
}

function formatearTiempo(segundos) {
  const h = Math.floor(segundos / 3600).toString().padStart(2, '0');
  const m = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatearMinSeg(segundos) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Asignar eventos a botones del cronómetro general
  document.querySelector("button[onclick='iniciarCronoGeneral()']")?.addEventListener("click", iniciarCronoGeneral);
  document.querySelector("button[onclick='pausarCronoGeneral()']")?.addEventListener("click", pausarCronoGeneral);
  document.querySelector("button[onclick='reiniciarCronoGeneral()']")?.addEventListener("click", reiniciarCronoGeneral);

  // Asignar eventos a botones del HIIT
  document.querySelector("button[onclick='iniciarHIIT()']")?.addEventListener("click", iniciarHIIT);
  document.querySelector("button[onclick='pausarHIIT()']")?.addEventListener("click", pausarHIIT);
  document.querySelector("button[onclick='reiniciarHIIT()']")?.addEventListener("click", reiniciarHIIT);

  // Eventos para los checks
  document.querySelectorAll(".tarjeta input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const tarjeta = checkbox.closest(".tarjeta");
      tarjeta.classList.toggle("completada", checkbox.checked);

      if (tarjeta.querySelector("#hiit-timer") && checkbox.checked) {
        pausarHIIT();
      }

      const totalChecks = document.querySelectorAll(".tarjeta input[type='checkbox']").length;
      const checksMarcados = document.querySelectorAll(".tarjeta input[type='checkbox']:checked").length;
      if (totalChecks > 0 && totalChecks === checksMarcados) {
        pausarCronoGeneral();
        guardarRutinaEnHistorial();
      }
    });
  });
});

async function guardarRutinaEnHistorial() {
  if (!usuario) return;

  const datos = {
    rutina: "Rutina A",
    fecha: new Date().toISOString(),
    duracion: formatearTiempo(tiempoGeneral),
    bloques: {},
  };

  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    const titulo = tarjeta.querySelector("h2")?.textContent || "Bloque";
    const texto = tarjeta.innerText.trim();
    datos.bloques[titulo] = texto;
  });

  const ref = doc(db, "historial", usuario.uid);
  await setDoc(ref, { sesiones: arrayUnion(datos) }, { merge: true });
  console.log("✅ Rutina guardada en historial");
}