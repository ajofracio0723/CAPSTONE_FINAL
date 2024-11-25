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
        setMessage('The scanned QR code is not recognized. Please report a counterfeit.');
      } else {
        setAuthentic(true);
        setProductDetails({
          name: query.name,
          brand: query.brand,
          uniqueIdentifier: query.uniqueIdentifier,
          registeredDateTime: query.registeredDateTime,
          isReAuthenticated: query.isReAuthenticated === 'true',
        });
      }
    } else {
      const storedDetails = localStorage.getItem('productDetails');
      if (storedDetails) {
        try {
          const details = JSON.parse(storedDetails);
          setProductDetails(details);
          setAuthentic(true);
          localStorage.removeItem('productDetails');
        } catch (error) {
        }
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
              <h2 className="text-center mb-4" style={authentithiefTitleStyle}>Product Status</h2>
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
                productDetails.isReAuthenticated ? (
                  <div>
                    <h3 className="text-center" style={{ color: '#ff0000' }}>Re-authenticated Product</h3>
                    <p className="text-center" style={{ color: '#ff0000' }}>This product has already been authenticated before. Please contact us for verification or report a counterfeit.</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-center" style={{ color: '#00ff00' }}>Product is Authentic</h3>
                    <p className="text-center" style={{ color: '#00ff00' }}>Product Name: {productDetails.name}</p>
                    <p className="text-center" style={{ color: '#00ff00' }}>Brand: {productDetails.brand}</p>
                    <p className="text-center" style={{ color: '#00ff00' }}>Unique Identifier: {productDetails.uniqueIdentifier}</p>
                    <p className="text-center" style={{ color: '#00ff00' }}>Registered Date: {productDetails.registeredDateTime}</p>
                  </div>
                )
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
