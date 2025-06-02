import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PayPalCheckout from "../components/PayPalCheckout";

export default function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Add PayPal script when component mounts
  useEffect(() => {
    const loadPayPalScript = () => {
      // Remove any existing PayPal script
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?' + new URLSearchParams({
        'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
        'currency': 'USD',
        'intent': 'capture',
        'disable-funding': 'credit,card,venmo',
        // Enable buyer country - this can help with authorization
        'buyer-country': 'TT',
        // Enable debug mode in development
        ...(import.meta.env.DEV ? { 'debug': 'true' } : {})
      });
      script.async = true;
      
      script.onload = () => {
        setPaypalLoaded(true);
      };

      script.onerror = (error) => {
        console.error('PayPal script failed to load:', error);
        setPaypalLoaded(false);
      };

      document.head.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      const script = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleContact = () => {
    navigate("/contact");
  };

  const copyBankDetails = () => {
    const bankDetails = `Bank: Republic Bank
Account Name: Damani Garcia
Account Number: 460055281801
Reference: ${user?.email || 'Your Email'}`;
    
    navigator.clipboard.writeText(bankDetails)
      .then(() => alert("Bank details copied to clipboard!"))
      .catch(() => alert("Couldn't copy to clipboard. Please copy manually."));
  };

  return (
    <div className="content">
      <div className="membership-page">
        <h2>Upgrade to Pro</h2>
        
        {/* Pro Benefits Section */}
        <div className="pro-benefits">
          <h3>Transform Your CSEC Math Preparation</h3>
          <p className="lead">Get unlimited access to premium features designed for exam success</p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h4>✓ Unlimited Mock Exams</h4>
              <p>Practice with real exam-style questions as much as you need</p>
            </div>
            <div className="benefit-card">
              <h4>✓ Custom Practice Mode</h4>
              <p>Focus on specific topics you need to improve</p>
            </div>
            <div className="benefit-card">
              <h4>✓ Progress Tracking</h4>
              <p>Monitor your improvement with detailed analytics</p>
            </div>
            <div className="benefit-card">
              <h4>✓ Priority Support</h4>
              <p>Get help when you need it most</p>
            </div>
          </div>

          <div className="price-tag">
            <h3>$100 TTD or $14 USD</h3>
            <p>One-time payment for full access</p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="payment-section">
          {user?.isPro ? (
            <div className="pro-status">
              <h3>🌟 Pro Member</h3>
              <p>Thank you for supporting us! You have full access to all features.</p>
            </div>
          ) : user ? (
            <>
              <h3>Choose Your Payment Method</h3>
              <div className="payment-options">
                <div className="payment-option online">
                  <h4>Pay Online with PayPal</h4>
                  <p>Instant activation • Secure payment • Credit/Debit cards accepted</p>
                  {paypalLoaded ? (
                    <PayPalCheckout />
                  ) : (
                    <div className="loading-spinner">Loading payment options...</div>
                  )}
                </div>

                <div className="payment-divider">
                  <span>OR</span>
                </div>

                <div className="payment-option offline">
                  <h4>Bank Transfer</h4>
                  <p>Local payment option • Same day activation upon receipt of payment</p>
                  
                  <div className="payment-instructions">
                    <h5>How to Pay:</h5>
                    <ol>
                      <li>Make a payment of $100 TTD to the bank account below</li>
                      <li>Use your email address ({user.email}) as the payment reference</li>
                      <li>Keep your receipt for verification</li>
                    </ol>
                  </div>

                  <button 
                    className="show-bank-details-btn"
                    onClick={() => setShowBankDetails(!showBankDetails)}
                  >
                    {showBankDetails ? 'Hide Bank Details' : 'Show Bank Details'}
                  </button>

                  {showBankDetails && (
                    <div className="bank-details">
                      <div className="bank-info">
                        <p><strong>Bank:</strong> Republic Bank</p>
                        <p><strong>Account Name:</strong> Damani Garcia</p>
                        <p><strong>Account Number:</strong> 460055281801</p>
                        <p><strong>Reference:</strong> {user.email}</p>
                      </div>
                      <button onClick={copyBankDetails} className="copy-details-btn">
                        Copy Details
                      </button>
                      <div className="instructions">
                        <h5>After Payment:</h5>
                        <ol>
                          <li>Save your payment receipt</li>
                          <li>Contact us via <a href="mailto:csecmathapp@gmail.com" className="link-button">email</a> or <button onClick={handleContact} className="link-button">Contact Form</button></li>
                          <li>Include your email and payment proof</li>
                          <li>We'll activate your account within 2-4 hours (usually much faster, but may take longer for overnight payments)</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="login-prompt">
              <p>Please <button onClick={() => navigate("/login")} className="link-button">sign in</button> to view upgrade options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
