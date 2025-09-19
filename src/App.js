import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import LessonPlayer from "./pages/LessonPlayer"; // plays a single stage now
import Practice from "./pages/Practice";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import TestFirstFive from "./pages/TestFirstFive";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/learn" element={<Learn />} />

        {/* redirect bare lesson to stage 1 */}
        <Route path="/learn/:lessonId" element={<Navigate to="stage/1" replace />} />

        {/* single-stage route */}
        <Route path="/learn/:lessonId/stage/:stageIndex" element={<LessonPlayer />} />

        <Route path="/test/first-five" element={<TestFirstFive />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
