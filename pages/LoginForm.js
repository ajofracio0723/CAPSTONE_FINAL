import React, { useState } from 'react';
import { FaBitcoin, FaEthereum, FaCubes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const handleSignIn = () => {
    if (username && password) {
      setIsLoading(true); // Set loading state to true when login process starts
      // Simulate login process with setTimeout, replace with actual login process
      setTimeout(() => {
        setIsLoggedIn(true);
        setTimeout(() => {
          router.push('/Home2'); // Redirect to the home page with a delay
        }, 1000); // Delay for 1 second before redirecting
      }, 2000); // Simulating 2 seconds of login process
    } else {
      alert('Please fill in both username and password.');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    checkFormFilled();
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    checkFormFilled();
  };

  const checkFormFilled = () => {
    if (username.trim() && password.trim()) {
      setIsFormFilled(true);
    } else {
      setIsFormFilled(false);
    }
  };

  return (
    <div style={loginContainerStyle}>
      <div style={loginFormStyle}>
        <div style={iconContainerStyle}>
          <FaBitcoin style={iconStyle} />
          <FaEthereum style={iconStyle} />
          <FaCubes style={iconStyle} />
        </div>
        <h2 style={titleStyle}>Welcome to Authentithief</h2>
        <p style={subtitleStyle}>Secure your account with your credentials</p>
        <input
          type="text"
          placeholder="Enter your username"
          style={inputStyle}
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          style={inputStyle}
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button onClick={handleSignIn} style={{ ...buttonStyle, ...(isFormFilled ? {} : { opacity: 0.5, pointerEvents: 'none' }) }}>
          {isLoading ? (
            <RingLoader color={'#fff'} loading={true} css={override} size={32} />
          ) : (
            <span>Sign In</span>
          )}
        </button>
        {isLoggedIn && <p style={successMessageStyle}>Login successful!</p>}
        <p style={descriptionStyle}>
          Manage your account securely and access exclusive features.
        </p>
        <div style={additionalContentStyle}>
          <p style={additionalContentTextStyle}>
            Don't have an account? <a href="/signup" style={signupLinkStyle}>Sign up here</a>.
          </p>
          <p style={additionalContentTextStyle}>
            Forgot your password? <a href="/forgot-password" style={forgotPasswordLinkStyle}>Reset it here</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

const loginContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'radial-gradient(circle, #1a0938, #000000)',
  color: '#fff',
};

const loginFormStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  padding: '3rem',
  borderRadius: '10px',
  boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const iconContainerStyle = {
  marginBottom: '1rem',
};

const iconStyle = {
  fontSize: '2rem',
  marginRight: '0.5rem',
};

const titleStyle = {
  fontSize: '3rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
};

const subtitleStyle = {
  fontSize: '1.5rem',
  marginBottom: '2rem',
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

const successMessageStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginTop: '1rem',
  color: 'green',
};

const descriptionStyle = {
  fontSize: '1.2rem',
  textAlign: 'center',
  marginTop: '1rem',
  textShadow: '0 0 5px rgba(255, 255, 255, 0.3)',
};

const additionalContentStyle = {
  marginTop: '2rem',
  textAlign: 'center',
};

const additionalContentTextStyle = {
  fontSize: '1rem',
  marginBottom: '0.5rem',
};

const signupLinkStyle = {
  color: '#8e2de2',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '0.3rem',
};

const forgotPasswordLinkStyle = {
  color: '#4a00e0',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '0.3rem',
};

export default LoginForm;
