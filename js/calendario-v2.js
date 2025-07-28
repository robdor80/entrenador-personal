console.log("📦 calendario-v2.js cargado");

import { auth, db } from "../firebase/firebaseInit.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Logs para confirmar entorno
console.log("✅ Firebase DB disponible:", typeof db);
console.log("✅ Firebase Auth disponible:", typeof auth);

// Listar todos los scripts
console.log("📋 Scripts cargados:");
document.querySelectorAll("script").forEach((s, i) =>
  console.log(`${i + 1}.`, s.src || "[inline]")
);

// Detectar errores
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

  const ref = doc(db, "entrenos", user.uid);
  try {
    const snap = await getDoc(ref);
    console.log("📄 Documento en Firestore:", snap.exists() ? snap.data() : "No existe aún");
  } catch (e) {
    console.error("🔥 ERROR Firebase al obtener doc:", e.message);
  }
});
