import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { checkIfUserHasAccess} from "../firebaseUtils";


export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

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
