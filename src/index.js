import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// Import Firebase app to initialize it
import './firebase/firebaseConfig';

// Loader component
const Loader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading ToyVerse...</p>
    </div>
  </div>
);

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

  return (
    <Router>
      <App user={user} />
    </Router>
  );
};

// Render the Main component
const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Main />);
