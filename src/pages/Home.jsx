import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { checkAccessAndProceed } from "../firebaseUtils";
import { useState } from "react";


export default function Home() {
  const navigate = useNavigate();

  const handleSelectMode = async (mode) => {
    checkAccessAndProceed(mode,navigate)
  };

  return (
    <div className="content">
      <div className="home-container">
        <h2>Select a Mode</h2>
        <div className="mode-buttons">
          <button className="mode-button" onClick={() => handleSelectMode("mock")}>Mock Exam Mode</button>
          <button className="mode-button" onClick={() => handleSelectMode("custom")}>Custom Exam Mode</button>
          <button className="mode-button" onClick={() => handleSelectMode("practice")}>Practice Mode</button>
        </div>
      </div>
    </div>
  );
}
