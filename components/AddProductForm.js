import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Header from './Header';
import { FaPlusCircle, FaDownload, FaList } from 'react-icons/fa';
import ProductList from './ProductList';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [products, setProducts] = useState([]);
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');

  // Function to get the current date
  const getCurrentDate = () => {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    return `${month}/${day}/${year}`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName || !description || !brand) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = getCurrentDate();
      setRegisteredDateTime(formattedDate);

      // Generate a unique identifier (e.g., transaction hash)
      const txHash = `tx_${Date.now()}`;
      setUniqueIdentifier(txHash);

      // Create a new product object
      const newProduct = {
        name: productName,
        brand,
        registeredDateTime: formattedDate,
        is_authentic: true,
        description,
        uniqueIdentifier: txHash,
        registration_date: new Date().toISOString(),
      };

      // Update products list
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);

      // Generate QR code data
      setQRCodeData(JSON.stringify(newProduct));

      // Reset form fields
      setProductName('');
      setDescription('');
      setBrand('');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to download the QR code as an image
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas'); // Get the canvas element
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${productName || 'QRCode'}.png`;
    link.click();
  };

  return (
    <div className="container-fluid" style={backgroundStyle}>
      <Header />
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group" aria-label="Basic example" style={tabGroupStyle}>
          <button
            className={`btn ${activeTab === 'addProduct' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('addProduct')}
            style={activeTab === 'addProduct' ? activeTabStyle : tabStyle}
          >
            <FaPlusCircle className="me-2" /> Add Product
          </button>
          <button
            className={`btn ${activeTab === 'viewProducts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('viewProducts')}
            style={activeTab === 'viewProducts' ? activeTabStyle : tabStyle}
          >
            <FaList className="me-2" /> View Products
          </button>
        </div>
      </div>

      {activeTab === 'addProduct' && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <h1 className="text-center mb-4" style={headingStyle}>
                  <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Product
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label" style={labelStyle}>Product Name</label>
                    <input type="text" className="form-control" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="brand" className="form-label" style={labelStyle}>Brand</label>
                    <input type="text" className="form-control" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label" style={labelStyle}>Description</label>
                    <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
                  </div>
                  {uniqueIdentifier && (
                    <div className="mb-3">
                      <label className="form-label" style={labelStyle}>Unique Identifier (Transaction Hash)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={uniqueIdentifier}
                        readOnly
                        style={{ ...inputStyle, color: '#ffffff', fontWeight: 'bold' }}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label" style={labelStyle}>Date Registered</label>
                    <input type="text" className="form-control" value={registeredDateTime} readOnly style={inputStyle} />
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" style={buttonStyle} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>

                {qrCodeData && (
                  <div className="mt-4 text-center">
                    <QRCodeCanvas
                      value={qrCodeData}
                      size={300}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                      style={{ marginBottom: '1rem' }}
                    />
                    <p className="text-center mt-3">
                      <button className="btn btn-success btn-sm" onClick={downloadQRCode} style={downloadButtonStyle}>
                        <FaDownload /> Download QR Code
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'viewProducts' && <ProductList products={products} />}
    </div>
  );
};

const backgroundStyle = {
  background: 'radial-gradient(circle, #1a0938, #000000)',
  minHeight: '100vh',
  color: '#fff',
  paddingTop: '20px',
};

const tabGroupStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  padding: '0.5rem',
  borderRadius: '50px',
  boxShadow: '0 0 20px rgba(138, 43, 226, 0.2)',
};

const tabStyle = {
  padding: '0.8rem 2rem',
  margin: '0 0.5rem',
  borderRadius: '25px',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(138, 43, 226, 0.3)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: 'rgba(138, 43, 226, 0.5)',
  boxShadow: '0 0 15px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.5)',
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  padding: '2rem',
};

const headingStyle = {
  color: '#fff',
  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
  fontWeight: 'bold',
};

const labelStyle = {
  color: '#fff',
  textShadow: '0 0 5px rgba(138, 43, 226, 0.3)',
  fontWeight: 'bold',
};

const inputStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  border: '1px solid rgba(138, 43, 226, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  width: '100%',
  transition: 'all 0.3s ease',
};

const buttonStyle = {
  padding: '0.8rem 2.5rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundImage: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  color: '#fff',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)',
};

const downloadButtonStyle = {
  ...buttonStyle,
  backgroundImage: 'linear-gradient(to right, #4a00e0, #8e2de2)',
};

export default AddProductForm;