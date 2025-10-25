import React, { useEffect, useState } from 'react';
import ToyCard from '../components/ToyCard';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [toys, setToys] = useState([]);

  // Sample data to show while Firebase loads
  const sampleToys = [
    {
      toyId: 1,
      toyName: 'Lego Classic Bricks',
      category: 'Building Blocks',
      rating: 4.7,
      price: 49.99,
      availableQuantity: 75,
      pictureURL: '/api/placeholder/300/200'
    },
    {
      toyId: 2,
      toyName: 'RC Speedster Car',
      category: 'Remote Control',
      rating: 4.5,
      price: 89.50,
      availableQuantity: 30,
      pictureURL: '/api/placeholder/300/200'
    },
    {
      toyId: 3,
      toyName: 'Cuddly Teddy Bear',
      category: 'Stuffed Animals',
      rating: 4.8,
      price: 25.00,
      availableQuantity: 120,
      pictureURL: '/api/placeholder/300/200'
    },
    {
      toyId: 4,
      toyName: 'Space Station Playset',
      category: 'Playsets',
      rating: 4.6,
      price: 129.99,
      availableQuantity: 15,
      pictureURL: '/api/placeholder/300/200'
    },
    {
      toyId: 5,
      toyName: 'Educational Puzzle',
      category: 'Educational',
      rating: 4.4,
      price: 19.99,
      availableQuantity: 85,
      pictureURL: '/api/placeholder/300/200'
    },
    {
      toyId: 6,
      toyName: 'Action Figure Set',
      category: 'Action Figures',
      rating: 4.7,
      price: 34.99,
      availableQuantity: 45,
      pictureURL: '/api/placeholder/300/200'
    }
  ];

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'toys'));
        const toyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (toyData.length > 0) {
          setToys(toyData);
        } else {
          setToys(sampleToys);
        }
      } catch (error) {
        console.log('Using sample data:', error);
        setToys(sampleToys);
      }
    };

    fetchToys();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Popular Toys</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check out our most loved toys that are flying off the shelves!
          </p>
        </div>
      </div>

      {/* Toys Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toys.map((toy) => (
            <ToyCard key={toy.toyId || toy.id} toy={toy} />
          ))}
        </div>
      </div>

      {/* Load More Section */}
      <div className="text-center py-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          Load More Toys
        </button>
      </div>
    </div>
  );
};

export default Home;
