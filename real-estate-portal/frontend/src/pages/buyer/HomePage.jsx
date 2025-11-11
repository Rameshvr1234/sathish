import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Find Your Dream Property</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Welcome to the Real Estate Portal - Your gateway to the perfect home
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/properties" style={{ padding: '1rem 2rem', background: '#667eea', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
          Browse Properties
        </Link>
        <Link to="/services" style={{ padding: '1rem 2rem', background: '#48bb78', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
          Our Services
        </Link>
      </div>
      <div style={{ marginTop: '3rem', padding: '2rem', background: '#f7fafc', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1rem' }}>Getting Started</h2>
        <p>This is a starter template for the Real Estate Portal. The application structure is ready!</p>
        <p style={{ marginTop: '1rem' }}>Backend API is running on: <a href="http://localhost:5000" target="_blank" rel="noopener noreferrer">http://localhost:5000</a></p>
      </div>
    </div>
  );
};

export default HomePage;
