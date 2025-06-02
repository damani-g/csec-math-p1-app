// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { useAuth } from "../AuthContext";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen(prev => !prev);
//   const closeMenu = () => setIsOpen(false);

//   const handleLogout = async () => {
//     await signOut(auth);
//   };

//   return (
//     <nav className="navbar">
//       <button className="hamburger" onClick={toggleMenu}>
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="32"
//           height="32"
//           fill="currentColor"
//           viewBox="0 0 16 16"
//         >
//           <path d="M1 2.5h14v2H1v-2zm0 4.5h14v2H1v-2zm0 4.5h14v2H1v-2z"/>
//         </svg>
//       </button>

//       <div className={`nav-links ${isOpen ? 'open' : ''}`}>
//         <div className="nav-title">
//           <Link to="/" onClick={closeMenu}>Home</Link>
//         </div>
//         <Link to="/mock" onClick={closeMenu}>Mock Exam</Link>
//         <Link to="/practice" onClick={closeMenu}>Practice</Link>
//         <Link to="/custom" onClick={closeMenu}>Custom</Link>
//         {!user ? (
//           <Link to="/login" onClick={closeMenu}>Sign In</Link>
//         ) : (
//           <>
//             <Link to="/account" onClick={closeMenu}>My Account</Link>
//             <button onClick={logout}>Log Out</button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// } 

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { checkIfUserHasAccess } from "../firebaseUtils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const accountDropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAccountDropdownOpen(false);
  };

  const toggleMenu = () => setIsOpen(prev => !prev);
  const toggleAccountDropdown = () => setIsAccountDropdownOpen(prev => !prev);
  
  const closeMenu = () => {
    setIsOpen(false);
    setIsAccountDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProtectedLink = (path) => {
    closeMenu();
    if (!user) {
      alert("Please sign in to access this feature.");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleSelectMode = async (mode) => {
    if (!user) {
      alert("Please sign in to access study modes.");
      navigate("/login");
      return;
    }

    const hasAccess = await checkIfUserHasAccess(user.uid, mode);
    if (hasAccess) {
      navigate(`/${mode}`);
    } else {
      alert("This feature is available to Pro users only.");
      navigate("/account");
    }
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" onClick={closeMenu}>Home</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1 2.5h14v2H1v-2zm0 4.5h14v2H1v-2zm0 4.5h14v2H1v-2z"/>
        </svg>
      </button>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <div className="nav-section">
          <button onClick={() => handleSelectMode("mock")} className="nav-link">Mock Exam</button>
          <button onClick={() => handleSelectMode("practice")} className="nav-link">Practice</button>
          <button onClick={() => handleSelectMode("custom")} className="nav-link">Custom</button>
        </div>

        {!user ? (
          <Link to="/login" onClick={closeMenu} className="nav-link sign-in">Sign In</Link>
        ) : (
          <div className="account-dropdown" ref={accountDropdownRef}>
            <button 
              onClick={toggleAccountDropdown}
              className="account-dropdown-toggle"
              aria-expanded={isAccountDropdownOpen}
            >
              Account
              <svg 
                className={`dropdown-arrow ${isAccountDropdownOpen ? 'open' : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M3 6L8 11L13 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <div className={`account-dropdown-menu ${isAccountDropdownOpen ? 'open' : ''}`}>
              <Link to="/account" onClick={closeMenu} className="dropdown-item">Account Info</Link>
              <Link to="/progress" onClick={closeMenu} className="dropdown-item">Progress</Link>
              <Link to="/membership" onClick={closeMenu} className="dropdown-item">Membership</Link>
              <button onClick={handleLogout} className="dropdown-item">Log Out</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
