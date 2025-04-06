import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import { FaPlusCircle, FaDownload, FaClock } from 'react-icons/fa';
import Web3 from 'web3';
import QRCode from 'qrcode';

const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_productName", type: "string" },
      { internalType: "uint256", name: "_expirationTimestamp", type: "uint256" }
    ],
    name: "addProduct",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

const contractAddress = '0xa918Ad6F552D4d91d44FeED9bE4D03A439fa04b1';

const TimerInput = ({ onTimerChange }) => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  // Add dependency array to prevent infinite update loop
  useEffect(() => {
    onTimerChange({ minutes, seconds });
  }, [minutes, seconds]); // Remove onTimerChange from dependencies

  return (
    <div className="d-flex align-items-center" style={timerInputStyle}>
      <div className="me-2">
        <label htmlFor="minutes" className="form-label" style={labelStyle}>Minutes</label>
        <input 
          type="number" 
          id="minutes"
          min="0" 
          max="5" 
          value={minutes} 
          onChange={(e) => setMinutes(Math.min(5, Math.max(0, parseInt(e.target.value) || 0)))}
          className="form-control" 
          style={inputStyle}
        />
      </div>
      <div>
        <label htmlFor="seconds" className="form-label" style={labelStyle}>Seconds</label>
        <input 
          type="number" 
          id="seconds"
          min="0" 
          max="59" 
          value={seconds} 
          onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
          className="form-control" 
          style={inputStyle}
        />
      </div>
    </div>
  );
};

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [registeredDateTime, setRegisteredDateTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeData, setQRCodeData] = useState('');
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0.000001);
  const [timeRemaining, setTimeRemaining] = useState('5m 0s');
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState({ minutes: 5, seconds: 0 });
  const canvasRef = useRef(null);

  // Update expiration date when timer changes
  useEffect(() => {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + timerDuration.minutes);
    expirationTime.setSeconds(expirationTime.getSeconds() + timerDuration.seconds);
    
    setExpirationDate(expirationTime.toISOString());
  }, [timerDuration]);

  // Timer countdown effect
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        const now = new Date();
        const expiration = new Date(expirationDate);
        const diff = expiration - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeRemaining('0m 0s');
          setTimerActive(false);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerActive, expirationDate]);

  // Generate QR code when data changes
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Use the recommended method instead of window.ethereum.enable()
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
  
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setTimerActive(true);

    try {
      if (contract && account) {
        const feeInWei = web3.utils.toWei(registrationFee.toString(), 'ether');
        
        // Convert expirationDate to UNIX timestamp (seconds since epoch)
        const expirationTimestamp = Math.floor(new Date(expirationDate).getTime() / 1000);

        const gasEstimate = await contract.methods.addProduct(
          productName,
          expirationTimestamp
        ).estimateGas({ from: account, value: feeInWei });

        const receipt = await contract.methods.addProduct(
          productName,
          expirationTimestamp
        ).send({
          from: account,
          gas: gasEstimate,
          value: feeInWei
        });

        const formattedDate = getCurrentDateTime();
        setRegisteredDateTime(formattedDate);

        const qrData = {
          name: productName,
          registeredDate: formattedDate,
          expirationDate: formatDateTimeForDisplay(new Date(expirationDate)),
          expirationTimestamp: expirationTimestamp,
          transactionHash: receipt.transactionHash,
          contractAddress: contract.options.address
        };

        setQRCodeData(JSON.stringify(qrData));
        setProductName('');
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

  // Helper functions
  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTimeForDisplay(now);
  };

  const formatDateTimeForDisplay = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${JSON.parse(qrCodeData).name || 'QRCode'}.png`;
      link.click();
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
        <h1 className="text-center mb-4" style={headingStyle}>
          <FaPlusCircle style={{ marginRight: '0.5rem' }} /> Register Product
        </h1>
        
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card" style={cardStyle}>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label" style={labelStyle}>Product Name</label>
                    <input type="text" className="form-control" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} style={inputStyle} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={labelStyle}>
                      <FaClock className="me-2" /> Expiration Timer
                    </label>
                    <TimerInput 
                      onTimerChange={(timer) => setTimerDuration(timer)}
                    />
                    <small className="text-light">Set timer duration before expiration</small>
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
                    <label className="form-label" style={labelStyle}>Date & Time Registered</label>
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
            <div className="col-md-6 mt-4 mt-md-0">
              <div className="card" style={cardStyle}>
                <div className="card-body text-center">
                  <h2 style={headingStyle}>Product QR Code</h2>
                  <div className="mb-3">
                    <canvas ref={canvasRef}></canvas>
                  </div>
                  <div className="mb-3" style={qrInfoStyle}>
                    <p><strong>Product:</strong> {JSON.parse(qrCodeData).name}</p>
                    <p><strong>Registered:</strong> {JSON.parse(qrCodeData).registeredDate}</p>
                    <p style={expirationStyle}>
                      <FaClock className="me-2" />
                      <strong>Expires:</strong> {JSON.parse(qrCodeData).expirationDate}
                    </p>
                  </div>
                  <button className="btn btn-success" onClick={downloadQRCode} style={downloadButtonStyle}>
                    <FaDownload className="me-2" /> Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
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

const cardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(138, 43, 226, 0.3)',
  border: '1px solid rgba(138, 43, 226, 0.2)',
  padding: '2rem'
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

const timerInputStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem', 
};

const qrInfoStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  padding: '1rem',
  borderRadius: '8px',
  marginTop: '1rem',
  textAlign: 'left'
};

const expirationStyle = {
  color: '#ff9d00',
  fontWeight: 'bold'
};

const downloadButtonStyle = {
  backgroundImage: 'linear-gradient(to right, #00b09b, #96c93d)',
  padding: '0.7rem 1.5rem',
  borderRadius: '25px',
  border: 'none',
  boxShadow: '0 0 15px rgba(0, 176, 155, 0.3)'
};

export default AddProductForm;