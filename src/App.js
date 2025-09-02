import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LessonMap from "./components/LessonMap";
import LessonScreen from "./components/LessonScreen"; // Adjust path as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<LessonMap />} />
        <Route path="/lesson/:id" element={<LessonScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
