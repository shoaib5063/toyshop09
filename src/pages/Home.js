import React, { useEffect, useState } from 'react';
import ToyCard from '../components/ToyCard';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [toys, setToys] = useState([]);

  useEffect(() => {
    const fetchToys = async () => {
      const querySnapshot = await getDocs(collection(db, 'toys'));
      const toyData = querySnapshot.docs.map(doc => doc.data());
      setToys(toyData);
    };

    fetchToys();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl mb-6">Popular Toys</h2>
      <div className="grid grid-cols-3 gap-4">
        {toys.map((toy) => (
          <ToyCard key={toy.toyId} toy={toy} />
        ))}
      </div>
    </div>
  );
};

export default Home;
