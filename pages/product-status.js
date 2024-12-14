import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const ProductStatus = () => {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState(null);
  const [authentic, setAuthentic] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const query = router.query;

    if (Object.keys(query).length > 0) {
      if (query.invalid === 'true') {
        setAuthentic(false);
        setMessage('The scanned QR code is not recognized or not found in the blockchain. Possible counterfeit.');
      } else if (query.isAuthentic === 'true') {
        setAuthentic(true);
        setProductDetails({
          name: query.name,
          brand: query.brand,
          registeredDateTime: new Date(parseInt(query.registeredDateTime) * 1000).toLocaleString(),
          owner: query.owner,
          // Additional blockchain verification details
        });
      }
    }
  }, [router.query]);

  return (
    <div className="container-fluid" style={{ ...containerStyle, paddingTop: '50px' }}>
      <Header />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={cardStyle}>
            <div className="card-body">
              <h2 className="text-center mb-4" style={authentithiefTitleStyle}>Product Authenticity</h2>
              {authentic === null ? (
                <div>
                  <h3 className="text-center" style={{ color: '#ff0000' }}>No Data Available</h3>
                  <p className="text-center" style={{ color: '#ff0000' }}>Unable to retrieve product details.</p>
                </div>
              ) : authentic === false ? (
                <div>
                  <h3 className="text-center" style={{ color: '#ff0000' }}>Product is Not Authentic</h3>
                  <p className="text-center" style={{ color: '#ff0000' }}>{message}</p>
                </div>
              ) : productDetails ? (
                <div>
                  <h3 className="text-center" style={{ color: '#00ff00' }}>Product is Authentic</h3>
                  <p className="text-center" style={{ color: '#00ff00' }}>Product Name: {productDetails.name}</p>
                  <p className="text-center" style={{ color: '#00ff00' }}>Brand: {productDetails.brand}</p>
                  <p className="text-center" style={{ color: '#00ff00' }}>Registered Date: {productDetails.registeredDateTime}</p>
                  <p className="text-center" style={{ color: '#00ff00' }}>Blockchain Owner: {productDetails.owner}</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-center" style={{ color: '#ff0000' }}>Product is not authentic</h3>
                  <p className="text-center" style={{ color: '#ff0000' }}>No product data found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  background: 'radial-gradient(circle, #330066, #000000)',
  minHeight: '100vh',
  color: '#fff',
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '3rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
};

const authentithiefTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0',
};

export default ProductStatus;
