// firebaseUtils.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase"; // adjust as needed
import { isSameDay } from "date-fns";

export async function checkIfUserHasAccess(uid, feature) {
  try {
    // Step 1: Get user info to check Pro status
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const isPro = userSnap.exists() && userSnap.data().isPro;

    if (isPro) {
      return true; // ✅ Pro user has full access
    }

    // Step 2: Logic for free users
    if (feature === "mock") {
      const usageRef = doc(db, "users", uid, "usage", "mock");
      const usageSnap = await getDoc(usageRef);

      const now = new Date();

      if (!usageSnap.exists()) {
        // First time use — create record and allow
        await setDoc(usageRef, { lastUsed: serverTimestamp() });
        return true;
      }

      const lastUsed = usageSnap.data().lastUsed?.toDate();
      if (!lastUsed || !isSameDay(now, lastUsed)) {
        // New day — update timestamp and allow
        await setDoc(usageRef, { lastUsed: serverTimestamp() });
        return true;
      }

      // Already used today
      return false;
    }

    // Other features are Pro-only
    return false;

  } catch (err) {
    console.error("Error checking user access:", err);
    return false;
  }
}

// Utility to check Pro access or daily usage limit
export async function checkAccessAndProceed(uid, feature, navigate) {
  try {
    const allowed = await checkIfUserHasAccess(uid, feature); // however you track limits
    if (allowed) {
      // ✅ Navigate to the correct page
      if (feature === "mock") navigate("/mock");
      else if (feature === "custom") navigate("/custom");
      else if (feature === "practice") navigate("/practice");
      else if (feature === "progress") navigate("/progress");
    } else {
      alert("This feature is limited to Pro users or you've hit today's usage limit.");
      if (user) navigate("/account");
      else navigate("/login");
    }
  } catch (err) {
    console.error("Access check failed:", err);
    alert("Something went wrong while checking access.");
  }
}

