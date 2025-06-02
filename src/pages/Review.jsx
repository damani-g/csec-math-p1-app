import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logQuizSubmitted } from "../ga";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

export default function Review() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, userAnswers } = location.state || {};
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [showReviewList, setShowReviewList] = useState(true);

  if (!questions || !userAnswers) {
    return (
      <div className="content">
        <div className="review-page">
          <div className="error-state card">
            <svg className="icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3>No Review Data Available</h3>
            <p>There was an error loading the quiz review data.</p>
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sectionScores = {};
  let totalCorrect = 0;

  questions.forEach((q) => {
    const isCorrect = userAnswers[q.id] === q.answer;
    if (!sectionScores[q.section]) {
      sectionScores[q.section] = { correct: 0, total: 0 };
    }
    sectionScores[q.section].total++;
    if (isCorrect) {
      sectionScores[q.section].correct++;
      totalCorrect++;
    }
  });

  useEffect(() => {
    const quizMode = location.state?.mode || "unknown";
    const quizSection = location.state?.section || null;
    logQuizSubmitted(quizMode, totalCorrect, quizSection);

    if (user) {
      const breakdown = {};
      Object.entries(sectionScores).forEach(([section, { correct, total }]) => {
        breakdown[section] = { correct, total };
      });

      const scoreRef = collection(db, "users", user.uid, "scores");
      addDoc(scoreRef, {
        mode: quizMode,
        section: quizSection,
        score: totalCorrect,
        total: questions.length,
        breakdown,
        timestamp: serverTimestamp()
      });
    }
  }, []);

  const filteredQuestions = activeSection
    ? questions.filter(q => q.section === parseInt(activeSection))
    : [];

  const scorePercentage = Math.round((totalCorrect / questions.length) * 100);
  const scoreGrade = 
    scorePercentage >= 90 ? 'excellent' :
    scorePercentage >= 75 ? 'good' :
    scorePercentage >= 60 ? 'fair' : 'needs-improvement';

  return (
    <div className="content">
      <div className="review-page">
        <div className="review-header">
          <h2>Quiz Review</h2>
          <p className="lead">Review your answers and see detailed breakdowns by section</p>
        </div>

        <div className="review-content">
          <div className="score-overview card">
            <div className="total-score">
              <div className={`score-circle ${scoreGrade}`}>
                <span className="percentage">{scorePercentage}%</span>
                <span className="fraction">{totalCorrect}/{questions.length}</span>
              </div>
              <h3>Total Score</h3>
            </div>

            <div className="section-breakdown">
              <h4>Section Breakdown</h4>
              <div className="section-grid">
                {Object.entries(sectionScores).map(([section, { correct, total }]) => {
                  const sectionPercentage = Math.round((correct / total) * 100);
                  return (
                    <button
                      key={section}
                      onClick={() => setActiveSection(section)}
                      className={`section-card ${activeSection === section ? 'active' : ''}`}
                    >
                      <div className="section-header">
                        <span className="section-name">{SECTION_LABELS[section]}</span>
                        <span className="section-score">{sectionPercentage}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{width: `${sectionPercentage}%`}}
                        ></div>
                      </div>
                      <div className="section-details">
                        <span>{correct}/{total} correct</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {activeSection && (
            <div className="section-review card">
              <div className="review-header">
                <h3>{SECTION_LABELS[activeSection]}</h3>
                <button 
                  onClick={() => setShowReviewList(!showReviewList)}
                  className="btn btn-secondary"
                >
                  {showReviewList ? 'Hide' : 'Show'} Questions
                </button>
              </div>

              {showReviewList && (
                <div className="questions-list">
                  {filteredQuestions.map((q) => {
                    const userAnswer = userAnswers[q.id];
                    const isCorrect = userAnswer === q.answer;
                    const questionNumber = questions.indexOf(q) + 1;

                    return (
                      <div key={q.id} className={`question-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="question-header">
                          <span className="question-number">Question {questionNumber}</span>
                          <span className={`status-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>

                        <div className="question-content">
                          {q.stimulus_id && (
                            <img
                              src={`/questions/${q.stimulus_id}.png`}
                              alt={`Stimulus for question ${questionNumber}`}
                              className="stimulus-image"
                            />
                          )}
                          <img
                            src={`/${q.image}`}
                            alt={`Question ${questionNumber}`}
                            className="question-image"
                          />
                        </div>

                        <div className="answer-comparison">
                          <div className="answer-item">
                            <span className="answer-label">Your Answer:</span>
                            <span className={`answer-value ${!userAnswer ? 'no-answer' : ''}`}>
                              {userAnswer || 'Not answered'}
                            </span>
                          </div>
                          <div className="answer-item">
                            <span className="answer-label">Correct Answer:</span>
                            <span className="answer-value correct">{q.answer}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="review-actions">
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
