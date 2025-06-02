import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Custom() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [customTime, setCustomTime] = useState(90);
  const [questionCount, setQuestionCount] = useState(10);
  const navigate = useNavigate();

  const sectionCounts = {
    1: 6, 2: 8, 3: 6, 4: 8, 5: 6,
    6: 6, 7: 8, 8: 8, 9: 4,
  };

  useEffect(() => {
    const filenames = ["june2018.json", "jan2019.json"];
    Promise.all(
      filenames.map((file) =>
        fetch(`/data/${file}`)
          .then((res) => (res.ok ? res.json() : { questions: [] }))
          .catch(() => ({ questions: [] }))
      )
    )
      .then((dataArrays) => {
        const merged = dataArrays.flatMap((d) => d.questions || []);
        setAllQuestions(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load questions.");
        setLoading(false);
      });
  }, []);

  const startSectionPractice = () => {
    const filtered = allQuestions.filter(q => q.section === selectedSection);
    const count = Math.min(questionCount, 30);

    const selected = [];
    for (let i = 0; i < count; i++) {
      const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
      selected.push({ ...randomQ });
    }

    const customId = `custom-${Date.now()}`;
    navigate(`/quiz/${customId}/custom`, { state: { questions: selected } });
  };

  const startCustomExam = () => {
    const sectionSamples = Object.entries(sectionCounts).flatMap(([sec, count]) => {
      const sectionQs = allQuestions.filter((q) => q.section === parseInt(sec));
      const shuffled = [...sectionQs].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    });

    const shuffled = [...sectionSamples].sort(() => 0.5 - Math.random());
    const customId = `custom-${Date.now()}`;
    navigate(`/quiz/${customId}/custom?time=${customTime}`, {state: { questions: shuffled }});
  };

  if (loading) {
    return (
      <div className="content">
        <div className="custom-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="custom-page">
          <div className="error-state card">
            <svg className="error-icon" viewBox="0 0 24 24" width="48" height="48">
              <path fill="currentColor" d="M12 4c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8m0-2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3>Error Loading Questions</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="custom-page">
        <div className="custom-header">
          <h2>Custom Practice Mode</h2>
          <p className="lead">Customize your practice experience with targeted sections or full exams</p>
        </div>

        <div className="practice-options">
          <div className="section-practice card">
            <div className="card-header">
              <h3>Section Practice</h3>
              <p>Focus on specific topics with customized practice sessions</p>
            </div>

            <div className="form-group">
              <label className="form-label">Select Topic:</label>
              <select
                className="form-input"
                value={selectedSection || ""}
                onChange={(e) => setSelectedSection(parseInt(e.target.value))}
              >
                <option value="" disabled>Choose a topic to practice</option>
                <option value="1">1. Number Theory & Computation</option>
                <option value="2">2. Consumer Arithmetic</option>
                <option value="3">3. Sets</option>
                <option value="4">4. Measurement</option>
                <option value="5">5. Statistics</option>
                <option value="6">6. Algebra</option>
                <option value="7">7. Relations, Functions & Graphs</option>
                <option value="8">8. Geometry & Trigonometry</option>
                <option value="9">9. Vectors & Matrices</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Number of Questions:
                <div className="input-with-note">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="form-input"
                  />
                  <span className="input-note">(Max: 30)</span>
                </div>
              </label>
              <p className="warning-note">
                <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                Practice quizzes may contain repeat questions
              </p>
            </div>

            <button 
              className="btn btn-primary"
              disabled={!selectedSection} 
              onClick={startSectionPractice}
            >
              Start Section Practice
            </button>
          </div>

          <div className="full-exam card">
            <div className="card-header">
              <h3>Full Paper 1 Exam</h3>
              <p>Complete 60-question exam with customizable duration</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Exam Duration:
                <div className="input-with-note">
                  <input
                    type="number"
                    min="10"
                    max="180"
                    step="5"
                    value={customTime}
                    onChange={(e) => setCustomTime(parseInt(e.target.value, 10))}
                    className="form-input"
                  />
                  <span className="input-note">minutes</span>
                </div>
              </label>
            </div>

            <button 
              className="btn btn-primary"
              onClick={startCustomExam}
            >
              Start Full Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
