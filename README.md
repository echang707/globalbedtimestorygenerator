🌙 Global Bedtime Story Generator

**Global Bedtime Story Generator** is a React + Vite web app that creates personalized bedtime stories for kids, blending cultural folklore, values, and magic ✨.

Parents choose:
- 1–2 cultural inspirations (like Chinese, Japanese, Native American, etc.)
- A core life value (like Kindness, Perseverance, Honesty)
- A storytelling tone (like Dreamy, Uplifting, or Mysterious)
- Optionally, their child's name to personalize the story

The app uses OpenAI's API to generate beautiful, culturally-inspired tales — ready to read, save, or download as PDF.

---

## 🚀 Features

- 🌏 **Cultural Folklore**: Stories rooted in real mythology and folklore from around the world
- 🧠 **Value-Driven Lessons**: Choose important values like empathy, bravery, or family loyalty
- 🎭 **Tones and Moods**: Customize the feeling of the story (gentle, poetic, funny, mysterious, etc.)
- 📖 **Save Your Favorite Stories**: Local storage saving
- 🔈 **Read Aloud Mode**: Text-to-speech feature to listen to the story
- 📥 **Download as PDF**: Export your generated story easily
- 🛡️ **Responsive and Beautiful UI**: Mobile and desktop friendly

---

## 📦 Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/) for styling
- [OpenAI API](https://platform.openai.com/) for story generation
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF downloads
- [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for reading stories aloud

---

## 🛠 Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/echang707/globalbedtimestorygenerator.git
   cd globalbedtimestorygenerator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📜 Important Notes

- **Protect your API keys!** Never commit your `.env` file to GitHub.
- **Costs**: Each story generation consumes API credits from OpenAI — you are responsible for any API usage costs.
- **Upcoming Features**:
  - More cultures added (Polynesian, Norse, Celtic, etc.)
  - Multi-chapter story generation
  - User accounts and story libraries (future)

---

## 🌟 License

This project is open-source under the [MIT License](LICENSE).
