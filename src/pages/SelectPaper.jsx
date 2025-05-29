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
  { id: 'june2022', name: 'June 2022' },
  { id: 'june2023', name: 'June 2023' },
  { id: 'jan2024', name: 'January 2024' },
];

export default function SelectPaper({mode}) {
  
  return (
    <div className="content">
      <div className="page">
        <h2>Select a Paper for {mode.charAt(0).toUpperCase()+mode.slice(1)} Mode</h2>
        <ul>
          {papers.map(paper => (
            <li key={paper.id}>
              <Link to={`/quiz/${paper.id}/${mode}`}>{paper.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
}
