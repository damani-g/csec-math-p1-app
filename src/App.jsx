import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import SelectPaper from "./pages/SelectPaper";
import Custom from "./pages/Custom";
import Review from "./pages/Review";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Account from "./pages/Account";
import Progress from "./pages/Progress";
import './App.css';
import { useEffect } from "react";
import { initGA, logPageView } from "./ga";

function App() {
  useEffect(() => {
    initGA();
    logPageView(); // initial page load
  }, []);

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.add(darkMode ? "dark" : "light");
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mock" element={<SelectPaper mode="mock" />} />
        <Route path="/practice" element={<SelectPaper mode="practice" />} />
        <Route path="/quiz/:paperId/:mode" element={<Quiz />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/review" element={<Review />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/account" element={<Account />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Router>
  );
}

export default App;