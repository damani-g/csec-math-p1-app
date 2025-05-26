import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-8NW00841RW"; // Replace with your ID

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};
