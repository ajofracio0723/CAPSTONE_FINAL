import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { CheckCircle, AlertCircle, Clock, Shield, Scan, Calendar, User, Activity } from "lucide-react";

const ProductStatus = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { query } = router;

  // Handle initial loading state while router query is populated
  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
    }
  }, [router.isReady]);

  if (loading) {
    return (
      <div className="container-fluid" style={containerStyle}>
        <Header />
        <div className="row justify-content-center" style={{ height: "100vh", alignItems: "center" }}>
          <div className="col-md-6 text-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine product status based on query parameters
  const isAuthentic = query.isAuthentic === "true";
  const isInvalid = query.invalid === "true";
  const isFirstScan = query.isFirstScan === "true";
  const totalScans = parseInt(query.totalScans || "1");

  // Parse product details
  const productDetails = {
    name: isAuthentic ? decodeURIComponent(query.name || "") : "",
    expirationTimestamp: isAuthentic ? parseInt(query.expirationTimestamp) : null,
    registeredDateTime: isAuthentic
      ? new Date(parseInt(query.registeredDateTime) * 1000).toLocaleString()
      : "",
    owner: isAuthentic ? decodeURIComponent(query.owner || "") : "",
    daysToExpire: isAuthentic ? parseInt(query.daysToExpire || "0") : 0,
  };

  // Get expiration status and color
  const getExpirationStatus = () => {
    if (!isAuthentic) return { text: "Unknown", color: "#ffbb33" };
    
    if (productDetails.daysToExpire <= 0) {
      return { text: "EXPIRATION", color: "#ff4444" };
    } else if (productDetails.daysToExpire <= 7) {
      return { text: `EXPIRES SOON (${productDetails.daysToExpire} days)`, color: "#ffbb33" };
    } else {
      return { text: `EXPIRES IN ${productDetails.daysToExpire} DAYS`, color: "#00C851" };
    }
  };

  const expirationStatus = getExpirationStatus();

  // Format expiration date
  const expirationDate = isAuthentic 
    ? new Date(productDetails.expirationTimestamp * 1000).toLocaleString() 
    : "";

  // Render appropriate status section
  const renderProductStatus = () => {
    if (isInvalid) {
      return (
        <div className="text-center" style={{ color: "#ffffff" }}>
          <AlertCircle size={80} className="mx-auto mb-4" style={{ color: "#ff4444" }} />
          <h2 style={{ color: "#ffffff", fontWeight: "bold" }}>Counterfeit Product</h2>
          <div className="mt-4 p-3" style={invalidProductStyle}>
            <p className="mb-3" style={{ fontSize: "1.2rem", color: "#ffffff" }}>
              {query.reason
                ? decodeURIComponent(query.reason)
                : "This product could not be verified in our blockchain registry."}
            </p>
            <p className="mb-0" style={{ color: "#ffffff" }}>This may indicate a counterfeit product.</p>
          </div>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => router.push('/qrscanner')}
            style={scanAgainButtonStyle}
          >
            <Scan size={18} style={{ marginRight: "8px" }} />
            Scan Another Product
          </button>
        </div>
      );
    }

    if (isAuthentic) {
      return (
        <div className="text-center">
          <div style={authenticBannerStyle}>
            <CheckCircle size={24} style={{ marginRight: "8px" }} />
            <span>AUTHENTIC PRODUCT</span>
          </div>
          
          <div className="product-header mb-4">
            <h2 style={{ color: "#ffffff", fontWeight: "bold", fontSize: "2rem" }}>
              {productDetails.name}
            </h2>
          </div>
          
          <div className="product-details" style={productDetailsStyle}>
            {isFirstScan && (
              <div className="mb-3 p-2 text-center" style={firstScanBadgeStyle}>
                <Shield size={16} style={{ marginRight: "5px" }} />
                First Activation
              </div>
            )}
            
            {!isFirstScan && totalScans > 1 && (
              <div className="mb-3 p-2 text-center" style={scanCountBadgeStyle}>
                <Activity size={16} style={{ marginRight: "5px" }} />
                Scanned {totalScans} times
              </div>
            )}
            
            <div className="detail-item d-flex align-items-center mb-3">
              <Calendar size={20} style={{ minWidth: "24px", color: "#ffffff", marginRight: "12px" }} />
              <div>
                <div className="detail-label" style={{ color: "#ffffff" }}>Registered Date</div>
                <div className="detail-value" style={{ color: "#ffffff" }}>{productDetails.registeredDateTime}</div>
              </div>
            </div>
            
            <div className="detail-item d-flex align-items-center mb-3">
              <User size={20} style={{ minWidth: "24px", color: "#ffffff", marginRight: "12px" }} />
              <div>
                <div className="detail-label" style={{ color: "#ffffff" }}>Registered Owner</div>
                <div className="detail-value" style={{ color: "#ffffff", wordBreak: "break-all" }}>{productDetails.owner}</div>
              </div>
            </div>
            
            <div className="expiration-section mt-4 p-3" style={{ ...expirationSectionStyle, backgroundColor: expirationStatus.color + "22", borderColor: expirationStatus.color }}>
              <Clock size={24} style={{ color: expirationStatus.color, marginRight: "12px" }} />
              <div>
                <div style={{ color: "#ffffff", fontWeight: "bold" }}>
                  {expirationStatus.text}
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9, color: "#ffffff" }}>
                  Expired in: {expirationDate}
                </div>
              </div>
            </div>
          </div>
          
          <button 
            className="btn btn-primary mt-4"
            onClick={() => router.push('/qrscanner')}
            style={scanAgainButtonStyle}
          >
            <Scan size={18} style={{ marginRight: "8px" }} />
            Scan Another Product
          </button>
        </div>
      );
    }

    return (
      <div className="text-center text-white">
        <AlertCircle size={64} className="mx-auto mb-4" />
        <h3>No Product Data</h3>
        <p>Unable to retrieve product information</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => router.push('/qrscanner')}
          style={scanAgainButtonStyle}
        >
          <Scan size={18} style={{ marginRight: "8px" }} />
          Try Again
        </button>
      </div>
    );
  };

  return (
    <div className="container-fluid" style={containerStyle}>
      <Header />
      <div
        className="row justify-content-center"
        style={{ minHeight: "100vh", alignItems: "center", padding: "15px" }}
      >
        <div className="col-12 col-md-8 col-lg-6" style={{ maxWidth: "550px" }}>
          <div className="card" style={cardStyle}>
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={authentithiefTitleStyle}>
                AUTHENTITHIEF
              </h2>

              {renderProductStatus()}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

// Enhanced styles
const containerStyle = {
  background: "radial-gradient(circle, #330066, #000000)",
  minHeight: "100vh",
  color: "#fff",
  paddingTop: "5vh",
  padding: "15px"
};

const cardStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "1.5rem",
  borderRadius: "15px",
  boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const authentithiefTitleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  textAlign: "center",
  textShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
  color: "#ffffff",
  letterSpacing: "2px"
};

const productDetailsStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "left",
  color: "#ffffff"
};

const expirationSectionStyle = {
  display: "flex",
  alignItems: "center",
  borderRadius: "10px",
  border: "1px solid"
};

const authenticBannerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#00C851",
  color: "#fff",
  padding: "8px",
  borderRadius: "50px",
  marginBottom: "20px",
  fontWeight: "bold",
  fontSize: "0.9rem"
};

const invalidProductStyle = {
  backgroundColor: "rgba(255, 68, 68, 0.1)",
  border: "1px solid rgba(255, 68, 68, 0.3)",
  borderRadius: "10px",
  color: "#ffffff"
};

const firstScanBadgeStyle = {
  backgroundColor: "rgba(0, 200, 81, 0.2)",
  color: "#ffffff",
  borderRadius: "50px",
  display: "inline-block",
  fontWeight: "500",
  fontSize: "0.9rem"
};

const scanCountBadgeStyle = {
  backgroundColor: "rgba(33, 150, 243, 0.2)",
  color: "#ffffff",
  borderRadius: "50px",
  display: "inline-block",
  fontWeight: "500",
  fontSize: "0.9rem"
};

const scanAgainButtonStyle = {
  backgroundColor: "#4CAF50",
  border: "none",
  padding: "12px 20px",
  fontSize: "1.1rem",
  fontWeight: "500",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center"
};

export default ProductStatus;