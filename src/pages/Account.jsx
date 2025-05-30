import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Account() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) {
    return <div>You must be signed in to view this page.</div>;
  }

  return (
    <div className="content">
      <div className="account-container">
        <h2>My Account</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>UID:</strong> {user.uid}</p>
        <p><strong>Account Type:</strong> {user.isPro ? "Pro" : "Free"}</p>
        <button onClick={handleLogout}>Log Out</button>
        <div>
          <button><Link to="/progress">My Progress</Link></button>
        </div>
      </div>
    </div>
  );
}
