import { useState, useEffect } from "react";

export default function SavedStories() {
  const [stories, setStories] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const MAX_FREE_STORIES = 3;

  useEffect(() => {
    // Reset credits daily
    const today = new Date().toDateString();
    const lastUsed = localStorage.getItem("lastStoryUseDate");
    if (lastUsed !== today) {
      localStorage.setItem("storyCredits", "0");
      localStorage.setItem("lastStoryUseDate", today);
    }

    const stored = JSON.parse(localStorage.getItem("tigerCubStories") || "[]");
    setStories(stored.reverse());
  }, []);

  const continueStory = async (index) => {
    const used = Number(localStorage.getItem("storyCredits") || 0);
    if (used >= MAX_FREE_STORIES) {
      alert("You’ve used all your free stories today.");
      return;
    }

    const s = stories[index];
    setLoadingIndex(index);

    const prompt = `This is the beginning of a culturally inspired bedtime story:\n\n${s.story}\n\nNow continue the story with the next chapter. Maintain the original style and tone (${s.tone}), staying true to the cultural inspiration (${s.cultures.join(", ")}). ${
      s.childName ? `Keep the character named ${s.childName}.` : ""
    } Keep it imaginative, magical, and moral-focused. End with a feeling of curiosity or resolution.`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
        }),
      });

      const data = await response.json();
      const newPart = data.choices?.[0]?.message?.content;

      if (!newPart) {
        alert("❌ Failed to continue story.");
        return;
      }

      // Update and re-save the story
      const latest = JSON.parse(localStorage.getItem("tigerCubStories") || "[]").reverse();
      const updated = [...latest];
      updated[index].story += `\n\n${newPart}`;
      updated[index].savedAt = new Date().toLocaleString();

      setStories(updated);
      localStorage.setItem("tigerCubStories", JSON.stringify([...updated].reverse()));

      const newCount = used + 1;
      localStorage.setItem("storyCredits", newCount);
    } catch (err) {
      console.error(err);
      alert("❌ Error continuing story.");
    } finally {
      setLoadingIndex(null);
    }
  };

  const deleteStory = (id) => {
    const updated = stories.filter((s) => s.id !== id);
    setStories(updated);
    localStorage.setItem("tigerCubStories", JSON.stringify([...updated].reverse()));
  };

  const clearStories = () => {
    if (window.confirm("Are you sure you want to delete all saved stories?")) {
      localStorage.removeItem("tigerCubStories");
      setStories([]);
    }
  };

  if (stories.length === 0) {
    return <div className="text-center text-gray-600 mt-10">🫧 No saved stories yet.</div>;
  }

  return (
    <div className="mt-12 max-w-3xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">📚 Your Saved Stories</h2>

      <div className="space-y-6">
        {stories.map((s, i) => (
          <div
            key={s.id}
            className="bg-white/90 border border-indigo-100 p-6 rounded-2xl shadow-lg space-y-4"
          >
            <p className="text-sm text-right text-gray-500">Saved: {s.savedAt}</p>
            <div className="prose prose-lg text-gray-800 whitespace-pre-line">{s.story}</div>

            <div className="flex flex-wrap justify-between gap-3 mt-4">
              <button
                onClick={() => continueStory(i)}
                disabled={loadingIndex === i}
                className={`${
                  loadingIndex === i
                    ? "bg-gray-400 cursor-wait"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white px-4 py-2 rounded-lg font-semibold transition`}
              >
                {loadingIndex === i ? "⏳ Continuing..." : "📖 Continue This Story"}
              </button>
              <button
                onClick={() => deleteStory(s.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                🗑 Delete Story
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={clearStories}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition"
        >
          🗑 Clear All Saved Stories
        </button>
      </div>
    </div>
  );
}
