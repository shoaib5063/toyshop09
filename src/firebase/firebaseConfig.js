// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Import Firestore

// Firebase Configuration
const firebaseConfig = {
  apiKey: 'AlzaSyAnD2Zyimh2Ui5w-TlX9hDUTTesH6IaQI',
  authDomain: 'toystore-2c652.firebaseapp.com',
  projectId: 'toystore-2c652',
  storageBucket: 'toystore-2c652.appspot.com',
  messagingSenderId: '278200681153',
  appId: '1:278200681153:web:f2fbeb2c1015e7b70fe1a6',
  measurementId: 'G-J1JRGXMT9M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Authentication
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

export { auth, db, firebaseConfig };  // Export auth and db
export default app;
