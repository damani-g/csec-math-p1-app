import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SECTION_LABELS = {
  1: "Number Theory & Computation",
  2: "Consumer Arithmetic",
  3: "Sets",
  4: "Measurement",
  5: "Statistics",
  6: "Algebra",
  7: "Relations, Functions & Graphs",
  8: "Geometry & Trigonometry",
  9: "Vectors & Matrices",
};

// Add a simple mobile detection hook
function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

export default function ScoreCharts({ scores }) {
  const [filterMode, setFilterMode] = useState("all");
  const [viewPercent, setViewPercent] = useState(true);
  const isMobile = useIsMobile();

  const filtered = useMemo(() => {
    return scores
      .filter((s) => filterMode === "all" || s.mode === filterMode)
      .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
  }, [scores, filterMode]);

  const sectionStats = useMemo(() => {
    const totals = {};
    filtered.forEach((s) => {
      Object.entries(s.breakdown || {}).forEach(([sec, val]) => {
        if (!totals[sec]) totals[sec] = { correct: 0, total: 0 };
        totals[sec].correct += val.correct;
        totals[sec].total += val.total;
      });
    });
    return Object.entries(totals).map(([sec, val]) => ({
      section: `${SECTION_LABELS[sec]}`,
      score: viewPercent
        ? Math.round((val.correct / val.total) * 100)
        : val.correct,
    }));
  }, [filtered, viewPercent]);

  const lineData = filtered.map((s, i) => ({
    index: i + 1,
    label: new Date(s.timestamp?.seconds * 1000).toLocaleDateString(),
    score: viewPercent ? Math.round((s.score / s.total) * 100) : s.score,
  }));

  // Responsive chart props
  const chartHeight = isMobile ? 200 : 300;
  const barLayout = isMobile ? "horizontal" : "vertical";
  const yAxisWidth = isMobile ? 80 : 120;
  const tickFontSize = isMobile ? 10 : 12;

  return (
    <div className="score-charts" style={{ padding: isMobile ? 8 : 24 }}>
      <h3>Score Trends</h3>
      <div>
        <label>View by mode: </label>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
        >
          <option value="all">All</option>
          <option value="mock">Mock</option>
          <option value="custom">Custom</option>
        </select>

        <label style={{ marginLeft: "1em" }}>Display as: </label>
        <select
          value={viewPercent}
          onChange={(e) => setViewPercent(e.target.value === "true")}
        >
          <option value="true">Percentage</option>
          <option value="false">Raw Score</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={lineData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="label" tick={{ fontSize: tickFontSize }} />
          <YAxis tick={{ fontSize: tickFontSize }} />
          <Tooltip />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h4>Average Score by Section</h4>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={sectionStats}
          layout={barLayout}
          margin={{ top: 20, right: 30, left: yAxisWidth, bottom: 5 }}
        >
          {isMobile ? (
            <XAxis
              type="category"
              dataKey="section"
              tick={{ fontSize: tickFontSize }}
            />
          ) : (
            <XAxis
              type="number"
              domain={[0, viewPercent ? 100 : "dataMax"]}
              tick={{ fontSize: tickFontSize }}
            />
          )}
          {isMobile ? (
            <YAxis type="number" tick={{ fontSize: tickFontSize }} />
          ) : (
            <YAxis
              type="category"
              dataKey="section"
              width={yAxisWidth}
              tick={{
                fontSize: tickFontSize,
                width: yAxisWidth,
                wordBreak: "break-word",
              }}
            />
          )}
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
