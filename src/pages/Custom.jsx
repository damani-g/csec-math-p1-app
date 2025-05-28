import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Custom() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [customTime, setCustomTime] = useState(90); // default to 90 minutes
  const [questionCount, setQuestionCount] = useState(10); // default to 10
  const navigate = useNavigate();

  const sectionCounts = {
    1: 6,
    2: 8,
    3: 6,
    4: 8,
    5: 6,
    6: 6,
    7: 8,
    8: 8,
    9: 4,
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
      selected.push({ ...randomQ }); // shallow clone in case of reuse
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

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="content">
      <div className="custom-mode">
        <h2>Custom Mode</h2>
        
        <div className="section-practice">
          <h3>Custom Practice Quiz by Section</h3>
          <label>Select Section for Practice:</label>
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(parseInt(e.target.value))}
          >
            <option value="" disabled>Select a section</option>
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
          <div>
            <label>
              Number of questions (up to 30):
              <input
                type="number"
                min={1}
                max={30}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              />
            </label>
            <p style={{ fontSize: "0.9em", color: "orange" }}>
              Note: Practice quizzes may contain repeat questions.
            </p>
          </div>
          <button disabled={!selectedSection} onClick={startSectionPractice}>
            Start Practice
          </button>
        </div>
        <div className="full-exam">
          <h3>Custom Paper 1 Full Exam</h3>
          <button onClick={startCustomExam}>
            Create a 60-question Custom Exam
          </button>
          <div>
            <label>
              Set Exam Duration (minutes):&nbsp;
              <input
                type="number"
                min="10"
                max="180"
                step="5"
                value={customTime}
                onChange={(e) => setCustomTime(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
      );
}
