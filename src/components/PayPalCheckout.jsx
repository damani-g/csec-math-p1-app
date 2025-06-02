import { useEffect, useRef } from 'react';
import { doc, updateDoc, addDoc, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

const PRICE = "14.00";

export default function PayPalCheckout() {
  const paypalButtonRef = useRef();
  const { user } = useAuth();

  const processPayment = async (orderData) => {
    try {
      // Log the transaction first
      const transactionRef = await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        userEmail: user.email,
        amount: PRICE,
        currency: "USD",
        paypalOrderId: orderData.orderID,
        status: "completed",
        timestamp: serverTimestamp()
      });

      // Create or update user document
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        isPro: true,
        purchaseDate: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        // Preserve any existing fields if document exists
      }, { merge: true });

      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      return false;
    }
  };

  useEffect(() => {
    if (!window.paypal || !user) return;

    // Clean up any existing buttons
    if (paypalButtonRef.current) {
      paypalButtonRef.current.innerHTML = '';
    }

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        shape: 'rect',
        color: 'gold',
        height: 45,
        label: 'paypal'
      },
      createOrder: (data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            description: "CSEC Math Pro Access",
            amount: {
              currency_code: "USD",
              value: PRICE
            }
          }],
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          }
        }).catch(err => {
          console.error('Order creation error:', err);
          if (err.message.includes('403')) {
            alert('There was an error connecting to PayPal. Please try again later or contact support.');
          } else {
            alert('There was an error creating your order. Please try again.');
          }
          throw err;
        });
      },
      onApprove: async (data, actions) => {
        try {
          // Show loading state
          paypalButtonRef.current.style.opacity = '0.5';
          
          // Capture the order
          const order = await actions.order.capture();
          
          // Process the payment
          const success = await processPayment(data);
          
          if (success) {
            alert("Thank you for your purchase! Your Pro access is now active.");
            window.location.reload();
          } else {
            alert("There was an error activating your Pro access. Please contact support.");
          }
        } catch (error) {
          console.error("PayPal payment error:", error);
          alert("There was an error processing your payment. Please try again or contact support.");
        } finally {
          // Reset loading state
          if (paypalButtonRef.current) {
            paypalButtonRef.current.style.opacity = '1';
          }
        }
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        // Check for specific error types
        if (err.message && err.message.includes('403')) {
          alert('There was an error connecting to PayPal. Please ensure you have a valid PayPal account and try again.');
        } else {
          alert("There was an error setting up the payment. Please try again later or contact support.");
        }
      },
      onCancel: () => {
        console.log("Payment cancelled by user");
      }
    }).render(paypalButtonRef.current)
      .catch(err => {
        console.error("PayPal render error:", err);
        if (paypalButtonRef.current) {
          paypalButtonRef.current.innerHTML = 'Could not load PayPal payment system. Please refresh the page or try again later.';
        }
      });

  }, [user]);

  return (
    <div className="paypal-checkout">
      <div ref={paypalButtonRef} className="paypal-button-container" style={{
        backgroundColor: 'var(--payment-option-bg)',
        padding: '1rem',
        borderRadius: '8px',
        maxWidth: '350px',
        margin: '0 auto'
      }}></div>
    </div>
  );
} 