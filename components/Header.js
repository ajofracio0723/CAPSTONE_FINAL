import React, { useState } from 'react';
import { FaHome, FaProductHunt, FaQrcode } from 'react-icons/fa'; // Importing icons

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      style={{
        fontFamily: 'Lora, sans-serif',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Sidebar */}
      <nav
        className="sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isMenuOpen ? '300px' : '60px', // Wider sidebar when expanded
          height: '100%',
          background: 'rgba(0, 0, 0, 0.9)',
          transition: 'width 0.4s ease',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMenuOpen ? 'flex-start' : 'center', // Align to left when expanded
          overflow: 'hidden',
        }}
        onMouseEnter={() => setIsMenuOpen(true)} // Expand when hovered
        onMouseLeave={() => setIsMenuOpen(false)} // Collapse when not hovered
      >
        <ul
          className="menu-nav"
          style={{
            listStyleType: 'none',
            padding: 0,
            marginTop: '50px',
            width: '100%',
          }}
        >
          <li className="menu-nav-item" style={{ marginBottom: '20px' }}>
            <a
              href="/Home2"
              className="menu-nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                textDecoration: 'none',
                fontSize: isMenuOpen ? '18px' : '14px', // Adjust font size
                fontWeight: 'bold',
                padding: '10px 20px',
                whiteSpace: 'nowrap',
                width: '100%', // Full width clickable
              }}
            >
              <FaHome size={isMenuOpen ? 32 : 28} style={{ marginRight: isMenuOpen ? '15px' : '0' }} /> {/* Home Icon - Larger */}
              {isMenuOpen && <span>Home</span>} {/* Only shows text when expanded */}
            </a>
          </li>
          <li className="menu-nav-item" style={{ marginBottom: '20px' }}>
            <a
              href="/add-product"
              className="menu-nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                textDecoration: 'none',
                fontSize: isMenuOpen ? '18px' : '14px', // Adjust font size
                fontWeight: 'bold',
                padding: '10px 20px',
                whiteSpace: 'nowrap',
                width: '100%', // Full width clickable
              }}
            >
              <FaProductHunt size={isMenuOpen ? 32 : 28} style={{ marginRight: isMenuOpen ? '15px' : '0' }} /> {/* Product Icon - Larger */}
              {isMenuOpen && <span>Manufacturer/ Add Product</span>}
            </a>
          </li>
          <li className="menu-nav-item" style={{ marginBottom: '20px' }}>
            <a
              href="/qrscanner"
              className="menu-nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                textDecoration: 'none',
                fontSize: isMenuOpen ? '18px' : '14px', // Adjust font size
                fontWeight: 'bold',
                padding: '10px 20px',
                whiteSpace: 'nowrap',
                width: '100%', // Full width clickable
              }}
            >
              <FaQrcode size={isMenuOpen ? 32 : 28} style={{ marginRight: isMenuOpen ? '15px' : '0' }} /> {/* QR Code Icon - Larger */}
              {isMenuOpen && <span>Consumer/ Scan QR</span>}
            </a>
          </li>
        </ul>
      </nav>

      <style>
        {`
          .menu-nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          @media (max-width: 768px) {
            .sidebar {
              width: 60px; /* Fixed small size on smaller screens */
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
