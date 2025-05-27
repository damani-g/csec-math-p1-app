import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { logQuizSubmitted } from "../ga";

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
  const [activeSection, setActiveSection] = useState(null);
  const [showReviewList, setShowReviewList] = useState(true);

  if (!questions || !userAnswers) {
    return <div>Error: No review data available.</div>;
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
    const quizSection = location.state?.section || "full";
    logQuizSubmitted(quizMode, totalCorrect, quizSection);
  }, []);

  const filteredQuestions = activeSection
    ? questions.filter(q => q.section === parseInt(activeSection))
    : [];

  return (
    <div className="review-container">
      <h2>Quiz Review</h2>
      <button onClick={() => navigate("/")}>Return to Home</button>

      <div className="score-summary">
        <h3>Total Score: {totalCorrect} / {questions.length}</h3>
        <h4>Section Breakdown</h4>
        <ul>
          {Object.entries(sectionScores).map(([section, { correct, total }]) => (
            <li key={section}>
              <button onClick={() => setActiveSection(section)}>
                {SECTION_LABELS[section]} – {correct}/{total} – {Math.round((correct / total) * 100)}%
              </button>
            </li>
          ))}
        </ul>
      </div>

      {activeSection && (
        <div className="review-list">
          <h3>{SECTION_LABELS[activeSection]}</h3>
          <button onClick={() => setShowReviewList(!showReviewList)}>
            {showReviewList ? "Hide" : "Show"} Questions for {SECTION_LABELS[activeSection]}
          </button>
          {showReviewList && filteredQuestions.map((q, index) => {
            const userAnswer = userAnswers[q.id];
            const isCorrect = userAnswer === q.answer;

            return (
              <div key={q.id} className={`review-item ${isCorrect ? "correct" : "incorrect"}`}>
                <h4>
                  Question {questions.indexOf(q) + 1} {isCorrect ? "✅" : "❌"}
                </h4>
                {q.stimulus_id && (
                  <img
                    src={`/questions/${q.stimulus_id}.png`}
                    alt={`Stimulus for ${q.id}`}
                    className="stimulus-image"
                  />
                )}
                <img
                  src={`/${q.image}`}
                  alt={`Question ${q.id}`}
                  className="question-image"
                />
                <p>Your answer: <strong>{userAnswer || "None selected"}</strong></p>
                <p>Correct answer: <strong>{q.answer}</strong></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
