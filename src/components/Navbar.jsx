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

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleProtectedLink = (path) => {
    closeMenu();
    if (!user) {
      alert("Please sign in to access this feature.");
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav>
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
        <Link to="/" onClick={closeMenu}>Home</Link>
        <button onClick={() => handleProtectedLink("/mock")}>Mock Exam</button>
        <button onClick={() => handleProtectedLink("/practice")}>Practice</button>
        <button onClick={() => handleProtectedLink("/custom")}>Custom</button>
        {!user ? (
          <Link to="/login" onClick={closeMenu}>Sign In</Link>
        ) : (
          <>
            <Link to="/account" onClick={closeMenu}>My Account</Link>
            <button onClick={() => handleProtectedLink("/progress")}>Progress</button>
            <button onClick={() => { handleLogout(); closeMenu(); }}>Log Out</button>
          </>
        )}
      </div>
    </nav>
  );
}
