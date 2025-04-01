import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import Web3 from 'web3';

const contractABI = [
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
          { internalType: "uint256", name: "expirationTimestamp", type: "uint256" },
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

const contractAddress = '0xa918Ad6F552D4d91d44FeED9bE4D03A439fa04b1';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [registrationFee, setRegistrationFee] = useState(0);

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
        } finally {
          setLoading(false);
        }
      } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        setLoading(false);
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
  
        const formattedBatch = batch.map(product => {
          // Ensure timestamps are numbers and handle potential NaN
          const regTimestamp = Number(product.registrationTimestamp);
          
          // Check if timestamp is valid
          const registeredDateTime = !isNaN(regTimestamp) 
            ? new Date(regTimestamp * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })
            : 'Invalid Date';

          return {
            name: product.productName,
            owner: product.owner,
            registeredDateTime: registeredDateTime,
            expirationTimestamp: product.expirationTimestamp
          };
        });
  
        loadedProducts.push(...formattedBatch);
      }
  
      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  return (
    <div className="container-fluid" style={backgroundStyle}>
      <Header />
      {account && (
        <div className="text-center mb-3" style={{ color: '#0f0' }}>
          Connected Wallet: {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </div>
      )}
      
      <div className="container mt-4">
        <h1 className="text-center mb-4" style={headingStyle}>Product Registry</h1>
        
        {loading ? (
          <div className="text-center text-white">
            <p>Loading products...</p>
          </div>
        ) : (
          <ProductList products={products} registrationFee={registrationFee} />
        )}
      </div>
    </div>
  );
};

const backgroundStyle = {
  background: 'radial-gradient(circle, #1a0938, #000000)',
  minHeight: '100vh',
  color: '#fff',
  paddingTop: '20px'
};

const headingStyle = {
  color: '#fff',
  textShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
  fontWeight: 'bold'
};

export default ViewProducts;