import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';

const ToyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toy, setToy] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Sample toys data for fallback using local images
  const sampleToys = [
    {
      toyId: 1,
      toyName: 'Lego Classic Bricks',
      sellerName: 'Toys R Us Local',
      sellerEmail: 'contact@toysruslocal.com',
      subCategory: 'Building Blocks',
      rating: 4.7,
      price: 49.99,
      availableQuantity: 75,
      description: 'A timeless set of colorful Lego bricks that encourages creativity and problem-solving. Kids can build anything they imagine, from houses to vehicles.',
      pictureURL: 'https://i.ibb.co.com/bR5bwxkL/Lego-Classic-Bricks.png'
    },
    {
      toyId: 2,
      toyName: 'RC Speedster Car',
      sellerName: 'RC World',
      sellerEmail: 'info@rcworld.com',
      subCategory: 'Remote Control',
      rating: 4.5,
      price: 89.50,
      availableQuantity: 30,
      description: 'High-speed remote control car with advanced steering and durable design for outdoor adventures.',
      pictureURL: 'https://i.ibb.co.com/Q37C5SN5/RC-Speedster-Car.png'
    },
    {
      toyId: 3,
      toyName: 'Cuddly Teddy Bear',
      sellerName: 'Soft Toys Co',
      sellerEmail: 'hello@softtoys.com',
      subCategory: 'Stuffed Animals',
      rating: 4.8,
      price: 25.00,
      availableQuantity: 120,
      description: 'Super soft and cuddly teddy bear perfect for bedtime stories and comfort.',
      pictureURL: 'https://i.ibb.co.com/hRYHSrzJ/Cuddly-Teddy-Bear.png'
    },
    {
      toyId: 4,
      toyName: 'Space Station Playset',
      sellerName: 'Galaxy Toys',
      sellerEmail: 'contact@galaxytoys.com',
      subCategory: 'Playsets',
      rating: 4.6,
      price: 129.99,
      availableQuantity: 15,
      description: 'Complete space station with astronaut figures and realistic space exploration features.',
      pictureURL: 'https://i.ibb.co.com/DPTm0RVW/Space-Station-Playset.png'
    },
    {
      toyId: 5,
      toyName: 'Educational Puzzle',
      sellerName: 'Learn & Play',
      sellerEmail: 'support@learnplay.com',
      subCategory: 'Educational',
      rating: 4.4,
      price: 19.99,
      availableQuantity: 85,
      description: 'Colorful educational puzzle that helps develop problem-solving skills and hand-eye coordination.',
      pictureURL: 'https://i.ibb.co.com/9Hqkx2TF/Educational-Puzzle.png'
    },
    {
      toyId: 6,
      toyName: 'Action Figure Set',
      sellerName: 'Hero Toys',
      sellerEmail: 'info@herotoys.com',
      subCategory: 'Action Figures',
      rating: 4.7,
      price: 34.99,
      availableQuantity: 45,
      description: 'Set of superhero action figures with moveable joints and accessories.',
      pictureURL: 'https://i.ibb.co.com/yTf6pWk/Action-Figure-Set.png'
    }
  ];

  useEffect(() => {
    document.title = 'ToyVerse - Toy Details';
    
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setFormData({
          name: user.displayName || '',
          email: user.email || ''
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchToyDetails = async () => {
      try {
        // Try to fetch from Firestore first
        const docRef = doc(db, 'toys', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setToy({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to sample data
          const sampleToy = sampleToys.find(toy => toy.toyId.toString() === id);
          if (sampleToy) {
            setToy(sampleToy);
          } else {
            navigate('/404');
          }
        }
      } catch (error) {
        console.error('Error fetching toy:', error);
        // Fallback to sample data
        const sampleToy = sampleToys.find(toy => toy.toyId.toString() === id);
        if (sampleToy) {
          setToy(sampleToy);
        } else {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchToyDetails();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTryNow = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Request Submitted!',
      text: `Thank you ${formData.name}! We'll contact you at ${formData.email} to arrange your toy trial.`,
      confirmButtonColor: '#3B82F6'
    });

    // Reset form
    setFormData({
      name: user?.displayName || '',
      email: user?.email || ''
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    // Fill remaining with empty stars
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading toy details...</p>
        </div>
      </div>
    );
  }

  if (!toy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Toy Not Found</h2>
          <p className="text-gray-600 mb-4">The toy you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-blue-600">
                Home
              </button>
            </li>
            <li>/</li>
            <li className="text-gray-900">{toy.toyName}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={toy.pictureURL || '/api/placeholder/500/500'}
                alt={toy.toyName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/api/placeholder/500/500';
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                {toy.subCategory || toy.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{toy.toyName}</h1>
              
              {/* Rating */}
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  {renderStars(toy.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {toy.rating} out of 5 stars
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600">
              ${toy.price}
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium">Availability:</span>
                <span className={`ml-1 ${toy.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {toy.availableQuantity > 0 ? `${toy.availableQuantity} in stock` : 'Out of stock'}
                </span>
              </span>
            </div>

            {/* Seller Info */}
            {toy.sellerName && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Seller:</span> {toy.sellerName}
                </p>
                {toy.sellerEmail && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {toy.sellerEmail}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {toy.description || 'No description available for this toy.'}
              </p>
            </div>

            {/* Try Now Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Try This Toy</h3>
              <p className="text-sm text-gray-600 mb-4">
                Interested in trying this toy? Fill out the form below and we'll get in touch!
              </p>
              
              <form onSubmit={handleTryNow} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
                >
                  Try Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToyDetails;
