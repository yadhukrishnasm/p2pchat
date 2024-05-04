// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCYUqDnvdX_NuLhf9rQz8MI0IuNfit_EIo",
  authDomain: "samechat-6c33c.firebaseapp.com",
  projectId: "samechat-6c33c",
  storageBucket: "samechat-6c33c.appspot.com",
  messagingSenderId: "8052846084",
  appId: "1:8052846084:web:ca9281a9d3009cabbe4f51",
  measurementId: "G-476XXG6WY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);  