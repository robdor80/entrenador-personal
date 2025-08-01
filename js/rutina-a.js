// rutina-a.js limpio sin Firebase

let tiempoGeneral = 0;
let intervaloGeneral = null;
let tiempoHIIT = 0;
let intervaloHIIT = null;

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

// CHECKBOXES Y ESTILOS
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tarjeta input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const tarjeta = checkbox.closest(".tarjeta");
      tarjeta.classList.toggle("completada", checkbox.checked);

      // Pausar HIIT si se marca la tarjeta de HIIT
      if (tarjeta.querySelector("#hiit-timer") && checkbox.checked) {
        window.pausarHIIT();
      }

      // Si todos los checks están marcados, se pausa el cronómetro general
      const totalChecks = document.querySelectorAll(".tarjeta input[type='checkbox']").length;
      const checksMarcados = document.querySelectorAll(".tarjeta input[type='checkbox']:checked").length;

      if (totalChecks > 0 && totalChecks === checksMarcados) {
        window.pausarCronoGeneral();
        console.log("✅ Rutina completada.");
      }
    });
  });
});
