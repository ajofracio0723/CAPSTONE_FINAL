import React, { useState, useEffect, useRef, useCallback } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { FaBitcoin, FaEthereum, FaCube, FaCamera } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import jsQR from 'jsqr';
import { Alert } from 'react-bootstrap';

// Contract details from AddProductForm
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
const contractAddress = '0x1890E27C98637259fd9D5FEB0dAdb48b93640e99';

const QRScanner = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);
  const scanIntervalRef = useRef(null);
  const lastValidScanRef = useRef(null);

  // Centralized Error Handling Function
  const handleError = useCallback((message, type = 'danger') => {
    console.error(message);
    setErrorMessage({
      text: message,
      type: type
    });

    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  }, []);

  // Web3 Initialization with Improved Error Handling
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('No Ethereum wallet detected. Please install MetaMask.');
        }

        const web3Instance = new Web3(window.ethereum);
        
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (permissionError) {
          throw new Error('Permission to access Ethereum wallet denied.');
        }

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length === 0) {
          throw new Error('No Ethereum accounts found. Please connect your wallet.');
        }

        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(
          contractABI, 
          contractAddress
        );
        setContract(contractInstance);

      } catch (error) {
        handleError(error.message || 'Web3 initialization failed');
      }
    };

    initWeb3();
  }, [handleError]);

  // Verify Product on Blockchain with More Detailed Error Handling
  const verifyProductOnBlockchain = async (productDetails) => {
    if (!contract || !web3) {
      handleError('Web3 or contract not initialized');
      return null;
    }

    try {
      const totalProducts = await contract.methods.getTotalProducts().call();

      const batchSize = 20;
      for (let i = 0; i < totalProducts; i += batchSize) {
        try {
          const batch = await contract.methods.getProductsPaginated(i, batchSize).call();
          
          for (const product of batch) {
            if (
              product.productName.toLowerCase() === productDetails.name.toLowerCase() &&
              product.brand.toLowerCase() === productDetails.brand.toLowerCase()
            ) {
              return {
                isAuthentic: true,
                owner: product.owner,
                registrationTimestamp: product.registrationTimestamp
              };
            }
          }
        } catch (batchError) {
          handleError(`Error fetching product batch: ${batchError.message}`, 'warning');
        }
      }

      return { isAuthentic: false };
    } catch (error) {
      handleError(`Blockchain verification error: ${error.message}`);
      return null;
    }
  };

  // Handle Redirect after Verification
  const handleRedirect = useCallback(async (productDetails) => {
    setIsLoading(true);
    
    try {
      // Verify product on blockchain
      const verificationResult = await verifyProductOnBlockchain(productDetails);

      if (verificationResult && verificationResult.isAuthentic) {
        // Redirect with blockchain verification details
        router.push(
          `/product-status?name=${encodeURIComponent(productDetails.name)}&brand=${encodeURIComponent(productDetails.brand)}&registeredDateTime=${encodeURIComponent(verificationResult.registrationTimestamp)}&owner=${encodeURIComponent(verificationResult.owner)}&isAuthentic=true`
        );
      } else {
        handleError('Product not found in blockchain registry', 'warning');
        router.push('/product-status?invalid=true');
      }
    } catch (error) {
      handleError(`Verification process failed: ${error.message}`);
      router.push('/product-status?invalid=true');
    } finally {
      setIsLoading(false);
    }
  }, [router, verifyProductOnBlockchain, handleError]);

  // Process QR Code
  const processQRCode = useCallback(async () => {
    const video = videoRef.current;
    if (!video || isProcessingRef.current || !isScanning) return false;

    isProcessingRef.current = true;

    try {
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        try {
          const productDetails = JSON.parse(code.data);

          // Validate QR code structure
          if (!productDetails.name || 
              !productDetails.brand || 
              !productDetails.registeredDate) {
            throw new Error('Invalid QR code data structure');
          }

          setIsScanning(false);
          handleRedirect(productDetails);
          return true;
        } catch (err) {
          handleError('Invalid QR code format or data: ' + err.message);
        }
      }
    } catch (err) {
      handleError('Error processing QR code: ' + err.message);
    } finally {
      isProcessingRef.current = false;
    }
    
    return false;
  }, [handleRedirect, handleError, isScanning]);

  // File Input Change Handler
  const handleFileInputChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.readAsDataURL(file);
        });

        const img = await new Promise((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.src = imageUrl;
        });

        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        canvasContext.drawImage(img, 0, 0, img.width, img.height);

        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          const productDetails = JSON.parse(code.data);

          // Validate QR code structure
          if (!productDetails.name || 
              !productDetails.brand || 
              !productDetails.registeredDate) {
            throw new Error('Invalid QR code data structure');
          }

          handleRedirect(productDetails);
        } else {
          handleError('No QR code detected in the uploaded image.');
        }
      } catch (err) {
        handleError('Invalid QR code format or data: ' + err.message);
      }

      e.target.value = null;
    },
    [handleRedirect, handleError]
  );

  // Video Stream Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startVideoStream = async () => {
      try {
        const constraints = {
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
        if (stream.getTracks().length === 0) {
          throw new Error('No video tracks available');
        }
    
        video.srcObject = stream;
        
        video.addEventListener('loadedmetadata', () => {
          video.play();
          scanIntervalRef.current = setInterval(async () => {
            if (isScanning) {
              const found = await processQRCode();
              if (found) {
                clearInterval(scanIntervalRef.current);
              }
            }
          }, 500);
        });
      } catch (err) {
        handleError(`Camera access failed: ${err.message}`);
      }
    };

    startVideoStream();

    const handleResize = () => {
      if (videoRef.current) {
        videoRef.current.style.maxWidth = '100%';
        videoRef.current.style.height = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [processQRCode, isScanning, handleError]);

  return (
    <div 
      className="container-fluid" 
      style={{ 
        ...containerStyle, 
        paddingTop: '5vh', 
        padding: '15px',  
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Header />
      <div className="row justify-content-center" style={{ height: '100%' }}>
        <div className="col-12 col-md-8 col-lg-6" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card" style={{
            ...cardStyle, 
            padding: '1rem',  
            marginBottom: '1rem'
          }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaBitcoin style={cryptoIconStyle} />
                <FaEthereum style={cryptoIconStyle} />
                <FaCube style={cryptoIconStyle} />
              </div>
              <h2 style={{...authentithiefTitleStyle, fontSize: '2.5rem'}}>AUTHENTITHIEF</h2>
              <h1 style={{...titleStyle, fontSize: '2rem'}}>
                <FaCamera style={{ marginRight: '0.5rem' }} />
                QR Code Scanner
              </h1>
              
              <div 
                className="scanner-container" 
                style={{
                  ...scannerContainerStyle, 
                  height: 'auto', 
                  maxHeight: '50vh'
                }}
              >
                {isLoading ? (
                  <div style={loadingOverlayStyle}>
                    <Loader2 className="animate-spin" size={48} />
                    <p className="mt-3">Processing QR Code...</p>
                  </div>
                ) : (
                  <video 
                    ref={videoRef} 
                    style={{
                      ...videoStyle, 
                      maxWidth: '100%', 
                      width: '100%',
                      objectFit: 'cover'
                    }} 
                    playsInline 
                  />
                )}
              </div>
              
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => fileInputRef.current.click()}
                disabled={isLoading}
              >
                Upload QR Code Image
              </button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Centralized Error Alert */}
      {errorMessage && (
        <Alert 
          variant={errorMessage.type} 
          onClose={() => setErrorMessage(null)} 
          dismissible
          style={{
            position: 'fixed', 
            top: '10px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            maxWidth: '90%'
          }}
        >
          {errorMessage.text}
        </Alert>
      )}
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
  padding: '1rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
};

const authentithiefTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0',
};

const titleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0',
};

const scannerContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
};

const videoStyle = {
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '10px',
};

const loadingOverlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: '10px',
  color: '#fff',
};

const cryptoIconStyle = {
  fontSize: '3rem',
  marginRight: '0.5rem',
  color: '#f0f0f0',
};

const alertStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  minWidth: '200px',
};

export default QRScanner;