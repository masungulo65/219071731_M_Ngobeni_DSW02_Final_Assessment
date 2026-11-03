
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_ACTUAL_API_KEY_HERE",
  authDomain: "gautengclinicapp-e935c.firebaseapp.com",
  projectId: "gautengclinicapp-e935c",
  storageBucket: "gautengclinicapp-e935c.firebasestorage.app",
  messagingSenderId: "326232161812",
  appId: "1:326232161812:web:5072ca99c638039c077101"
};

// Prevent Firebase from initializing more than once
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
