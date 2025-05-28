import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1 2.5h14v2H1v-2zm0 4.5h14v2H1v-2zm0 4.5h14v2H1v-2z"/>
        </svg>
      </button>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <div className="nav-title">
          <Link to="/">Home</Link>
        </div>
        <Link to="/mock">Mock Exam</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/custom">Custom</Link>
        {!user ? (
          <Link to="/login">Sign In</Link>
        ) : (
          <>
            <Link to="/account">My Account</Link>
            <button onClick={logout}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
} 

