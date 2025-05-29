import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <Link to="/about">About</Link> |{" "}
      <Link to="/privacy">Privacy Policy</Link> |{" "}
      <Link to="/disclaimer">Disclaimer</Link> |{" "}
      <Link to="/contact">Contact Us</Link> |{" "}
      <Link to="/membership">Membership</Link> 
    </footer>
  );
}