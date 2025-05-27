import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectMode = (mode) => {
    if (!user) {
      alert("Please sign in to access study modes.");
      navigate("/login"); // or open modal
      return;
    }
    navigate(`/${mode}`);
  };

  return (
    <div>
      <h2>Select a Mode</h2>
      <button onClick={() => handleSelectMode("mock")}>Mock Exam Mode</button>
      <button onClick={() => handleSelectMode("custom")}>Custom Exam Mode</button>
      <button onClick={() => handleSelectMode("practice")}>Practice Mode</button>
    </div>
  );
}
