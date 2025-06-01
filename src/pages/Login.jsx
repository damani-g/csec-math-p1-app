import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userRef, {
          email: user.email,
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          isPro: false
        });
      }

      navigate("/");
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="content">
      <div className="login-container">
        <h2>Sign In</h2>
        <div className="google-login-btn">
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
        </div>
        

        <hr />

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
