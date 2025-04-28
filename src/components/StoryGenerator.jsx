import { useState } from "react";
import StoryForm from "./StoryForm";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { cultureTemplates } from "../data/cultureTemplates";

export default function StoryGenerator() {
  const storyRef = useRef();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastStoryData, setLastStoryData] = useState(null);


const handleGenerate = async ({ value, cultures, tone, childName }) => {
    setLoading(true);
    setStory(null);
  
  
    const cultureData = cultureTemplates[cultures[0]];


    const prompt = `
    Write a long (800+ word) bedtime story rooted in ${cultures.join(" and ")} storytelling traditions.
    
    Mimic the narrative tones of: ${cultureData.narrativeStyles.join("; ")}
    
    Embed storytelling traits like: ${cultureData.storytellingTraits.join("; ")}
    
    Create new characters (avoid using historical names) that reflect this archetype logic: ${cultureData.characterArchetypeNotes}
    
    Include symbolic details such as: ${cultureData.symbolGuidelines}
    
    Teach the value of "${value}" in a ${tone.toLowerCase()} tone. ${
      childName ? `Include a child named ${childName}.` : ""
    }
    
    Make the story feel like it could be passed down through generations.
    
    Use inspiration (not copying) from classics such as:
    ${cultureData.classicSummaries
      .map((s) => `• ${s.title}: ${s.summary}`)
      .join("\n")}
    `;
  
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
      console.log("API response:", data);
  
      let generatedText = "Something went wrong.";
      if (data.choices && data.choices[0]?.message?.content) {
        generatedText = data.choices[0].message.content;
      } else if (data.error) {
        generatedText = `Error: ${data.error.message}`;
      }
  
      setStory(generatedText);
      setLastStoryData({ value, cultures, tone, childName, story: generatedText });
    } catch (error) {
      console.error("Error generating story:", error);
      setStory("Failed to generate story.");
    } finally {
      setLoading(false);
    }
  };
  
  const saveStory = (storyText) => {
    const savedStories = JSON.parse(localStorage.getItem("tigerCubStories") || "[]");
    const newEntry = {
      id: Date.now(),
      story: storyText,
      savedAt: new Date().toLocaleString(),
    };
    localStorage.setItem("tigerCubStories", JSON.stringify([...savedStories, newEntry]));
    alert("✅ Story saved! You can view it later.");
  };

  const speakStory = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }
  
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
  
    speechSynthesis.cancel(); // cancel any queued ones first
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";
  
    utterance.onend = () => setIsSpeaking(false);
  
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };
  const downloadPDF = () => {
    if (!storyRef.current) return;
  
    const element = storyRef.current;
  
    const opt = {
      margin:       0.5,
      filename:     'bedtime-story.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().set(opt).from(element).save();
  };

  const handleContinueStory = async () => {
    if (!lastStoryData) return;
  
    const { value, cultures, tone, childName, story: previousStory } = lastStoryData;
  
    setLoading(true);
    setStory(null);
  
    const prompt = `This is the beginning of a culturally inspired bedtime story:
  
  ${previousStory}
  
  Now continue the story with a second chapter. Maintain the original style and tone (${tone}), staying true to the cultural inspiration (${cultures.join(", ")}). ${
      childName ? `Keep the character named ${childName}.` : ""
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
      const generatedText = data.choices?.[0]?.message?.content || "Something went wrong.";
      setStory(generatedText);
      setLastStoryData((prev) => ({
        ...prev,
        story: prev.story + "\n\n" + generatedText, // allow future continuation
      }));
    } catch (error) {
      console.error("Error continuing story:", error);
      setStory("Failed to continue story.");
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div className="p-6">
      <StoryForm handleGenerate={handleGenerate} />

      {loading && (
        <div className="text-center mt-6 text-lg text-indigo-600 animate-pulse">
          ✨ Generating your magical story...
        </div>
      )}

{story && (
  <div className="mt-12 bg-white/90 backdrop-blur-lg border border-indigo-100 p-8 rounded-3xl shadow-xl max-w-3xl mx-auto transition-all duration-300 animate-fade-in">

    <h3 className="text-2xl font-extrabold text-indigo-800 mb-6 text-center">
      📖 Your Bedtime Story
    </h3>

    {/* Story content to export */}
    <div
      ref={storyRef}
      className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line mb-6"
    >
      {story}
    </div>

    {/* Action buttons */}
    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center">
      <button
        onClick={() => speakStory(story)}
        className={`${
          isSpeaking ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
        } text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200`}
      >
        {isSpeaking ? "❌ Stop Reading" : "🔈 Read This Story"}
      </button>

      {lastStoryData && (
        <button
          onClick={handleContinueStory}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
        >
          📖 Continue This Story
        </button>
      )}

      <button
        onClick={() => saveStory(story)}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
      >
        💾 Save This Story
      </button>

      <button
        onClick={downloadPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all duration-200"
      >
        📥 Download as PDF
      </button>
    </div>
  </div>
)}

    </div>
  );
}
