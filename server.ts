import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini client with process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// API route for generating custom birthday wishes / shayaris / cards for Divyanshi
app.post("/api/gemini/generate", async (req, res) => {
  const { mood, language, customTopic } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ 
      title: "Wishing You Shine Bright ✨",
      poem: "Phoolon ne amrit ka jaam bheja hai,\nSooraj ne gagan se salaam bheja hai.\nMubarak ho aapko aapka janamdin,\nDil se humne ye paigaam bheja hai.\n\nHar raah aasan ho aapki zindagi ki,\nHar khushi mukaddar ho aapke safar ki.\nDivyanshi naam hai aapka jaise divya teej,\nSada chamakti rahe bindiya aapki kismat ki!",
      blessing: "May this year bring endless laughter, great success, and magical moments in your life, Divyanshi! 🎂🎈",
      themeColor: "#f43f5e",
      isDemo: true,
      demoMessage: "API Key not configured. Showing fallback pre-generated sweet wish!"
    });
  }

  const prompt = `Write a special, heartwarming, and beautifully styled birthday greeting specifically for "Divyanshi".
The user wants the mood/style of the message to be: "${mood || 'sweet and poetic'}".
The output language must be: "${language || 'Hindi/Hinglish'}" (if Hindi, you can write in Hinglish - Hindi with English alphabet - or beautiful Devanagari mixed with Hinglish, as it feels warmer and modern).
${customTopic ? `Additionally, include or mention this specific aspect/vibe: "${customTopic}".` : ''}

Please structure your response as a JSON object with the following properties:
1. "title": A beautiful short title/heading (e.g. "Divyanshi Ke Liye Ek Pyara Sa Paigaam ✨" or "A Celestial Blessing for Divyanshi 🌟").
2. "poem": A 2-to-4 stanza beautiful poem or shayari written with proper line breaks (using \\n) that celebrates her special day, her smile, and beautiful wishes for her future. Make it sound deeply personal, sweet, and majestic.
3. "blessing": A short, heartfelt, formal or casual closing blessing/wish.
4. "themeColor": A hex color code (like "#ec4899" or "#f43f5e" or "#db2777" or "#84cc16") that matches the vibe of the written poem (e.g., gold, pink, warm red, or violet).

Make sure the response is strict JSON. Do not include markdown wraps like \`\`\`json.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }
    
    // Parse JSON safely
    const parsedData = JSON.parse(text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    // Fallback to beautiful preloaded shayari if parsing or API fails
    return res.json({
      title: "A Special Blessing for Divyanshi 🌟",
      poem: "Aapke is janamdin par ye duaa hai hamari,\nKhushiyon se bhari rahe ye zindagi aapki.\nChand sitaron ki tarah chamke aapka naseeb,\nHar din naya ujaala laye kismat aapki.\n\nSada haste muskurate rahe aap Divyanshi,\nJaise khilta hai gulab gulshan mein.",
      blessing: "Wishing you a truly magical year ahead, filled with joy, peace, and sweet surprises! Happy Birthday! 💖",
      themeColor: "#ec4899"
    });
  }
});

// Configure Vite middleware and static asset serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
