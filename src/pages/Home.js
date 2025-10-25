import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ToyCard from '../components/ToyCard';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data with proper structure using local images
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
      pictureURL: require('../assets/images/Lego Classic Bricks.png')
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
      pictureURL: require('../assets/images/RC Speedster Car.png')
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
      pictureURL: require('../assets/images/Cuddly Teddy Bear.png')
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
      pictureURL: require('../assets/images/Space Station Playset.png')
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
      pictureURL: require('../assets/images/Educational Puzzle.png')
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
      pictureURL: require('../assets/images/Action Figure Set.png')
    }
  ];

  const sliderImages = [
    {
      id: 1,
      title: 'Discover Amazing Toys',
      subtitle: 'Find the perfect toy for every child',
      image: 'https://i.ibb.co/7QZ8Qz/slider1.jpg',
      buttonText: 'Shop Now'
    },
    {
      id: 2,
      title: 'Educational & Fun',
      subtitle: 'Learning through play with our educational toys',
      image: 'https://i.ibb.co/8QZ8Qz/slider2.jpg',
      buttonText: 'Explore'
    },
    {
      id: 3,
      title: 'Premium Quality',
      subtitle: 'Safe, durable toys for endless entertainment',
      image: 'https://i.ibb.co/9QZ8Qz/slider3.jpg',
      buttonText: 'Learn More'
    }
  ];

  useEffect(() => {
    document.title = 'ToyVerse - Home';
    
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
      } finally {
        setLoading(false);
      }
    };

    fetchToys();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="h-96 md:h-[500px]"
        >
          {sliderImages.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Popular Toys Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Toys</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Check out our most loved toys that are flying off the shelves!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toys.slice(0, 6).map((toy) => (
              <ToyCard key={toy.toyId || toy.id} toy={toy} />
            ))}
          </div>
        )}
      </div>

      {/* Featured Categories Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find toys by your favorite categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Building Blocks', icon: '🧱', count: '25+ toys' },
              { name: 'Remote Control', icon: '🚗', count: '15+ toys' },
              { name: 'Stuffed Animals', icon: '🧸', count: '30+ toys' },
              { name: 'Action Figures', icon: '🦸', count: '20+ toys' }
            ].map((category) => (
              <div key={category.name} className="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 text-lg mb-8">
            Subscribe to our newsletter and be the first to know about new toys and special offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
