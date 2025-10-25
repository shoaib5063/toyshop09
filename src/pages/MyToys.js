import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const MyToys = () => {
  const [user, setUser] = useState(null);
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingToy, setEditingToy] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    toyName: '',
    category: '',
    price: '',
    rating: '',
    availableQuantity: '',
    pictureURL: '',
    description: ''
  });
  
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
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
      const q = query(collection(db, 'toys'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const userToys = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setToys(userToys);
    } catch (error) {
      console.error('Error fetching toys:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      toyName: '',
      category: '',
      price: '',
      rating: '',
      availableQuantity: '',
      pictureURL: '',
      description: ''
    });
    setEditingToy(null);
    setShowAddForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const toyData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        availableQuantity: parseInt(formData.availableQuantity),
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingToy) {
        // Update existing toy
        await updateDoc(doc(db, 'toys', editingToy.id), {
          ...toyData,
          updatedAt: new Date()
        });
        alert('Toy updated successfully!');
      } else {
        // Add new toy
        await addDoc(collection(db, 'toys'), toyData);
        alert('Toy added successfully!');
      }

      fetchUserToys(user.uid);
      resetForm();
    } catch (error) {
      console.error('Error saving toy:', error);
      alert('Failed to save toy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (toy) => {
    setFormData({
      toyName: toy.toyName,
      category: toy.category,
      price: toy.price.toString(),
      rating: toy.rating.toString(),
      availableQuantity: toy.availableQuantity.toString(),
      pictureURL: toy.pictureURL || '',
      description: toy.description || ''
    });
    setEditingToy(toy);
    setShowAddForm(true);
  };

  const handleDelete = async (toyId) => {
    if (window.confirm('Are you sure you want to delete this toy?')) {
      try {
        await deleteDoc(doc(db, 'toys', toyId));
        alert('Toy deleted successfully!');
        fetchUserToys(user.uid);
      } catch (error) {
        console.error('Error deleting toy:', error);
        alert('Failed to delete toy. Please try again.');
      }
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
            <p className="text-gray-600">Manage your toy collection</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Add New Toy
          </button>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editingToy ? 'Edit Toy' : 'Add New Toy'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Toy Name *
                  </label>
                  <input
                    type="text"
                    name="toyName"
                    value={formData.toyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Building Blocks">Building Blocks</option>
                    <option value="Remote Control">Remote Control</option>
                    <option value="Stuffed Animals">Stuffed Animals</option>
                    <option value="Action Figures">Action Figures</option>
                    <option value="Educational">Educational</option>
                    <option value="Playsets">Playsets</option>
                    <option value="Puzzles">Puzzles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5) *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      step="0.1"
                      min="1"
                      max="5"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={formData.availableQuantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Picture URL
                  </label>
                  <input
                    type="url"
                    name="pictureURL"
                    value={formData.pictureURL}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingToy ? 'Update Toy' : 'Add Toy')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toys Grid */}
        {toys.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No toys yet</h3>
            <p className="text-gray-600 mb-4">Start building your toy collection by adding your first toy!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Add Your First Toy
            </button>
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
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{toy.toyName}</h3>
                    <span className="text-lg font-bold text-blue-600">${toy.price}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{toy.category}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">{toy.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{toy.availableQuantity} left</span>
                  </div>
                  
                  {toy.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{toy.description}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(toy)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(toy.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                    >
                      Delete
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