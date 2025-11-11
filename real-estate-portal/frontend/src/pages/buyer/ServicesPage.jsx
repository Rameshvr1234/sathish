import React from 'react';

const ServicesPage = () => {
  return (
    <div className="container">
      <h1>Our Services</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ padding: '2rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3>Survey Support</h3>
          <p>Professional property survey services</p>
        </div>
        <div style={{ padding: '2rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3>Legal Support</h3>
          <p>Legal assistance for property transactions</p>
        </div>
        <div style={{ padding: '2rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3>Construction Support</h3>
          <p>Construction and renovation services</p>
        </div>
        <div style={{ padding: '2rem', background: '#f7fafc', borderRadius: '8px' }}>
          <h3>Finance Support</h3>
          <p>Loan and EMI calculator services</p>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
