import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-8NW00841RW"; // Replace with your ID

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};

export const logQuizStarted = (mode, section = null) => {
  ReactGA.event("quiz_start", {
    mode,
    section: section || "full"
  });
};

export const logQuizSubmitted = (mode, score, section = null) => {
  ReactGA.event("quiz_submit", {
    mode,
    score,
    section: section || "full"
  });
};