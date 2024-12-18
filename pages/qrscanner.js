import React, { useState, useEffect, useRef, useCallback } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import { FaBitcoin, FaEthereum, FaCube, FaCamera } from 'react-icons/fa';
import { CheckCircle } from 'lucide-react';
import jsQR from 'jsqr';
import { RingLoader } from 'react-spinners';
import emailjs from 'emailjs-com';

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
const contractAddress = '0x5Cf3988160D1C0491723a67dC3F6F5390C77F174';

const QRScanner = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);
  const scanIntervalRef = useRef(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Centralized Error Handling Function with Toastify
  const handleError = useCallback((message, type = 'error') => {
    console.error(message);
    
    // Map error types to Toastify types
    const toastTypes = {
      'error': toast.error,
      'warning': toast.warn,
      'success': toast.success,
      'info': toast.info
    };

    // Use the appropriate toast method, defaulting to error
    const toastMethod = toastTypes[type] || toast.error;
    
    toastMethod(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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

  // Send email to manufacturer after a valid scan
  const sendEmailToManufacturer = (productDetails) => {
    const emailTemplateParams = {
      to_name: 'Manufacturer Name',
      from_name: 'Authentithief',
      product_name: productDetails.name,
      brand: productDetails.brand,
      registered_date: productDetails.registeredDate,
      owner: productDetails.owner,
    };
  
    emailjs.send(
      'service_5bfi5dv',
      'template_j8fczgt',
      emailTemplateParams,
      'lKQRJHnHiJZUWYFZ7'
    )
    .then(response => {
      toast.success('Email sent successfully to the manufacturer!', {
        position: "bottom-right",
        autoClose: 3000,
      });
    })
    .catch(error => {
      toast.error('Failed to send email. Please try again later.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    });
  };

  // Handle Redirect after Verification
  const handleRedirect = useCallback(async (productDetails) => {
    setIsLoading(true);
    
    try {
      const verificationResult = await verifyProductOnBlockchain(productDetails);

      if (verificationResult && verificationResult.isAuthentic) {
        setShowSuccessAnimation(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send email to manufacturer after successful verification
        sendEmailToManufacturer(productDetails);

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
      setShowSuccessAnimation(false);
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
          toast.error('Invalid QR code format', {
            position: "bottom-right",
            autoClose: 3000,
          });
          return false;
        }
      }
      // No QR code found - this is normal and shouldn't trigger an error
      return false;
    } catch (err) {
      toast.error('Error processing QR code', {
        position: "bottom-right",
        autoClose: 3000,
      });
      return false;
    } finally {
      isProcessingRef.current = false;
    }
  }, [handleRedirect, isScanning]);
  
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
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
  
        if (code) {
          try {
            const productDetails = JSON.parse(code.data);
            handleRedirect(productDetails);
          } catch (err) {
            toast.error('Invalid QR code in uploaded image', {
              position: "bottom-right",
              autoClose: 3000,
            });
          }
        } else {
          toast.warning('No QR code found in the image', {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        toast.error('Error reading file', {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    },
    [handleRedirect]
  );

  // Video Stream Setup
   useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let processingInterval = null;

    const startVideoStream = async () => {
      try {
        const constraints = {
          video: { 
            facingMode: 'environment', 
            width: { ideal: 640 }, 
            height: { ideal: 480 } 
          },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
        if (stream.getTracks().length === 0) {
          throw new Error('No video tracks available');
        }
    
        video.srcObject = stream;
        
        video.addEventListener('loadedmetadata', () => {
          video.play();
          // Set a reasonable interval for QR code scanning (e.g., every 500ms)
          processingInterval = setInterval(async () => {
            if (isScanning) {
              const found = await processQRCode();
              if (found) {
                clearInterval(processingInterval);
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

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      if (processingInterval) {
        clearInterval(processingInterval);
      }
    };
  }, [processQRCode, isScanning, handleError]);

  
  return (
    <div className="container-fluid" style={containerStyle}>
      <Header />
      <div className="row justify-content-center" style={{ height: '100%' }}>
        <div className="col-12 col-md-8 col-lg-6" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card" style={cardStyle}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaBitcoin style={cryptoIconStyle} />
                <FaEthereum style={cryptoIconStyle} />
                <FaCube style={cryptoIconStyle} />
              </div>
              <h2 style={authentithiefTitleStyle}>AUTHENTITHIEF</h2>
              <h1 style={titleStyle}>
                <FaCamera style={{ marginRight: '0.5rem' }} />
                QR Code Scanner
              </h1>
              
              <div className="scanner-container" style={scannerContainerStyle}>
                {isLoading || showSuccessAnimation ? (
                  <div style={loadingOverlayStyle}>
                    {showSuccessAnimation ? (
                      <div className="success-animation" style={successAnimationStyle}>
                        <CheckCircle 
                          size={64} 
                          style={{
                            color: '#4CAF50',
                            animation: 'scale-in 0.5s ease-out'
                          }}
                        /><p className="mt-3" style={successTextStyle}>QR Code Verified!</p>
                        </div>
                      ) : (
                        <div className="loading-animation" style={loadingAnimationStyle}>
                          <RingLoader
                            color="#00ff00"
                            loading={true}
                            size={100}
                            speedMultiplier={1}
                          />
                          <p className="mt-4" style={loadingTextStyle}>Verifying QR Code...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <video 
                      ref={videoRef} 
                      style={videoStyle}
                      playsInline 
                    />
                  )}
                </div>
                
                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading || showSuccessAnimation}
                  style={uploadButtonStyle}
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
  
        {/* Add ToastContainer */}
        <ToastContainer 
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
  
        <style jsx>{`
          @keyframes scale-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  };
  
  // Enhanced styles
  const containerStyle = {
    background: 'radial-gradient(circle, #330066, #000000)',
    minHeight: '100vh',
    color: '#fff',
    paddingTop: '5vh',
    padding: '15px',
    height: '100vh',
    overflow: 'hidden'
  };
  
  const cardStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '1.5rem',
    borderRadius: '15px',
    boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };
  
  const authentithiefTitleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
    color: '#f0f0f0',
    letterSpacing: '2px'
  };
  
  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
    color: '#f0f0f0'
  };
  
  const scannerContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    aspectRatio: '4/3',
    overflow: 'hidden',
    borderRadius: '10px'
  };
  
  const videoStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '10px'
  };
  
  const loadingOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '10px'
  };
  
  const successAnimationStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const loadingAnimationStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  };
  
  const successTextStyle = {
    fontSize: '1.5rem',
    color: '#4CAF50',
    marginTop: '1rem',
    animation: 'fade-in 0.5s ease-out 0.3s both',
    textAlign: 'center'
  };
  
  const loadingTextStyle = {
    fontSize: '1.2rem',
    color: '#00ff00',
    textAlign: 'center'
  };
  
  const cryptoIconStyle = {
    fontSize: '3rem',
    marginRight: '0.5rem',
    color: '#f0f0f0'
  };
  
  const uploadButtonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    padding: '12px',
    fontSize: '1.1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: '#45a049',
      transform: 'translateY(-2px)'
    }
  };
  
  export default QRScanner;