import React from 'react';
import Header from '../components/Header';
import { FaBitcoin, FaEthereum, FaShieldAlt, FaQrcode, FaTshirt, FaUserCheck } from 'react-icons/fa';
import { SiSolidity } from 'react-icons/si';
import { MdVerified } from 'react-icons/md';
import Image from 'next/image';
import logo from '../public/images/4710 logo.png';

const AboutUs = () => {
  const handleShopNowClick = () => {
    window.open('https://www.facebook.com/4710localstreets', '_blank');
  };

  return (
    <div style={containerStyle}>
      <Header />
      
      <div style={heroSectionStyle}>
        <div style={logoContainerStyle}>
          <Image 
            src={logo} 
            alt="4710 Logo" 
            width={200} 
            height={200} 
            objectFit="contain" 
          />
        </div>
        <h1 style={mainTitleStyle}>About 4710</h1>
        <p style={subtitleStyle}>Blockchain-Powered Authenticity for Your Wardrobe</p>
      </div>
      
      <div style={contentSectionStyle}>
        <div style={missionSectionStyle}>
          <h2 style={sectionTitleStyle}>Our Mission</h2>
          <div style={dividerStyle}></div>
          <p style={paragraphStyle}>
            At 4710, we're revolutionizing the fashion industry by combining authentic clothing designs with cutting-edge 
            blockchain technology. As a direct-to-consumer manufacturer, we've eliminated the middlemen to bring you 
            premium quality clothing while solving one of fashion's biggest problems: counterfeiting.
          </p>
        </div>
        
        <div style={twoColumnSectionStyle}>
          <div style={columnStyle}>
            <div style={iconContainerStyle}>
              <FaShieldAlt style={{...iconStyle, color: '#8e2de2'}} />
            </div>
            <h3 style={featureTitleStyle}>Authenticity Guaranteed</h3>
            <p style={featureTextStyle}>
              Every 4710 product comes with a unique blockchain-verified QR code that proves its authenticity. 
              Our system makes counterfeiting virtually impossible, ensuring you always get genuine 4710 quality.
            </p>
          </div>
          
          <div style={columnStyle}>
            <div style={iconContainerStyle}>
              <FaTshirt style={{...iconStyle, color: '#4a00e0'}} />
            </div>
            <h3 style={featureTitleStyle}>Manufacturer Direct</h3>
            <p style={featureTextStyle}>
              As a direct-to-consumer brand, we control our entire supply chain. From design to production to delivery, 
              we maintain the highest standards while offering exceptional value without retail markups.
            </p>
          </div>
        </div>
        
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>How Our Technology Works</h2>
          <div style={dividerStyle}></div>
          
          <div style={techStepsSectionStyle}>
            <div style={techStepStyle}>
              <div style={stepNumberStyle}>1</div>
              <h4 style={stepTitleStyle}>Product Registration</h4>
              <p style={stepTextStyle}>
                Each garment is registered on the Ethereum blockchain with unique product details and expiration data.
              </p>
            </div>
            
            <div style={techStepStyle}>
              <div style={stepNumberStyle}>2</div>
              <h4 style={stepTitleStyle}>QR Code Generation</h4>
              <p style={stepTextStyle}>
                A unique QR code is generated containing immutable blockchain transaction details linked to your product.
              </p>
            </div>
            
            <div style={techStepStyle}>
              <div style={stepNumberStyle}>3</div>
              <h4 style={stepTitleStyle}>Verification Process</h4>
              <p style={stepTextStyle}>
                Customers scan the QR code to instantly verify authenticity, manufacturing date, and product information.
              </p>
            </div>
          </div>
        </div>
        
        <div style={foundersSection}>
          <h2 style={sectionTitleStyle}>Our Story</h2>
          <div style={dividerStyle}></div>
          <p style={paragraphStyle}>
            4710 began with a passion for authentic, high-quality clothing and a vision to protect our designs from counterfeiters.
            As a local clothing brand focused on direct-to-consumer sales, we understand the importance of building trust with our customers.
          </p>
          <p style={paragraphStyle}>
            In early 2025, we made a groundbreaking move by integrating blockchain technology into our product authentication system. 
            We're proud to be at the forefront of fashion innovation, using the latest technology to guarantee authenticity while 
            maintaining the personal connection of a local brand.
          </p>
          <p style={paragraphStyle}>
            Though our blockchain journey has just begun, our commitment to quality craftsmanship and authentic designs has been 
            our foundation from day one. The addition of blockchain verification is the next step in our mission to provide 
            confidence and transparency to our loyal customers.
          </p>
        </div>
        
        <div style={twoColumnSectionStyle}>
          <div style={columnStyle}>
            <div style={iconContainerStyle}>
              <FaUserCheck style={{...iconStyle, color: '#8e2de2'}} />
            </div>
            <h3 style={featureTitleStyle}>Customer Trust</h3>
            <p style={featureTextStyle}>
              We believe transparency builds trust. Our new blockchain verification system allows you to verify your product's 
              authenticity instantly, giving you complete confidence in your purchase.
            </p>
          </div>
          
          <div style={columnStyle}>
            <div style={iconContainerStyle}>
              <FaQrcode style={{...iconStyle, color: '#4a00e0'}} />
            </div>
            <h3 style={featureTitleStyle}>Simple Verification</h3>
            <p style={featureTextStyle}>
              No technical knowledge required. Simply scan the QR code with your smartphone to instantly verify your 
              product's authenticity through our intuitive interface.
            </p>
          </div>
        </div>

        <div style={innovationSectionStyle}>
          <h2 style={sectionTitleStyle}>2025: Our Blockchain Innovation</h2>
          <div style={dividerStyle}></div>
          <p style={paragraphStyle}>
            In 2025, we took a bold step forward by launching our proprietary blockchain-based anti-counterfeit system. 
            This technology represents our commitment to innovation and protecting both our brand and our customers.
          </p>
          <div style={timelineContainerStyle}>
            <div style={timelineItemStyle}>
              <div style={{...timelineMarkerStyle, backgroundColor: '#8e2de2'}}></div>
              <div style={timelineContentStyle}>
                <h4 style={timelineHeadingStyle}>January 2025</h4>
                <p style={timelineTextStyle}>Development of our blockchain verification system begins</p>
              </div>
            </div>
            <div style={timelineItemStyle}>
              <div style={{...timelineMarkerStyle, backgroundColor: '#752de2'}}></div>
              <div style={timelineContentStyle}>
                <h4 style={timelineHeadingStyle}>February 2025</h4>
                <p style={timelineTextStyle}>Smart contract creation and testing on Ethereum testnet</p>
              </div>
            </div>
            <div style={timelineItemStyle}>
              <div style={{...timelineMarkerStyle, backgroundColor: '#612de2'}}></div>
              <div style={timelineContentStyle}>
                <h4 style={timelineHeadingStyle}>March 2025</h4>
                <p style={timelineTextStyle}>QR code integration and mobile verification app development</p>
              </div>
            </div>
            <div style={timelineItemStyle}>
              <div style={{...timelineMarkerStyle, backgroundColor: '#4a00e0'}}></div>
              <div style={timelineContentStyle}>
                <h4 style={timelineHeadingStyle}>April 2025</h4>
                <p style={timelineTextStyle}>Official launch of our blockchain anti-counterfeit system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={ctaSectionStyle}>
        <h2 style={ctaTitleStyle}>Experience the 4710 Difference</h2>
        <p style={ctaTextStyle}>
          Join us at the beginning of our blockchain journey and be part of fashion's future with authentic, verified clothing.
        </p>
        <button 
          onClick={handleShopNowClick} 
          style={ctaButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(74, 0, 224, 0.3)';
            e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(142, 45, 226, 0.7), 0 0 30px rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(74, 0, 224, 0.1)';
            e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.7)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(142, 45, 226, 0.4)';
          }}
        >
          <span>Visit our Facebook page</span>
          <div style={buttonGlowStyle}></div>
        </button>
      </div>
      
      <footer style={footerStyle}>
        <div style={footerIconContainerStyle}>
          <FaBitcoin style={footerIconStyle} />
          <FaEthereum style={footerIconStyle} />
          <SiSolidity style={footerIconStyle} />
          <MdVerified style={footerIconStyle} />
        </div>
        <p style={copyrightStyle}>© 2025 4710. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Styles
