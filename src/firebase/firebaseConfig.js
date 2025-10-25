// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnD2Zyimh2Ui5wT-llx9hDUtTesH6laQI",
  authDomain: "toystore-2c652.firebaseapp.com",
  projectId: "toystore-2c652",
  storageBucket: "toystore-2c652.firebasestorage.app",
  messagingSenderId: "278200681153",
  appId: "1:278200681153:web:8d698b5b6d690df2b80a40",
  measurementId: "G-7FT9BTENCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics, firebaseConfig };
export default app;
