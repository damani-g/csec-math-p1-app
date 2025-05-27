import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // optional, for custom styling

export default function Navbar() {
  const location = useLocation();

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
        <li>
          <Link to="/login">Sign In</Link>
        </li>
      </ul>
    </nav>
  );
}