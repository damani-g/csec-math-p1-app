import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return (
      <div className="content">
        <div className="account-page">
          <div className="card text-center">
            <h2>Not Signed In</h2>
            <p>You must be signed in to view this page.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="account-page">
        <div className="account-header">
          <h2>My Account</h2>
          <p className="lead">Manage your account settings and view your status</p>
        </div>

        <div className="account-container card">
          <div className="account-info">
            <div className="info-group">
              <h3>Account Details</h3>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account ID:</span>
                <span className="info-value">{user.uid}</span>
              </div>
            </div>

            <div className="info-group">
              <h3>Subscription Status</h3>
              <div className="subscription-status">
                <div className={`status-badge ${user.isPro ? 'pro' : 'free'}`}>
                  {user.isPro ? 'Pro Account' : 'Free Account'}
                </div>
                {!user.isPro && (
                  <p className="upgrade-prompt">
                    Upgrade to Pro to unlock all features and practice materials.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="account-actions">
            <Link to="/progress" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="icon">
                <path d="M1 8h3l2-6 4 12 2-6h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Progress
            </Link>
            
            {!user.isPro && (
              <Link to="/membership" className="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="icon">
                  <path d="M8 1l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upgrade to Pro
              </Link>
            )}

            <button onClick={handleLogout} className="btn btn-text">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="icon">
                <path d="M6 14H3a2 2 0 01-2-2V4a2 2 0 012-2h3M10 12l4-4-4-4M14 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
