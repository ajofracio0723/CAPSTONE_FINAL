import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Header from './Header';
import { FaPlusCircle, FaDownload, FaList } from 'react-icons/fa';
import ProductList from './ProductList';
import Web3 from 'web3';

const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_productName", type: "string" },
      { internalType: "string", name: "_brand", type: "string" }
    ],
    name: "addProduct",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalProducts",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_start", type: "uint256" },
      { internalType: "uint256", name: "_count", type: "uint256" }
    ],
    name: "getProductsPaginated",
    outputs: [
      {
        components: [
          { internalType: "string", name: "productName", type: "string" },
          { internalType: "string", name: "brand", type: "string" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "registrationTimestamp", type: "uint256" }
        ],
        internalType: "struct ProductRegistry.Product[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const contractAddress = '0x1d8cfD258d595d49A7048481A471e45604a4Ba6E';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [products, setProducts] = useState([]);
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [activeTab, setActiveTab] = useState('addProduct');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0.000001);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
          await loadProducts(contractInstance);
        } catch (error) {
          console.error("Web3 initialization failed", error);
          alert("Please install MetaMask and connect your wallet");
        }
      } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
      }
    };
    initWeb3();
  }, []);

  const loadProducts = async (contractInstance) => {
    try {
      // Get total number of products
      const totalProducts = await contractInstance.methods.getTotalProducts().call();
  
      // Fetch products in batches (e.g., 20 at a time)
      const batchSize = 20;
      const loadedProducts = [];
  
      for (let i = 0; i < totalProducts; i += batchSize) {
        const batch = await contractInstance.methods.getProductsPaginated(i, batchSize).call();
  
        const formattedBatch = batch.map(product => ({
          name: product.productName,
          brand: product.brand,
          owner: product.owner,
          registeredDateTime: new Date(parseInt(product.registrationTimestamp) * 1000).toLocaleDateString()
        }));
  
        loadedProducts.push(...formattedBatch);
      }
  
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !brand) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      if (contract && account) {
        const feeInWei = web3.utils.toWei(registrationFee.toString(), 'ether');

        const gasEstimate = await contract.methods.addProduct(
          productName,
          brand
        ).estimateGas({ from: account, value: feeInWei });

        const receipt = await contract.methods.addProduct(
          productName,
          brand
        ).send({
          from: account,
          gas: gasEstimate,
          value: feeInWei
        });

        const formattedDate = getCurrentDate();
        setRegisteredDateTime(formattedDate);

        const qrData = {
          name: productName,
          brand,
          registeredDate: formattedDate,
          transactionHash: receipt.transactionHash,
          contractAddress: contract.options.address
        };

        setQRCodeData(JSON.stringify(qrData));
        await loadProducts(contract);
        setProductName('');
        setBrand('');
      }
    } catch (error) {
      if (error.code === 4001) {
        alert('Transaction was rejected. Please try again.');
      } else {
        console.error(error);
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${productName || 'QRCode'}.png`;
    link.click();
  };

  return (
    <div className="container-fluid" style={backgroundStyle}>
      <Header />
      {account && (
        <div className="text-center mb-3" style={{ color: '#0f0' }}>
          Connected Wallet: {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </div>
      )}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group" role="group" style={tabGroupStyle}>
          <button
            className={`btn ${activeTab === 'addProduct' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('addProduct')}
            style={activeTab === 'addProduct' ? activeTabStyle : tabStyle}
          >
            <FaPlusCircle className="me-2" /> Register Product
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
                    <label htmlFor="registrationFee" className="form-label" style={labelStyle}>Registration Fee (ETH)</label>
                    <input 
                      type="number" 
                      step="0.000001" 
                      className="form-control" 
                      id="registrationFee" 
                      value={registrationFee} 
                      onChange={(e) => setRegistrationFee(parseFloat(e.target.value))} 
                      style={inputStyle} 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={labelStyle}>Date Registered</label>
                    <input type="text" className="form-control" value={registeredDateTime} readOnly style={inputStyle} />
                  </div>
                  <div className="d-flex justify-content-center mt-4">
                    <button type="submit" className="btn btn-primary btn-lg" style={buttonStyle} disabled={isSubmitting}>
                      {isSubmitting ? 'Processing...' : 'Register Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {qrCodeData && (
            <div className="text-center mt-5">
              <QRCodeCanvas value={qrCodeData} size={256} />
              <div className="mt-3">
                <button className="btn btn-success" onClick={downloadQRCode}>
                  <FaDownload className="me-2" /> Download QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'viewProducts' && (
        <div className="mt-4">
          <ProductList products={products} />
        </div>
      )}
    </div>
  );
};

const backgroundStyle = {
  background: 'radial-gradient(circle, #1a0938, #000000)',
  minHeight: '100vh',
  color: '#fff',
  paddingTop: '20px'
};

const tabGroupStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  padding: '0.5rem',
  borderRadius: '50px',
  boxShadow: '0 0 20px rgba(138, 43, 226, 0.2)'
};

const tabStyle = {
  padding: '0.8rem 2rem',
  margin: '0 0.5rem',
  borderRadius: '25px',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(138, 43, 226, 0.3)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff'
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: 'rgba(138, 43, 226, 0.5)',
  boxShadow: '0 0 15px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.5)'
};

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  padding: '2rem'
};

const headingStyle = {
  color: '#fff',
  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
  fontWeight: 'bold'
};

const labelStyle = {
  color: '#fff',
  textShadow: '0 0 5px rgba(138, 43, 226, 0.3)',
  fontWeight: 'bold'
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
  transition: 'all 0.3s ease'
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
  transition: 'all 0.3s ease'
};

export default AddProductForm;
