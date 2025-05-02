import { useState } from "react";
import { culturesList } from "../data/culturesList";

const valuesList = [
  "Kindness", "Gratitude", "Bravery", "Patience", "Perseverance",
  "Empathy", "Honesty", "Respect for Elders", "Forgiveness", "Identity",
  "Creativity", "Responsibility", "Family", "Generosity", "Curiosity",
  "Problem-Solving", "Teamwork", "Compassion", "Self-Discovery", "Love"
];

const tonesList = [
  "Dreamy", "Gentle", "Funny", "Mysterious", "Poetic", "Uplifting", "Soothing"
];

export default function StoryForm({ handleGenerate, creditsLeft }) {
  const [value, setValue] = useState("");
  const [showCultures, setShowCultures] = useState(false);
  const [cultures, setCultures] = useState([]);
  const [tone, setTone] = useState("");
  const [childName, setChildName] = useState("");

  const toggleCulture = (culture) => {
    setCultures((prev) =>
      prev.includes(culture) ? prev.filter((c) => c !== culture) : [...prev, culture]
    );
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!value || cultures.length === 0 || !tone) {
      alert("Please fill in all required fields.");
      return;
    }

    handleGenerate({ value, cultures, tone, childName });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-indigo-800 mb-3">
        🌙 Generate a Bedtime Story!
      </h1>
      <p className="text-center text-indigo-500 font-medium mb-10 text-base sm:text-lg">
        Craft a magical tale filled with culture, values, and wonder ✨
      </p>

      <form
        onSubmit={submitForm}
        className="bg-white/95 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] space-y-8 border border-gray-100"
      >
        {/* Value */}
        <div>
          <label className="block text-lg font-semibold text-indigo-700 mb-2">
            ✨ What value do you want to teach? *
          </label>
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">Select a value</option>
            {valuesList.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Culture */}
        <div>
          <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
            🌏 Choose Your Story’s Culture
          </h2>
          {!showCultures ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowCultures(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
              >
                🌟 See Cultures
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={() => setShowCultures(false)}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  🙈 Hide Cultures
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {culturesList.map((culture) => (
                  <div
                    key={culture.name}
                    onClick={() => toggleCulture(culture.name)}
                    className={`cursor-pointer p-4 rounded-xl border text-center shadow-md transition ${
                      cultures.includes(culture.name)
                        ? "bg-indigo-600 text-white ring-2 ring-indigo-300 scale-105"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-3xl mb-2">{culture.emoji}</div>
                    <div className="font-bold">{culture.name}</div>
                    <div className="text-sm mt-1">{culture.shortDescription}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tone */}
        <div>
          <label className="block text-lg font-semibold text-indigo-700 mb-2">
            🎭 Pick a tone *
          </label>
          <div className="flex flex-wrap gap-2">
            {tonesList.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-full font-medium transition transform hover:scale-[1.02] border shadow-sm ${
                  tone === t
                    ? "bg-purple-600 text-white scale-105 ring-2 ring-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-lg font-semibold text-indigo-700 mb-2">
            🧒 Child’s Name (optional)
          </label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="e.g., Mei"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Submit */}
        <div>
          <button
            disabled={creditsLeft <= 0}
            className={`w-full py-3 rounded-xl font-bold transition ${
              creditsLeft <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            🚀 Generate My Story
          </button>
        </div>

        {/* Credit Note */}
        {creditsLeft !== null && (
          <div className="text-center text-sm text-indigo-500 space-y-2">
            {creditsLeft > 0 ? (
              <>
                <p>✨ You have <strong>{creditsLeft}</strong> free stor{creditsLeft === 1 ? "y" : "ies"} left.</p>
                <p className="text-indigo-400">Make each one magical! Choose meaningful values and cultures to explore.</p>
              </>
            ) : (
              <>
                <p className="text-red-500 font-semibold">🚫 You've reached your free story limit.</p>
                <p className="text-indigo-400">Follow us or come back tomorrow to unlock more stories!</p>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
