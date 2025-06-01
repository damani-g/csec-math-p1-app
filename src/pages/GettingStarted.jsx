import { Link } from "react-router-dom";

export default function GettingStarted() {
  return (
    <div className="content getting-started">
      <header className="welcome-header">
        <h1>Welcome</h1>
        <p className="intro-text">
          The main technique students use to prepare for the exam is doing past papers.
          This website aims to emulate that technique, and enhance the learning experience with extra features.
        </p>
      </header>

      <section className="study-modes">
        <h2>Study Modes</h2>
        
        <div className="mode-cards">
          <div className="mode-card">
            <h3>📝 Mock Exam Mode</h3>
            <p>
              Simulates a full exam: 60 questions, 90 minutes. You won't see answers until the end — perfect for replicating real exam conditions.
              Provides immediate feedback on submission, with a section by section breakdown of marks. Click on a section in the breakdown to see each question and identify which ones you got right and which ones you got wrong.
            </p>
          </div>

          <div className="mode-card pro">
            <h3>🛠️ Custom Exam Mode <span className="pro-badge">Pro</span></h3>
            <p>
              Create your own quizzes by selecting the number of questions and sections. Use this mode to focus on specific areas of the syllabus.
              Provides feedback similarly to Mock Exam Mode.
            </p>
          </div>

          <div className="mode-card pro">
            <h3>🧩 Practice Mode <span className="pro-badge">Pro</span></h3>
            <p>
              Relaxed study with immediate feedback. Does not provide end of quiz feedback like the other modes,
              but you can check your answers as you go along. Ideal for reviewing concepts and learning from your mistakes as you go.
            </p>
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <h2>Suggested Workflow for New Users</h2>
        <div className="workflow-steps">
          <ul>
            <li>Create a free account by signing up <Link to="/login">here</Link> to begin saving your scores.</li>
            <li>Start with a Mock Exam to get a feel for the real test format. (Free users get one mock exam per day. After completing a mock exam and returning to the home page, the Mock Exam Page will not be accessible until the next day.)</li>
            <li>Check the Review page to go over your answers.</li>
            <li>Consider upgrading to Pro to unlock Custom and Practice Modes.</li>
          </ul>
        </div>
      </section>

      <section className="help-section">
        <h2>Need Help?</h2>
        <p>
          If you have questions or would like to report a mistake, please visit the <Link to="/contact">Contact Page</Link>.
        </p>
      </section>
    </div>
  );
}
