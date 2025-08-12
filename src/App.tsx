import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import Home from "./pages/Home";
import Questionnaires from "./pages/Questionnaires";
import RmEr18Questionnaire from "./questionnaires/rm-er18/RmEr18Questionnaire";
import NotFound from "./pages/NotFound";

function AppContent() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questionnaires" element={<Questionnaires />} />
        <Route path="/questionnaire/rm-er18" element={<RmEr18Questionnaire />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
