import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore  } from "firebase/firestore";
import { getStorage   } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCww4pQl6L6FNpgW02PRxtShE2lOkBE08w",
  authDomain: "javascript-99cc5.firebaseapp.com",
  projectId: "javascript-99cc5",
  storageBucket: "javascript-99cc5.appspot.com",
  messagingSenderId: "477767743631",
  appId: "1:477767743631:web:5d13be69a61a5f73b198fa",
  measurementId: "G-PFF82DZBE6"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);