import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBKXq1fnHDqNHv-zsHqm-Fdi9H4wSBWH2I",
  authDomain: "https://csec-math-p1-app.vercel.app",
  projectId: "csec-math-app",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
