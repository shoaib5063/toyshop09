import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from './firebase/firebaseConfig';

// Loader component
const Loader = () => <div>Loading...</div>;

// Main Component
const Main = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <App user={user} />;
};

// Render the Main component
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Main />
  </FirebaseAppProvider>
);
