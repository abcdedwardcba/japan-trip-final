// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeNe0gZ8w8lbF565sHOonkaZKZY6QVx9A",
  authDomain: "lee-family-hokkaido-2025.firebaseapp.com",
  projectId: "lee-family-hokkaido-2025",
  storageBucket: "lee-family-hokkaido-2025.firebasestorage.app",
  messagingSenderId: "1049495159054",
  appId: "1:1049495159054:web:a37f2cf06fe14f43d5575f",
  measurementId: "G-037S76KS1F",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
