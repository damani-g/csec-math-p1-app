import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ScoreCharts from "./ScoreCharts";

const SECTION_LABELS = {
  1: "Number Theory & Computation",
  2: "Consumer Arithmetic",
  3: "Sets",
  4: "Measurement",
  5: "Statistics",
  6: "Algebra",
  7: "Relations, Functions & Graphs",
  8: "Geometry & Trigonometry",
  9: "Vectors & Matrices"
};

export default function Progress() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchScores = async () => {
      const ref = collection(db, "users", user.uid, "scores");
      const q = query(ref, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScores(results);
      setLoading(false);
    };

    fetchScores();
  }, [user]);

  if (!user) return <p>Please sign in to view your progress.</p>;
  if (loading) return <p>Loading scores...</p>;
  if (scores.length === 0) return <p>No quiz scores recorded yet.</p>;

  return (
    <div className="progress-container">
      <h2>My Progress</h2>
      <ul>
        {scores.map(score => (
          <li key={score.id} className="score-entry">
            <p>
            <strong>{score.mode.toUpperCase()}</strong> | 
            {(Object.keys(score.breakdown).length === 1)
                ? `Section ${Object.keys(score.breakdown)[0]}`
                : "Full Exam"} | 
            Score: {score.score} / {score.total} ({Math.round((score.score / score.total) * 100)}%)
            </p>
            <small>{new Date(score.timestamp?.seconds * 1000).toLocaleString()}</small>
            {score.breakdown && (
              <ul>
                {Object.entries(score.breakdown).map(([sec, val]) => (
                  <li key={sec}>
                    {SECTION_LABELS[sec]}: {val.correct}/{val.total} ({Math.round((val.correct / val.total) * 100)}%)
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <ScoreCharts scores={scores} />
    </div>
  );
}
