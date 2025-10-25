import React from 'react';

const ToyCard = ({ toy }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative">
        <img 
          src={toy.pictureURL || '/api/placeholder/300/200'} 
          alt={toy.toyName} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {toy.category || 'Building Blocks'}
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
        
        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            ${toy.price || '49.99'}
          </span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToyCard;
