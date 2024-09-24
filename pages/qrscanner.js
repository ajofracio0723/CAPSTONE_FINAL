import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { FaBitcoin, FaEthereum, FaCube, FaCamera } from 'react-icons/fa';
import jsQR from 'jsqr';
import { Alert } from 'react-bootstrap';

const QRScanner = () => {
  const [scannedResult, setScannedResult] = useState('');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const successSoundRef = useRef(null);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanQRCode);
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });

    const scanQRCode = () => {
      const canvas = document.createElement('canvas');
      const canvasContext = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Increase canvas size for better QR code detection
        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setScannedResult(code.data);
          successSoundRef.current.play();
          setScanSuccess(true);
          setShowSuccessAlert(true); // Show success alert
          setTimeout(() => {
            setShowSuccessAlert(false); // Hide success alert after 5 seconds
            setScanSuccess(false);
          }, 5000); // Hide success message after 5 seconds
        } else {
          setScanSuccess(false);
        }
      }

      requestAnimationFrame(scanQRCode);
    };

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const canvasContext = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          canvasContext.drawImage(img, 0, 0, img.width, img.height);
          const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setScannedResult(code.data);
            successSoundRef.current.play();
            setScanSuccess(true);
            setShowSuccessAlert(true); // Show success alert
            setTimeout(() => {
              setShowSuccessAlert(false); // Hide success alert after 5 seconds
              setScanSuccess(false);
            }, 5000); // Hide success message after 5 seconds
          } else {
            setScanSuccess(false);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      // Reset file input to allow selecting the same image again
      e.target.value = null;
    }
  };

  return (
    <div className="container-fluid" style={{ ...containerStyle, paddingTop: '50px' }}>
      <Header />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={cardStyle}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center mb-4">
                {/* Bitcoin icon */}
                <FaBitcoin style={cryptoIconStyle} />
                {/* Ethereum icon */}
                <FaEthereum style={cryptoIconStyle} />
                {/* Blockchain icon */}
                <FaCube style={cryptoIconStyle} />
              </div>
              <h2 className="text-center mb-4" style={authentithiefTitleStyle}>
                AUTHENTITHIEF
              </h2>
              <h1 className="text-center mb-4" style={titleStyle}>
                <FaCamera style={{ marginRight: '0.5rem' }} />
                QR Code Scanner
              </h1>
              <div className="scanner-container" style={scannerContainerStyle}>
                <video ref={videoRef} style={videoStyle} />
                {showSuccessAlert && (
                  <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible className="small-alert" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', minWidth: '200px' }}>
                    Product is authentic
                  </Alert>
                )}
              </div>
              <form style={scannedResultContainerStyle}>
                <label htmlFor="scannedResult" style={scannedResultLabelStyle}>Scanned Result:</label>
                <textarea id="scannedResult" name="scannedResult" value={scannedResult} style={scannedResultTextAreaStyle} readOnly />
              </form>
              <button onClick={() => fileInputRef.current.click()}>Upload QR Code Image</button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <audio ref={successSoundRef} src="/1.mp3" />
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
  color: '#f0f0f0', // Lighter color
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '2rem',
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  color: '#f0f0f0', // Lighter color
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

const scannedResultContainerStyle = {
  marginTop: '1rem',
};

const scannedResultLabelStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#fff',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

const scannedResultTextAreaStyle = {
  width: '100%',
  minHeight: '100px',
  padding: '0.5rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '1.2rem',
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

const cryptoIconStyle = {
  fontSize: '3rem',
  marginRight: '0.5rem',
  color: '#fff',
};

export default QRScanner;
