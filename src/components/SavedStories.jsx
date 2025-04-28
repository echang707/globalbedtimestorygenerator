import { useEffect, useState } from "react";

export default function SavedStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tigerCubStories") || "[]");
    setStories(stored.reverse());
  }, []);

  const clearStories = () => {
    const confirmed = window.confirm("Are you sure you want to delete all saved stories?");
    if (confirmed) {
      localStorage.removeItem("tigerCubStories");
      setStories([]);
    }
  };

  if (stories.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        🫧 No saved stories yet. Create one and hit save!
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">📚 Your Saved Stories</h2>

      <div className="space-y-6">
        {stories.map((s, i) => (
          <div
            key={s.id || i}
            className="bg-white/90 border border-indigo-100 p-6 rounded-2xl shadow-lg"
          >
            <p className="text-sm text-right text-gray-500 mb-2">Saved: {s.savedAt}</p>
            <div className="prose prose-lg text-gray-800 whitespace-pre-line">
              {s.story}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={clearStories}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition"
        >
          🗑 Clear All Saved Stories
        </button>
      </div>
    </div>
  );
}
