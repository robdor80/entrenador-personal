console.log("📦 calendario-v3.js cargado");

import { auth, db } from "../firebase/firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Verificación de entorno
console.log("✅ Firebase DB disponible:", typeof db);
console.log("✅ Firebase Auth disponible:", typeof auth);

// Mostrar scripts cargados
console.log("📋 Scripts cargados:");
document.querySelectorAll("script").forEach((s, i) =>
  console.log(`${i + 1}.`, s.src || "[inline]")
);

// Detectar errores globales
window.addEventListener("error", (e) => {
  console.error("🔥 ERROR GLOBAL DETECTADO:", e.message, "\nArchivo:", e.filename, "\nLínea:", e.lineno);
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    document.getElementById("contenido").innerHTML =
      "<p class='aviso'>Debes iniciar sesión desde la página principal.</p>";
    return;
  }

  console.log("👤 Usuario logueado:", user.email);

  // Intento de lectura desde Firestore
  try {
    const ref = doc(db, "entrenos", user.uid);  // <-- correctamente como `doc()`, no `collection()`
    const snap = await getDoc(ref);
    if (snap.exists()) {
      console.log("📄 Documento Firestore encontrado:", snap.data());
    } else {
      console.log("🆕 Documento aún no existe en Firestore.");
    }
  } catch (e) {
    console.error("🔥 ERROR Firebase al obtener doc:", e.message);
  }
});
