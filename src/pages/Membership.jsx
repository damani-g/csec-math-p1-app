import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  // Add PayPal script when component mounts
  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        // Remove any existing PayPal scripts
        const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=BAAV8ZY4_2rcm4T1UcTtbrGart6nsA2f9fUpuow22YQP89y4Uw3BhoVaNCF3SDoKYsr8iE-4wX84aPEaOA&components=hosted-buttons&currency=USD`;
        script.async = true;

        // Create a promise to wait for script load
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        });

        document.body.appendChild(script);
        await scriptLoadPromise;

        // Initialize the button with user data
        window.paypal?.Buttons?.({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: "25.00",
                  currency_code: "USD"
                },
                custom_id: user.uid, // Add user ID to payment data
                description: "CSEC Math Pro Subscription (1 Year)"
              }]
            });
          },
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
          }
        }).render('#js-sdk-container-ZLGJN4DR5SM52');

        setPaypalLoaded(true);
      } catch (error) {
        console.error('PayPal script loading error:', error);
        setPaypalError('Failed to load payment system. Please try again later.');
      }
    };

    if (user && !user.isPro) {
      loadPayPalScript();
    }

    return () => {
      const script = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [user]);

  const handleContact = () => {
    navigate("/contact");
  };

  const copyBankDetails = () => {
    const bankDetails = `Bank: Republic Bank
Account Name: CSEC Math Account
Account Number: 1234567890
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
                <h3>$25 USD</h3>
                <p>One-time payment for 1 year access</p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="payment-section">
              {user?.isPro ? (
                <div className="pro-status">
                  <h3>🌟 Pro Member</h3>
                  <p>Thank you for supporting us! Your subscription is active until {new Date(user.subscriptionEndDate?.toDate()).toLocaleDateString()}</p>
                </div>
              ) : user ? (
                <>
                  <h3>Choose Your Payment Method</h3>
                  <div className="payment-options">
                    <div className="payment-option online">
                      <h4>Pay Online with PayPal</h4>
                      <p>Instant activation • Secure payment • Credit/Debit cards accepted</p>
                      {paypalError ? (
                        <div className="payment-error">
                          <p>{paypalError}</p>
                          <button onClick={() => window.location.reload()} className="retry-button">
                            Retry Payment
                          </button>
                        </div>
                      ) : (
                        <div id="js-sdk-container-ZLGJN4DR5SM52">
                          {!paypalLoaded && <div className="loading">Loading payment options...</div>}
                        </div>
                      )}
                    </div>

                    <div className="payment-divider">
                      <span>OR</span>
                    </div>

                    <div className="payment-option offline">
                      <h4>Bank Transfer</h4>
                      <p>Local payment option • Manual activation within 24 hours</p>
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
                            <p><strong>Account Name:</strong> CSEC Math Account</p>
                            <p><strong>Account Number:</strong> 1234567890</p>
                            <p><strong>Reference:</strong> {user.email}</p>
                          </div>
                          <button onClick={copyBankDetails} className="copy-details-btn">
                            Copy Details
                          </button>
                          <div className="instructions">
                            <h5>After Payment:</h5>
                            <ol>
                              <li>Save your payment receipt</li>
                              <li>Contact us via WhatsApp or <button onClick={handleContact} className="link-button">Contact Form</button></li>
                              <li>Include your email and payment proof</li>
                              <li>We'll activate your account within 24 hours</li>
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
