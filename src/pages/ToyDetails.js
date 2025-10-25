// ToyDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ToyDetails = () => {
  const { id } = useParams();
  const [toy, setToy] = useState(null);

  useEffect(() => {
    const fetchToyDetails = async () => {
      const docRef = doc(db, 'toys', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setToy(docSnap.data());
      } else {
        // Handle the case when the toy does not exist
        console.log('No such document!');
      }
    };

    fetchToyDetails();
  }, [id]);

  if (!toy) return <div>Loading...</div>;

  return (
    <div>
      <h2>{toy.toyName}</h2>
      <p>{toy.description}</p>
      <p>Price: ${toy.price}</p>
      <p>Rating: {toy.rating}</p>
      <p>Available Quantity: {toy.availableQuantity}</p>
    </div>
  );
};

export default ToyDetails;
