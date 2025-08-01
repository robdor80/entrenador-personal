// rutina-a.js

import { db } from "../firebase/firebaseInit.js";
import { doc, setDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let tiempoGeneral = 0;
let intervaloGeneral = null;
let tiempoHIIT = 0;
let intervaloHIIT = null;
let usuario = null;

// Detectar usuario
onAuthStateChanged(auth, (user) => {
  if (user) usuario = user;
});

// CRONÓMETRO GENERAL
window.iniciarCronoGeneral = function () {
  if (intervaloGeneral) return;
  intervaloGeneral = setInterval(() => {
    tiempoGeneral++;
    document.getElementById("tiempo-general").textContent = formatearTiempo(tiempoGeneral);
  }, 1000);
};

window.pausarCronoGeneral = function () {
  clearInterval(intervaloGeneral);
  intervaloGeneral = null;
};

window.reiniciarCronoGeneral = function () {
  window.pausarCronoGeneral();
  tiempoGeneral = 0;
  document.getElementById("tiempo-general").textContent = "00:00:00";
};

// CRONÓMETRO HIIT
window.iniciarHIIT = function () {
  if (intervaloHIIT) return;
  intervaloHIIT = setInterval(() => {
    tiempoHIIT++;
    document.getElementById("hiit-timer").textContent = formatearMinSeg(tiempoHIIT);
  }, 1000);
};

window.pausarHIIT = function () {
  clearInterval(intervaloHIIT);
  intervaloHIIT = null;
};

window.reiniciarHIIT = function () {
  window.pausarHIIT();
  tiempoHIIT = 0;
  document.getElementById("hiit-timer").textContent = "00:00";
};

// FORMATO TIEMPOS
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

// CHECKBOXES
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tarjeta input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const tarjeta = checkbox.closest(".tarjeta");
      tarjeta.classList.toggle("completada", checkbox.checked);

      if (tarjeta.querySelector("#hiit-timer") && checkbox.checked) {
        window.pausarHIIT();
      }

      const totalChecks = document.querySelectorAll(".tarjeta input[type='checkbox']").length;
      const checksMarcados = document.querySelectorAll(".tarjeta input[type='checkbox']:checked").length;

      if (totalChecks > 0 && totalChecks === checksMarcados) {
        window.pausarCronoGeneral();
        guardarRutinaEnHistorial();
      }
    });
  });
});

// GUARDAR EN FIREBASE
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