const containerStyle = {
  fontFamily: 'Roboto, sans-serif',
  background: 'radial-gradient(circle, #1a0938, #000000)',
  color: '#fff',
  minHeight: '100vh',
  overflow: 'auto',
};

const heroSectionStyle = {
  textAlign: 'center',
  padding: '4rem 2rem 2rem',
  position: 'relative',
};

const logoContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '1rem',
};

const mainTitleStyle = {
  fontSize: '3.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textShadow: '0 0 15px rgba(142, 45, 226, 0.7)',
  background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const subtitleStyle = {
  fontSize: '1.5rem',
  marginBottom: '2rem',
  opacity: 0.9,
  maxWidth: '800px',
  margin: '0 auto',
};

const contentSectionStyle = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const missionSectionStyle = {
  marginBottom: '4rem',
  textAlign: 'center',
};

const sectionStyle = {
  marginBottom: '4rem',
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  textAlign: 'center',
  color: '#fff',
};

const dividerStyle = {
  height: '4px',
  width: '80px',
  background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  margin: '0 auto 2rem',
  borderRadius: '2px',
};

const paragraphStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.8',
  margin: '0 auto 1.5rem',
  maxWidth: '900px',
};

const twoColumnSectionStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: '4rem',
};

const columnStyle = {
  flex: '1',
  minWidth: '300px',
  padding: '1.5rem',
  margin: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '15px',
  boxShadow: '0 0 20px rgba(142, 45, 226, 0.2)',
  border: '1px solid rgba(142, 45, 226, 0.2)',
};

