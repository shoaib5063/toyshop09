import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';

const ToyCard = ({ toy }) => {
  const [user, setUser] = useState(null);
  const [buying, setBuying] = useState(false);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (rating % 1 !== 0) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    return stars;
  };

  const handleBuyToy = async () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to buy toys.',
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
      return;
    }

    setBuying(true);

    try {
      // Check if user already owns this toy
      const q = query(
        collection(db, 'userToys'),
        where('userId', '==', user.uid),
        where('toyId', '==', toy.toyId || toy.id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Swal.fire({
          icon: 'info',
          title: 'Already Owned',
          text: 'You already own this toy! Check your "My Toys" page.',
        });
        return;
      }

      // Add toy to user's collection
      const purchaseData = {
        userId: user.uid,
        toyId: toy.toyId || toy.id,
        toyName: toy.toyName,
        price: toy.price,
        pictureURL: toy.pictureURL,
        subCategory: toy.subCategory || toy.category,
        rating: toy.rating,
        description: toy.description,
        sellerName: toy.sellerName,
        sellerEmail: toy.sellerEmail,
        purchaseDate: new Date(),
        status: 'purchased'
      };

      await addDoc(collection(db, 'userToys'), purchaseData);

      Swal.fire({
        icon: 'success',
        title: 'Purchase Successful!',
        text: `You have successfully purchased ${toy.toyName}! Check your "My Toys" page.`,
        confirmButtonText: 'View My Toys',
        showCancelButton: true,
        cancelButtonText: 'Continue Shopping'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/my-toys';
        }
      });

    } catch (error) {
      console.error('Error purchasing toy:', error);
      Swal.fire({
        icon: 'error',
        title: 'Purchase Failed',
        text: 'Failed to purchase toy. Please try again.',
      });
    } finally {
      setBuying(false);
    }
  };

  const toyId = toy.toyId || toy.id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative">
        <img 
          src={toy.pictureURL || '/api/placeholder/300/200'} 
          alt={toy.toyName} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {toy.subCategory || toy.category || 'Building Blocks'}
        </p>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {toy.toyName}
        </h3>
        
        {/* Rating and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {renderStars(toy.rating || 4.7)}
            <span className="text-sm text-gray-600 ml-1">{toy.rating || 4.7}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-1">📦</span>
            <span>{toy.availableQuantity || 75} left</span>
          </div>
        </div>
        
        {/* Price and Buttons */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-blue-600">
            ${toy.price || '49.99'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/toy/${toyId}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
          >
            Details
          </Link>
          <button
            onClick={handleBuyToy}
            disabled={buying}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buying ? 'Buying...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToyCard;
