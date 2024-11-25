import React, { useState, useMemo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react'; // Import from qrcode.react

const ProductList = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Use useMemo to memoize the filtered and sorted product list
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortOption === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'date') {
        return new Date(b.registration_date) - new Date(a.registration_date);
      }
      return 0;
    });
  }, [products, searchTerm, sortOption]);

  return (
    <div className="container" style={containerStyle}>
      <div className="mb-4">
        <h2 className="text-white mb-4" style={headingStyle}>Added Products</h2>
        <div className="search-sort-container" style={searchSortContainerStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="search" style={labelStyle}>Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="sort" style={labelStyle}>Sort by:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={dropdownStyle}
            >
              <option value="">Select</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
              <option value="date">Date (Newest First)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
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
                    <p><strong>Description:</strong> {product.description}</p>
                    <p><strong>Unique Identifier:</strong> {product.uniqueIdentifier}</p>
                  </div>

                  {/* QR Code */}
                  <div className="text-center mt-3">
                    <QRCodeCanvas
                      value={JSON.stringify({
                        name: product.name,
                        brand: product.brand,
                        description: product.description,
                        uniqueIdentifier: product.uniqueIdentifier,
                        registeredDate: formatDate(product.registration_date),
                        isAuthentic: product.is_authentic,
                      })}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
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

const searchSortContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '600px',
  margin: '0 auto 2rem',
};

const inputGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const labelStyle = {
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 'bold',
};

const searchInputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  color: '#fff',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  width: '320px',
};

const dropdownStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
  color: '#fff',
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '5px',
  width: '150px',
  cursor: 'pointer',
  outline: 'none',
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  color: '#fff',
  height: '100%',
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
