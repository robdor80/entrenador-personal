// historial.js

import { db } from "../firebase/firebaseInit.js";
import { auth } from "../firebase/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const contenedor = document.getElementById("contenedor-historial");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    contenedor.innerHTML = "<p class='tarjeta'>Inicia sesión para ver tu historial.</p>";
    return;
  }

  const ref = doc(db, "historial", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    contenedor.innerHTML = "<p class='tarjeta'>No hay sesiones registradas aún.</p>";
    return;
  }

  const historial = snap.data().sesiones || [];

  historial.reverse().forEach((sesion) => {
    const div = document.createElement("div");
    div.className = "tarjeta";

    div.innerHTML = `
      <h2>${sesion.rutina}</h2>
      <p><strong>Fecha:</strong> ${new Date(sesion.fecha).toLocaleString()}</p>
      <p><strong>Duración:</strong> ${sesion.duracion}</p>
      <details>
        <summary>Ver detalles</summary>
        ${Object.entries(sesion.bloques).map(([titulo, texto]) => `
          <h3>${titulo}</h3>
          <pre>${texto}</pre>
        `).join("")}
      </details>
    `;

    contenedor.appendChild(div);
  });
});
