import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetail = () => {
  const { id } = useParams();

  return (
    <div className="container">
      <h1>Property Detail</h1>
      <p>Property ID: {id}</p>
      <p>Property details functionality - To be implemented</p>
    </div>
  );
};

export default PropertyDetail;
