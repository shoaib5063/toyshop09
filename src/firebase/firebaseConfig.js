import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AlzaSyAnD2ZYimh2Ui5wT-Ilx9hDUtTesH6laQI", // Your API Key
  authDomain: "toystore-2c652.firebaseapp.com", // Your Firebase Auth Domain
  projectId: "toystore-2c652", // Your Project ID
  storageBucket: "toystore-2c652.appspot.com", // Your Firebase Storage Bucket
  messagingSenderId: "278200681153", // Your Sender ID
  appId: "1:278200681153:web:yourAppId", // Your App ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
