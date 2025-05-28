import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { logQuizStarted } from "../ga";

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

export default function Quiz() {
  const { paperId, mode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stimulusId, setStimulusId] = useState(null);
  const [showSection, setShowSection] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [perSectionScore, setPerSectionScore] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  const timerRef = useRef(null);

  const isMock = mode === "mock";
  const isPractice = mode === "practice";
  const isCustom = mode === "custom";

  useEffect(() => {
    if (hasInitialized) return;

    let loadedQuestions = [];
    const timeParam = new URLSearchParams(location.search).get("time");
    const minutes = timeParam ? parseInt(timeParam, 10) : 90;

    if (isCustom && location.state?.questions) {
      loadedQuestions = location.state.questions;
      setQuestions(loadedQuestions);
    } else {
      fetch(`/data/${paperId}.json`)
        .then((res) => res.json())
        .then((data) => {
          loadedQuestions = data.questions;
          setQuestions(loadedQuestions);
        });
    }

    setTimeLeft(minutes * 60);
    setCurrent(0);
    setStimulusId(loadedQuestions?.[0]?.stimulus_id || null);
    setShowAnswer(false);
    setHasInitialized(true);
    logQuizStarted(mode, location.state?.section);
  }, [hasInitialized, isCustom, paperId, location]);

  const question = questions[current];
  useEffect(() => {
    setStimulusId(question?.stimulus_id || null);
  }, [question]);

  useEffect(() => {
    if (!(isMock || (isCustom && questions.length === 60))) return;
    if (timeLeft <= 0 || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, questions]);

  const handleAnswer = (letter) => {
    setUserAnswers(prev => ({ ...prev, [question.id]: letter }));
  };

  // Old handleSubmit kept for doc purposes //
  // const handleSubmit = () => {
  //   clearInterval(timerRef.current);

  //   let correct = 0;
  //   const sectionScores = {};

  //   questions.forEach(q => {
  //     const isCorrect = userAnswers[q.id] === q.answer;
  //     if (isCorrect) correct++;

  //     if (!sectionScores[q.section]) {
  //       sectionScores[q.section] = { correct: 0, total: 0 };
  //     }
  //     sectionScores[q.section].total++;
  //     if (isCorrect) sectionScores[q.section].correct++;
  //   });

  //   setScore(correct);
  //   setPerSectionScore(sectionScores);
  // };

  const handleSubmit = () => {
    navigate("/review", {
      state: {
        questions,
        userAnswers,
        mode,
        section: location.state?.section || null
      }
    });
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setShowAnswer(false);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setShowAnswer(false);
    }
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (questions.length === 0) {
    return (
      <div>
        {isCustom
          ? "Error: No custom questions provided."
          : "Loading questions..."}
      </div>
    );
  }

  return (
    <div className="content">
      <div className="quiz-container">
        <h2>
          Question {current + 1} of {questions.length}
        </h2>

        {(isMock || (isCustom && questions.length === 60)) && (
          <div className="timer-score">
            <p>Time left: {formatTime(timeLeft)}</p>
          </div>
        )}

        <div className="question-select">
          <label htmlFor="questionDropdown">Jump to Question: </label>
          <select
            id="questionDropdown"
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
          >
            {questions.map((q, index) => (
              <option key={q.id} value={index}>
                Question {index + 1} {userAnswers[q.id] ? "✔" : ""}
              </option>
            ))}
          </select>
        </div>

        {(isPractice || isCustom) && (
          <div className="toggles">
            <label>
              <input
                type="checkbox"
                checked={showSection}
                onChange={() => setShowSection(!showSection)}
              />
              Show Section
            </label>
          </div>
        )}
        {isPractice && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={showAnswer}
                onChange={() => setShowAnswer(!showAnswer)}
              />
              Show Answer
            </label>
          </div>
        )}

        {stimulusId && (
          <img
            src={`/questions/${stimulusId}.png`}
            alt={`Stimulus for ${question.id}`}
            className="stimulus-image"
          />
        )}

        <img
          src={`/${question.image}`}
          alt={`Question ${question.id}`}
          className="question-image"
        />

        <div className="options">
          {"ABCD".split("").map(letter => {
            let btnClass = "";

            if (userAnswers[question.id] === letter) {
              btnClass = "selected";
              if ((isPractice || isCustom) && showAnswer) {
                btnClass = letter === question.answer ? "correct" : "incorrect";
              }
            }
            
            return (
              <button
                key={letter}
                className={btnClass}
                onClick={() => handleAnswer(letter)}
              >
                {letter}
              </button>
            );
          })}
        </div>
        <div className="selection-info">
          {userAnswers[question.id] && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>
              Selected Answer: {userAnswers[question.id]}
            </p>
          )}
          {!userAnswers[question.id] && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>
              No answer selected.
            </p>
          )}
        </div>

        {showSection && (isPractice || isCustom) && (
          <p className="section-label">
            Section {question.section}: {SECTION_LABELS[question.section]}
          </p>
        )}

        <div className="navigation">
          <button onClick={handleBack} disabled={current === 0}>
            Back
          </button>
          {!isMock && (
            <button onClick={() => setShowAnswer(!showAnswer)}>
              Toggle Answer
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={current === questions.length - 1}
          >
            Next
          </button>
        </div>

        {current === questions.length - 1 && (isMock || isCustom) && (
          <button onClick={handleSubmit}>Submit Quiz</button>
        )}

        {score !== null && (
          <div className="score">
            <h3>Quiz Complete!</h3>
            <p>Score: {score} / {questions.length}</p>
            <p>Percentage: {(score / questions.length * 100).toFixed(1)}%</p>
          </div>
        )}

        {score !== null && Object.keys(perSectionScore).length > 0 && (
          <div className="section-breakdown">
            <h4>Section Breakdown</h4>
            <ul>
              {Object.entries(perSectionScore).map(([section, { correct, total }]) => (
                <li key={section}>
                  {SECTION_LABELS[section]} – {correct} / {total} – {Math.round((correct / total) * 100)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        {showAnswer && !isMock && <p className="answer">Answer: {question.answer}</p>}
      </div>
    </div>
  );
}
