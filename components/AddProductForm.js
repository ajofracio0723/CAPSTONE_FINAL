import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Header from './Header';
import { FaBitcoin, FaEthereum, FaCube, FaPlusCircle, FaDownload } from 'react-icons/fa';
import Web3 from 'web3';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueIdentifier, setUniqueIdentifier] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [products, setProducts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [activeTab, setActiveTab] = useState('addProduct');

  useEffect(() => {
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
                {
                  "internalType": "string",
                  "name": "_productName",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_uniqueIdentifier",
                  "type": "string"
                }
              ],
              "name": "addProduct",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getProductCount",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "_index",
                  "type": "uint256"
                }
              ],
              "name": "getProduct",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
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
    if (!productName || !description || !uniqueIdentifier) {
      alert('Please fill in all fields');
      return;
    }
    const newProduct = {
      productName,
      description,
      uniqueIdentifier
    };

    try {
      await contract.methods.addProduct(productName, description, uniqueIdentifier)
        .send({ from: account });

      const data = JSON.stringify(newProduct);
      setQRCodeData(data);
      setProducts([...products, newProduct]);
      setProductName('');
      setDescription('');
      setUniqueIdentifier('');
    } catch (error) {
      console.error("Error adding product to blockchain:", error);
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

      <div className="text-center mb-4">
        <button 
          className={`btn ${activeTab === 'addProduct' ? 'btn-primary' : 'btn-secondary'} mr-2`} 
          onClick={() => setActiveTab('addProduct')}
        >
          Add Product
        </button>
        <button 
          className={`btn ${activeTab === 'viewProducts' ? 'btn-primary' : 'btn-secondary'}`} 
          onClick={() => setActiveTab('viewProducts')}
        >
          View Added Products
        </button>
      </div>

      {activeTab === 'addProduct' && (
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <FaBitcoin style={iconStyle} />
                  <FaEthereum style={iconStyle} />
                  <FaCube style={iconStyle} />
                </div>
                <h1 className="text-center mb-4" style={headingStyle}>
                  <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Product
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <strong><label htmlFor="productName" className="form-label" style={labelStyle}>Product Name</label></strong>
                    <input type="text" className="form-control" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <strong><label htmlFor="description" className="form-label" style={labelStyle}>Description</label></strong>
                    <textarea className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <strong><label htmlFor="uniqueIdentifier" className="form-label" style={labelStyle}>Unique Identifier</label></strong>
                    <input type="text" className="form-control" id="uniqueIdentifier" value={uniqueIdentifier} onChange={(e) => setUniqueIdentifier(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary" style={buttonStyle}>
                      <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Product to Blockchain
                    </button>
                  </div>
                </form>
                {qrCodeData && (
                  <div className="text-center mt-4">
                    <h2 className="mb-3" style={headingStyle}>QR Code</h2>
                    <div style={qrCodeContainerStyle}>
                      <QRCode id="QRCode" value={qrCodeData} size={200} bgColor="#ffffff" fgColor="#000000" />
                    </div>
                    <button 
                      onClick={() => downloadQRCode(qrCodeData, 'product-qr-code.png')} 
                      className="btn btn-success mt-3"
                      style={downloadButtonStyle}
                    >
                      <FaDownload style={{ marginRight: '0.5rem' }} /> Download QR Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'viewProducts' && (
        <div className="row mt-4">
          <div className="col">
            <h2 className="text-center mb-4" style={headingStyle}>Added Products</h2>
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product Name</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Unique Identifier</th>
                    <th style={thStyle}>QR Code</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} style={index % 2 === 0 ? trEvenStyle : trOddStyle}>
                      <td style={tdStyle}>{product.productName}</td>
                      <td style={tdStyle}>{product.description}</td>
                      <td style={tdStyle}>{product.uniqueIdentifier}</td>
                      <td style={tdStyle}>
                        <QRCode value={JSON.stringify(product)} size={64} bgColor="#ffffff" fgColor="#000000" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const backgroundStyle = {
  background: 'radial-gradient(circle, #1a0938, #000000)',
  minHeight: '100vh',
  color: '#fff',
  paddingTop: '20px',
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

const tableContainerStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  width: '100%', // Ensures the table takes full width
  maxWidth: '800px', // Limits the maximum width of the table
  margin: '0 auto', // Centers the table horizontally
};

const tableStyle = {
  width: '100%', // Full width of the container
  borderCollapse: 'separate',
  borderSpacing: '0 0.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
};

const thStyle = {
  padding: '1rem',
  textAlign: 'left',
  backgroundColor: 'rgba(138, 43, 226, 0.3)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  borderBottom: '2px solid rgba(138, 43, 226, 0.5)',
  whiteSpace: 'nowrap', // Prevents text wrapping for headers
  width: '25%', // Adjusts the width of each column
};

const tdStyle = {
  padding: '1rem',
  textAlign: 'left',
  borderBottom: '1px solid rgba(138, 43, 226, 0.2)',
  whiteSpace: 'nowrap', // Prevents text wrapping for table data
  verticalAlign: 'middle',
};

const trEvenStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
};

const trOddStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

export default AddProductForm;