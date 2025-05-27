import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <h1>CSEC Math Paper 1 Study Tool</h1>
      <p>Select a mode to begin:</p>

      <div className="mode-buttons">
        <Link to="/mock" className="mode-button">Mock Exam Mode</Link>
        <Link to="/custom" className="mode-button">Custom Exam Mode</Link>
        <Link to="/practice" className="mode-button">Practice Mode</Link>
      </div>
    </div>
  );
}
