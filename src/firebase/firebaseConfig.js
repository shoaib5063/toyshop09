// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Import Firestore

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBD80dowyIDLXzwvfxfLRR9BckYhXSO8U4',
  authDomain: 'toy-shop-39ef3.firebaseapp.com',
  projectId: 'toy-shop-39ef3',
  storageBucket: 'toy-shop-39ef3.firebasestorage.app',
  messagingSenderId: '790642169119',
  appId: '1:790642169119:web:abc123def456ghi789jkl',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

export { auth, db, firebaseConfig };  // Export auth and db
export default app;
