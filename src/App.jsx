import { Routes, Route, Link } from "react-router-dom";
import StoryGenerator from "./components/StoryGenerator";
import SavedStories from "./components/SavedStories";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      {/* 🧭 Simple nav */}
      <nav className="flex justify-center gap-4 mb-8 text-indigo-700 font-semibold">
        <Link to="/" className="hover:underline">🏠 Home</Link>
        <Link to="/saved" className="hover:underline">📚 Saved Stories</Link>
      </nav>

      <Routes>
        <Route path="/" element={<StoryGenerator />} />
        <Route path="/saved" element={<SavedStories />} />
      </Routes>
    </div>
  );
}