const iconContainerStyle = {
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const iconStyle = {
  fontSize: '3rem',
  marginRight: '0.5rem',
};

const featureTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textAlign: 'center',
  color: '#fff',
};

const featureTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.6',
};

const techStepsSectionStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  marginTop: '2rem',
};

const techStepStyle = {
  flex: '1',
  minWidth: '220px',
  maxWidth: '300px',
  margin: '1rem',
  padding: '1.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '15px',
  boxShadow: '0 0 20px rgba(142, 45, 226, 0.2)',
  border: '1px solid rgba(142, 45, 226, 0.2)',
  textAlign: 'center',
};

const stepNumberStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  color: '#fff',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: '0 auto 1rem',
};

const stepTitleStyle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  marginBottom: '0.8rem',
  color: '#fff',
};

const stepTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.5',
};

const foundersSection = {
  marginBottom: '4rem',
  textAlign: 'center',
};

const innovationSectionStyle = {
  marginBottom: '4rem',
  textAlign: 'center',
  padding: '2rem 1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '15px',
  boxShadow: '0 0 30px rgba(142, 45, 226, 0.15)',
};

const timelineContainerStyle = {
  maxWidth: '800px',
  margin: '2rem auto 0',
  position: 'relative',
  padding: '1rem 0',
};

const timelineItemStyle = {
  display: 'flex',
  marginBottom: '2rem',
  position: 'relative',
};

const timelineMarkerStyle = {
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  marginRight: '1.5rem',
  marginTop: '0.3rem',
  boxShadow: '0 0 10px rgba(142, 45, 226, 0.5)',
};

const timelineContentStyle = {
  flex: '1',
  textAlign: 'left',
  paddingLeft: '0.5rem',
};

const timelineHeadingStyle = {
  fontSize: '1.3rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#fff',
};

const timelineTextStyle = {
  fontSize: '1rem',
  lineHeight: '1.5',
  opacity: 0.9,
};

const ctaSectionStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  background: 'linear-gradient(rgba(26, 9, 56, 0.8), rgba(0, 0, 0, 0.8))',
  marginTop: '3rem',
};

const ctaTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#fff',
};

const ctaTextStyle = {
  fontSize: '1.2rem',
  marginBottom: '2rem',
  maxWidth: '700px',
  margin: '0 auto 2rem',
};

const ctaButtonStyle = {
  display: 'inline-flex',
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

const footerStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  padding: '2rem',
  textAlign: 'center',
};

const footerIconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '1rem',
};

const footerIconStyle = {
  fontSize: '2rem',
  margin: '0 0.8rem',
  color: 'rgba(255, 255, 255, 0.7)',
};

const copyrightStyle = {
  marginTop: '1rem',
  fontSize: '0.9rem',
  opacity: 0.7,
};

export default AboutUs;