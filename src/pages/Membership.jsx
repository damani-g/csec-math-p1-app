import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="content">
      <h2>Upgrade to Pro</h2>
      <p>Unlock the full power of the app with a Pro membership:</p>

      <ul className="pro-features">
        <li>✔ Unlimited Mock Exams</li>
        <li>✔ Full access to Custom & Practice Modes</li>
        <li>✔ Detailed Progress Tracking with Charts</li>
        <li>✔ Early Access to New Features</li>
      </ul>

      <div className="membership-status">
        {user?.isPro ? (
          <p><strong>Status:</strong> You are already a <span style={{ color: "green" }}>Pro user</span>. Thank you for supporting us!</p>
        ) : user ? (
          <>
            <p><strong>Status:</strong> Free tier</p>
            <h3>Upgrade Options</h3>
            <button disabled style={{ marginBottom: "0.5rem" }}>
              Pay Online (Coming Soon)
            </button>
            <p>Prefer offline payment?</p>
            <p>Send a screenshot or photo of your payment to the <a href="/contact">contact page</a>.</p>

            <ul>
              <li><strong>Bank:</strong> xxxxx</li>
              <li><strong>Account Name:</strong> xxxxx</li>
              <li><strong>Account Number:</strong> xxxxx</li>
              <li><strong>Transfer Note:</strong> Use your email address</li>
            </ul>
          </>
        ) : (
          <>
            <p>Please <button onClick={() => navigate("/login")}>sign in</button> to view upgrade options.</p>
          </>
        )}
      </div>
    </div>
  );
}
