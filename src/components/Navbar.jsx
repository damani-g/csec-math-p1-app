import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Navbar.css"; // optional, for custom styling

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar"> 
      <div className="nav-title">
        <Link to="/">Home</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname.startsWith("/mock") ? "active" : ""}>
          <Link to="/mock">Mock</Link>
        </li>
        <li className={location.pathname.startsWith("/custom") ? "active" : ""}>
          <Link to="/custom">Custom</Link>
        </li>
        <li className={location.pathname.startsWith("/practice") ? "active" : ""}>
          <Link to="/practice">Practice</Link>
        </li>
        { user ? (
          <ul>
            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
            <li>
              <Link to="/account">My Account</Link>
            </li>
          </ul>
          ) : (
          <li>
            <Link to="/login">Sign In</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}