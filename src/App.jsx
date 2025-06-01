import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import SelectPaper from "./pages/SelectPaper";
import Custom from "./pages/Custom";
import Review from "./pages/Review";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Account from "./pages/Account";
import Progress from "./pages/Progress";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import GettingStarted from "./pages/GettingStarted";
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
        <Route path="/about" element={<About />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/getting-started" element={<GettingStarted />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;