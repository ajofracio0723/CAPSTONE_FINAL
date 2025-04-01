import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import { FaBitcoin, FaEthereum, FaCubes, FaBarcode, FaQrcode, FaTag, FaShieldAlt } from 'react-icons/fa';
import { SiSolidity } from 'react-icons/si';
import { MdVerified } from 'react-icons/md';
import Image from 'next/image';
import landingImage from '../public/images/1.png';
import image2 from '../public/images/2.png';
import image3 from '../public/images/3.png';
import image4710 from '../public/images/4710.png';
import logo from '../public/images/4710 logo.png';
import MoreContent from './MoreContent';

const Home = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [buttonClick, setButtonClick] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleQRScannerClick = () => {
    setButtonClick(true);
    setTimeout(() => {
      setButtonClick(false);
      router.push('/qrscanner');
    }, 300);
  };

  const handleLearnMoreClick = () => {
    const moreContentSection = document.getElementById('moreContent');
    moreContentSection.scrollIntoView({ behavior: 'smooth' });
  };

  const buttonHoverStyle = buttonHover ? {
    backgroundColor: 'rgba(142, 45, 226, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.9)',
    transform: 'translateY(-3px)',
    boxShadow: '0 0 20px rgba(142, 45, 226, 0.7), 0 0 30px rgba(255, 255, 255, 0.3)',
    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
  } : {};

  const buttonClickStyle = buttonClick ? {
    transform: 'scale(0.95)',
    boxShadow: '0 0 25px rgba(142, 45, 226, 0.9), 0 0 40px rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(142, 45, 226, 0.5)',
  } : {};

  return (
    <div style={containerStyle}>
      <Header />
      <div style={contentContainerStyle}>
        <div style={leftContentStyle}>
          <div style={iconContainerStyle}>
            <FaBitcoin style={iconStyle} />
            <FaEthereum style={iconStyle} />
            <FaCubes style={iconStyle} />
          </div>
          <div style={logoContainerStyle}>
            <Image 
              src={logo} 
              alt="4710 Logo" 
              width={300} 
              height={300} 
              objectFit="contain" 
            />
          </div>
          <div style={buttonContainerStyle}>
            <button
              onClick={handleQRScannerClick}
              onMouseEnter={() => setButtonHover(true)}
              onMouseLeave={() => setButtonHover(false)}
              style={{
                ...buttonStyle,
                ...buttonHoverStyle,
                ...buttonClickStyle,
              }}
            >
              <div style={{
                ...buttonGlowStyle,
                opacity: buttonHover ? 1 : 0,
              }}></div>
              Authenticate Product
              <div style={{
                position: 'absolute',
                right: '20px',
                opacity: buttonHover ? 1 : 0,
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                transform: buttonHover ? 'rotate(0deg) scale(1.2)' : 'rotate(-45deg) scale(0.8)',
                display: 'flex',
              }}>
                <MdVerified style={{
                  fontSize: '1.3rem',
                  color: '#4cff4c',
                }} />
              </div>
            </button>
          </div>
        </div>
        <div style={rightContentStyle}>
          <Image 
            src={image4710} 
            alt="4710 Blockchain Technology" 
            style={backgroundImageStyle}
            width={500}
            height={500}
            objectFit="cover"
          />
          <div style={learnMoreContainerStyle}>
            <button onClick={handleLearnMoreClick} style={learnMoreButtonStyle}>Learn More</button>
            <p style={antiCounterfeitTextStyle}>Learn more about our revolutionary anti-counterfeit system powered by blockchain technology.</p>
          </div>
        </div>
      </div>
      <footer style={footerStyle}>
        <div style={footerContentStyle}>
          <div style={footerIconContainerStyle}>
            <FaBitcoin style={footerIconStyle} />
            <FaEthereum style={footerIconStyle} />
            <FaCubes style={footerIconStyle} />
            <SiSolidity style={footerIconStyle} />
            <Image src={landingImage} alt="Landing Image" style={footerIconStyle} />
            <Image src={image2} alt="Image 2" style={footerIconStyle} />
            <Image src={image3} alt="Image 3" style={footerIconStyle} />
          </div>
        </div>
      </footer>
      <MoreContent />
    </div>
  );
};

const containerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  overflow: 'auto',
  fontFamily: 'Roboto, sans-serif',
  background: 'radial-gradient(circle, #1a0938, #000000)',
  color: '#fff',
};

const contentContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '2rem',
};

const leftContentStyle = {
  flex: '1',
  marginRight: '2rem',
  textAlign: 'center',
  paddingLeft: '2rem',
};

const rightContentStyle = {
  position: 'relative',
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '5rem',
};

// Added the missing backgroundImageStyle
const backgroundImageStyle = {
  borderRadius: '20px',
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '2rem',
};

const logoContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '2rem',
};

const iconContainerStyle = {
  marginBottom: '1rem',
};

const iconStyle = {
  fontSize: '3rem',
  marginRight: '0.5rem',
};

const titleStyle = {
  fontSize: '4rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
};

const textStyle = {
  fontSize: '1.8rem',
  marginBottom: '2rem',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 3rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  backgroundColor: 'rgba(74, 0, 224, 0.1)',
  color: '#fff',
  border: '2px solid rgba(255, 255, 255, 0.7)',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 0 15px rgba(142, 45, 226, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
};

const buttonGlowStyle = {
  content: '""',
  position: 'absolute',
  top: '-50%',
  left: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(142, 45, 226, 0.3) 0%, rgba(142, 45, 226, 0) 70%)',
  transition: 'opacity 0.3s ease',
  zIndex: -1,
};

const learnMoreButtonStyle = {
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

const learnMoreContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const antiCounterfeitTextStyle = {
  fontSize: '1rem',
  marginTop: '1rem',
  textAlign: 'center',
};

const footerStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  padding: '2rem 0',
  marginTop: '2rem',
};

const footerContentStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'flex-start',
  maxWidth: '1200px',
  margin: '0 auto',
};

const footerIconContainerStyle = {
  fontSize: '4rem',
  display: 'flex',
  alignItems: 'center',
};

const footerIconStyle = {
  marginRight: '1rem',
  width: '4rem',
  height: '4rem',
};

export default Home;