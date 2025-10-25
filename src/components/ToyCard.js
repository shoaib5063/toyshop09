import React from 'react';

const ToyCard = ({ toy }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <img src={toy.pictureURL} alt={toy.toyName} className="w-full h-48 object-cover rounded" />
      <h3 className="text-xl mt-4">{toy.toyName}</h3>
      <p>Rating: {toy.rating}</p>
      <p>Price: ${toy.price}</p>
      <p>Quantity Available: {toy.availableQuantity}</p>
      <button className="bg-blue-500 text-white p-2 mt-4 rounded">View More</button>
    </div>
  );
};

export default ToyCard;
