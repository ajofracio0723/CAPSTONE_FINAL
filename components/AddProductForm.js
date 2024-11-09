import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Header from './Header';
import { FaBitcoin, FaEthereum, FaCube, FaPlusCircle, FaDownload, FaList } from 'react-icons/fa';
import Web3 from 'web3';
import ProductList from './ProductList';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [products, setProducts] = useState([]);
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to format the current date
  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear().toString().slice(-2)}`;
  };

  useEffect(() => {
    // Initialize the date field on component mount
    setRegisteredDateTime(getCurrentDate());

    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const contractABI = [
            {
              "inputs": [
                { "internalType": "string", "name": "_productName", "type": "string" },
                { "internalType": "string", "name": "_description", "type": "string" },
                { "internalType": "string", "name": "_uniqueIdentifier", "type": "string" }
              ],
              "name": "addProduct",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
          const contractAddress = '0xeec8431D7F34f1e571C96C3A0f18c81b5498F129';
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access");
        }
      }
    };
    initWeb3();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !description || !brand) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const formattedDate = getCurrentDate();
      setRegisteredDateTime(formattedDate);

      const result = await contract.methods.addProduct(productName, description, "pending")
        .send({ from: account });
      
      const txHash = result.transactionHash;
      setUniqueIdentifier(txHash);

      const newProduct = {
        name: productName,
        brand,
        registeredDateTime: formattedDate,
        is_authentic: true,
        description,
        uniqueIdentifier: txHash
      };

      const data = JSON.stringify(newProduct);
      setQRCodeData(data);
      setProducts([...products, newProduct]);
      
      setProductName('');
      setDescription('');
      setBrand('');
      
    } catch (error) {
      console.error("Error adding product to blockchain:", error);
      alert('Error adding product to blockchain. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadQRCode = (data, fileName) => {
    const svg = document.getElementById('QRCode');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
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
                    <label className="form-label" style={labelStyle}>Transaction Hash (Unique Identifier)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={uniqueIdentifier} 
                      readOnly 
                      style={{
                        ...inputStyle,
                        color: '#ffffff', 
                        fontWeight: 'bold'
                      }} 
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
                
                {uniqueIdentifier && (
                  <div className="mt-4 text-center">
                    <QRCode value={qrCodeData} size={256} id="QRCode" />
                    <p className="text-center mt-3">
                      <button className="btn btn-success btn-sm" onClick={() => downloadQRCode(qrCodeData, `${productName || 'QRCode'}.png`)} style={downloadButtonStyle}>
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

// Existing styles remain the same
const backgroundStyle = {
  background: 'radial-gradient(circle, #1a0938, #000000)',
  minHeight: '100vh',
  color: '#fff',
  paddingTop: '20px',
};

// New styles for tabs
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

// Rest of the existing styles
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

const iconStyle = {
  fontSize: '2.5rem',
  color: '#8a2be2',
  margin: '0 1rem',
};

const qrCodeContainerStyle = {
  backgroundColor: 'white',
  padding: '1rem',
  borderRadius: '10px',
  display: 'inline-block',
  marginBottom: '1rem',
};

export default AddProductForm;