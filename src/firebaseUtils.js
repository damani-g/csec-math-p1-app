// firebaseUtils.js
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Utility to check Pro access or daily usage limit
export async function checkAccessAndProceed(user, feature, navigate) {


  if (!user) {
    alert("Please sign in to access this feature.");
    navigate("/login");
    return;
  }

  const db = getFirestore();
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  const userData = snap.exists() ? snap.data() : {};

  const isPro = userData?.isPro;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (isPro) {
    navigate(`/${feature}`)
  } // Pro has access to everything

  if (feature === "mock") {
    const usage = userData?.usage || {};
    if (usage[today]?.mock) {
      alert("Free users can only take 1 mock exam per day. Upgrade to Pro for unlimited access.");
      navigate("/");
      return;
    }
  } else if (["custom", "practice", "progress"].includes(feature)) {
    alert("This feature is available to Pro users only.");
    navigate("/");
    return;
  }
}
