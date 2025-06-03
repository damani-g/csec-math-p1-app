import { Link } from 'react-router-dom';

const papers = [
  { id: 'june2018', name: 'June 2018' },
  { id: 'jan2019', name: 'January 2019' },
  { id: 'june2019', name: 'June 2019' },
  { id: 'jan2020', name: 'January 2020' },
  { id: 'june2020', name: 'June 2020' },
  { id: 'jan2021', name: 'January 2021' },
  { id: 'june2021', name: 'June 2021' },
  { id: 'jan2022', name: 'January 2022' },
  // { id: 'june2022', name: 'June 2022' },
  // { id: 'june2023', name: 'June 2023' },
  // { id: 'jan2024', name: 'January 2024' },
];

export default function SelectPaper({mode}) {
  const modeDisplay = mode.charAt(0).toUpperCase() + mode.slice(1);
  
  return (
    <div className="content">
      <div className="select-paper-page">
        <div className="page-header">
          <h2>Select Past Paper</h2>
          <p className="lead">Choose a past paper to practice in {modeDisplay} Mode</p>
        </div>

        <div className="papers-grid">
          {papers.map(paper => {
            const year = paper.id.slice(-4);
            const session = paper.id.startsWith('june') ? '2' : '1';
            
            return (
              <Link 
                to={`/quiz/${paper.id}/${mode}`}
                key={paper.id}
                className="paper-card card"
              >
                <div className="paper-info">
                  <span className="paper-year">{year}</span>
                  <span className="paper-session">Session {session}</span>
                </div>
                <div className="paper-name">{paper.name}</div>
                <div className="paper-action">
                  <span className="action-text">Start Quiz</span>
                  <svg className="icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
