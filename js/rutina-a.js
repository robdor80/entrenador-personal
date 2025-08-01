// rutina-a.js

// CRONÓMETRO GENERAL
let tiempoGeneral = 0;
let intervaloGeneral = null;

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

// CRONÓMETRO HIIT
let tiempoHIIT = 0;
let intervaloHIIT = null;

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

// FORMATOS DE TIEMPO
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

// CHECK DE TARJETAS
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tarjeta input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const tarjeta = checkbox.closest(".tarjeta");
      tarjeta.classList.toggle("completada", checkbox.checked);

      // Si es el checkbox de la tarjeta HIIT y se marca, parar el cronómetro HIIT
      if (tarjeta.querySelector("#hiit-timer") && checkbox.checked) {
        pausarHIIT();
      }
    });
  });
});
