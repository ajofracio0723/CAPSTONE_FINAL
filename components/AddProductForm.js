import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import Header from './Header';
import { FaBitcoin, FaEthereum, FaCube, FaPlusCircle } from 'react-icons/fa';
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
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
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

  return (
    <div className="container-fluid" style={backgroundStyle}>
      <Header />
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
                <button type="submit" className="btn btn-primary" style={buttonStyle}>
                  <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Add Product to Blockchain
                </button>
              </form>
              {qrCodeData && (
                <div className="text-center mt-4">
                  <h2 className="mb-3" style={headingStyle}>QR Code</h2>
                  <QRCode value={qrCodeData} size={256} bgColor="#ffffff" fgColor="#000000" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  border: 'none',
};

const headingStyle = {
  color: '#fff',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
};

const labelStyle = {
  color: '#fff',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

const inputStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  width: '100%',
};

const buttonStyle = {
  padding: '0.8rem 2.5rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundImage: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  color: '#fff',
  border: '2px solid #6f42c1',
  borderRadius: '50px',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 0 10px rgba(116, 79, 160, 0.5)',
};

const iconStyle = {
  fontSize: '2rem',
  color: '#fff',
  marginRight: '0.5rem',
};

const tableContainerStyle = {
  maxHeight: '400px',
  overflowY: 'auto',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #6f42c1',
  backgroundColor: 'rgba(111, 66, 193, 0.3)',
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const tdStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

const trEvenStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
};

const trOddStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

export default AddProductForm;