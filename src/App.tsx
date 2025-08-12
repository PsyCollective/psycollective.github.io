import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import Home from "./pages/Home";
import Questionnaires from "./pages/Questionnaires";
import ValuesQuestionnaire from "@/questionnaires/values/ValuesQuestionnaire.tsx";
import NotFound from "./pages/NotFound";

function AppContent() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questionnaires" element={<Questionnaires />} />
        <Route path="/questionnaire/values" element={<ValuesQuestionnaire />} />
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
