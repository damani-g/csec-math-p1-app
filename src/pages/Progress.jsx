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

  if (!user) {
    return (
      <div className="content">
        <div className="progress-page">
          <div className="auth-required card">
            <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.83-3.4 9.36-7 10.46-3.6-1.1-7-5.63-7-10.46v-5.7l7-3.12z"/>
            </svg>
            <h3>Authentication Required</h3>
            <p>Please sign in to view your progress and quiz history.</p>
            <button onClick={() => window.location.href = '/login'} className="btn btn-primary">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="content">
        <div className="progress-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="content">
        <div className="progress-page">
          <div className="empty-state card">
            <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-2-2H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <h3>No Quiz History</h3>
            <p>Take your first quiz to start tracking your progress!</p>
            <button onClick={() => window.location.href = '/custom'} className="btn btn-primary">
              Start a Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="progress-page">
        <div className="progress-header">
          <h2>My Progress</h2>
          <p className="lead">Track your performance and improvement over time</p>
        </div>

        <div className="progress-content">
          <div className="score-history card">
            <div className="card-header">
              <h3>Quiz History</h3>
              <p>Your recent quiz attempts and section breakdowns</p>
            </div>
            
            <div className="score-list">
              {scores.map(score => (
                <div key={score.id} className="score-entry">
                  <div className="score-header">
                    <div className="score-type">
                      <span className="badge">{score.mode.toUpperCase()}</span>
                      <span className="divider">•</span>
                      <span>{(Object.keys(score.breakdown).length === 1)
                        ? `Section ${Object.keys(score.breakdown)[0]}`
                        : "Full Exam"}
                      </span>
                    </div>
                    <div className="score-result">
                      <span className="score-percentage">
                        {Math.round((score.score / score.total) * 100)}%
                      </span>
                      <span className="score-fraction">
                        ({score.score} / {score.total})
                      </span>
                    </div>
                  </div>

                  <div className="score-timestamp">
                    <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                    </svg>
                    {new Date(score.timestamp?.seconds * 1000).toLocaleString()}
                  </div>

                  {score.breakdown && (
                    <div className="section-breakdown">
                      {Object.entries(score.breakdown).map(([sec, val]) => (
                        <div key={sec} className="breakdown-item">
                          <div className="breakdown-label">{SECTION_LABELS[sec]}</div>
                          <div className="breakdown-score">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{width: `${Math.round((val.correct / val.total) * 100)}%`}}
                              ></div>
                            </div>
                            <span className="breakdown-percentage">
                              {val.correct}/{val.total} ({Math.round((val.correct / val.total) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section card">
            <div className="card-header">
              <h3>Performance Analytics</h3>
              <p>Visual breakdown of your quiz performance</p>
            </div>
            <ScoreCharts scores={scores} />
          </div>
        </div>
      </div>
    </div>
  );
}
