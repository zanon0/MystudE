// ============================================================
//  My StudE — Configuração do Firebase
// ============================================================
//
//  Passo a passo:
//   1. https://console.firebase.google.com
//   2. Criar projeto → Registrar app Web (ícone </>)
//   3. Copiar o objeto firebaseConfig e colar abaixo
//   4. Authentication → Sign-in method → Email/Password → Ativar
//   5. Firestore Database → Create database (production mode)
//   6. Firestore → Rules → colar as regras do topo do cloud.js
//   7. Salvar este arquivo
//
//  Enquanto estiver "COLE_AQUI", o app roda 100% offline.
// ============================================================

window.FIREBASE_CONFIG = {
 apiKey: "AIzaSyAGx2MYVnNjzMnEDtcmwcff9WYwxZjJW9Q",
  authDomain: "mystude-2b0b0.firebaseapp.com",
  projectId: "mystude-2b0b0",
  storageBucket: "mystude-2b0b0.firebasestorage.app",
  messagingSenderId: "1008374286880",
  appId: "1:1008374286880:web:0f84f3f54682bca81aca45",
  measurementId: "G-05YV8JF4ZL"
};