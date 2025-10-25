import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyToys = () => {
  const [user, setUser] = useState(null);
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    document.title = 'ToyVerse - My Toys';
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserToys(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchUserToys = async (userId) => {
    try {
      console.log('Fetching toys for user:', userId);
      console.log('Database object:', db);
      
      const q = query(collection(db, 'userToys'), where('userId', '==', userId));
      console.log('Query created:', q);
      
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot:', querySnapshot);
      console.log('Number of docs:', querySnapshot.size);
      
      const userToys = querySnapshot.docs.map(doc => {
        console.log('Doc data:', doc.id, doc.data());
        return {
          id: doc.id,
          ...doc.data()
        };
      });
      
      console.log('Found toys:', userToys);
      setToys(userToys);
      
      // Show a temporary alert to confirm data loading
      if (userToys.length === 0) {
        console.log('No toys found for user');
      } else {
        console.log(`Found ${userToys.length} toys`);
      }
      
    } catch (error) {
      console.error('Error fetching toys:', error);
      console.error('Error details:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Toys',
        text: `Failed to load your toy collection: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toyId) => {
    try {
      await deleteDoc(doc(db, 'userToys', toyId));
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'Toy has been removed from your collection.',
        timer: 2000,
        showConfirmButton: false
      });
      fetchUserToys(user.uid);
    } catch (error) {
      console.error('Error deleting toy:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to remove toy. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your toys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Toys</h1>
            <p className="text-gray-600">Your purchased toy collection</p>
            <p className="text-sm text-gray-400">User ID: {user?.uid}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Toys: {toys.length}</p>
            <p className="text-lg font-semibold text-blue-600">
              Total Value: ${toys.reduce((sum, toy) => sum + (toy.price || 0), 0).toFixed(2)}
            </p>
            {/* Test button - remove in production */}
            <button
              onClick={async () => {
                try {
                  const testToy = {
                    userId: user.uid,
                    toyId: 'test-' + Date.now(),
                    toyName: 'Test Toy',
                    price: 9.99,
                    pictureURL: 'https://via.placeholder.com/300x200',
                    subCategory: 'Test Category',
                    rating: 5.0,
                    description: 'This is a test toy',
                    purchaseDate: new Date(),
                    status: 'purchased'
                  };
                  
                  await addDoc(collection(db, 'userToys'), testToy);
                  Swal.fire('Success!', 'Test toy added', 'success');
                  fetchUserToys(user.uid);
                } catch (error) {
                  console.error('Error adding test toy:', error);
                  Swal.fire('Error!', error.message, 'error');
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs mt-2"
            >
              Add Test Toy
            </button>
          </div>
        </div>

        {/* Toys Grid */}
        {toys.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No toys purchased yet</h3>
            <p className="text-gray-600 mb-4">Start building your toy collection by purchasing toys from our store!</p>
            <a
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors inline-block"
            >
              Browse Toys
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toys.map((toy) => (
              <div key={toy.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={toy.pictureURL || '/api/placeholder/300/200'}
                    alt={toy.toyName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/300/200';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Owned
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{toy.toyName}</h3>
                    <span className="text-lg font-bold text-blue-600">${toy.price}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{toy.subCategory}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{toy.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Purchased: {toy.purchaseDate ? new Date(toy.purchaseDate.toDate ? toy.purchaseDate.toDate() : toy.purchaseDate).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  
                  {toy.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{toy.description}</p>
                  )}

                  {toy.sellerName && (
                    <p className="text-xs text-gray-500 mb-3">
                      Sold by: {toy.sellerName}
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        Swal.fire({
                          icon: 'info',
                          title: 'Toy Details',
                          html: `
                            <div class="text-left">
                              <p><strong>Name:</strong> ${toy.toyName}</p>
                              <p><strong>Category:</strong> ${toy.subCategory}</p>
                              <p><strong>Price:</strong> $${toy.price}</p>
                              <p><strong>Rating:</strong> ${toy.rating}/5</p>
                              <p><strong>Purchase Date:</strong> ${toy.purchaseDate ? new Date(toy.purchaseDate.toDate ? toy.purchaseDate.toDate() : toy.purchaseDate).toLocaleDateString() : 'Unknown'}</p>
                              ${toy.sellerName ? `<p><strong>Seller:</strong> ${toy.sellerName}</p>` : ''}
                              ${toy.description ? `<p><strong>Description:</strong> ${toy.description}</p>` : ''}
                            </div>
                          `,
                          confirmButtonText: 'Close'
                        });
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: 'Remove from Collection?',
                          text: 'Are you sure you want to remove this toy from your collection?',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Yes, remove it!'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleDelete(toy.id);
                          }
                        });
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyToys;