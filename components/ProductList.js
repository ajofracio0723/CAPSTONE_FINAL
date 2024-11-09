import React, { useState } from 'react';
import { FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const ProductList = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={containerStyle}>
      <div className="mb-4">
        <h2 className="text-white mb-4" style={headingStyle}>Added Products</h2>
        
        {/* Search Bar */}
        <div className="search-container" style={searchContainerStyle}>
          {/* Search input and functionality remains the same */}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-white" style={emptyStateStyle}>
          No products have been added yet.
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-white" style={emptyStateStyle}>
          No products match your search.
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card" style={cardStyle}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0" style={cardTitleStyle}>
                      {product.name}
                    </h5>
                    {product.is_authentic ? (
                      <span className="badge bg-success" style={badgeStyle}>
                        <FaCheck style={{ marginRight: '4px' }} /> Authentic
                      </span>
                    ) : (
                      <span className="badge bg-danger" style={badgeStyle}>
                        <FaTimes style={{ marginRight: '4px' }} /> Not Verified
                      </span>
                    )}
                  </div>
                  <div style={cardContentStyle}>
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Registered:</strong> {formatDate(product.registration_date)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  padding: '2rem',
};

const headingStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
};

const searchContainerStyle = {
  maxWidth: '600px',
  margin: '0 auto 2rem',
};

const searchIconStyle = {
  backgroundColor: 'rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  borderRight: 'none',
  color: '#fff',
  padding: '0.75rem',
};

const searchInputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  color: '#fff',
  padding: '0.75rem',
  fontSize: '1rem',
  '::placeholder': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  color: '#fff',
  height: '100%',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 5px 40px rgba(138, 43, 226, 0.4)',
  },
};

const cardTitleStyle = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1.25rem',
  textShadow: '0 0 5px rgba(138, 43, 226, 0.3)',
};

const cardContentStyle = {
  color: 'rgba(255, 255, 255, 0.8)',
};

const badgeStyle = {
  padding: '0.5rem 0.75rem',
  borderRadius: '20px',
  fontWeight: 'normal',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.9rem',
};

const emptyStateStyle = {
  padding: '3rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  fontSize: '1.2rem',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
};

export default ProductList;