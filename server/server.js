const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  const prompt = `
  Generate 5 simple flashcards in JSON format for the topic "${topic}".
  Each should have a "question" and an "answer".
  DO NOT INCLUDE BACKTICKS IN YOUR RESPONSE.
  DO NOT INCLUDE ANY OTHER TEXT OR EXPLANATION.
  DO NOT INCLUDE ANY HTML OR MARKDOWN.
  DO NOT INCLUDE ANY CODE BLOCKS.
  Format:
  [
    { "question": "What is X?", "answer": "Y" },
    ...
  ]
  `.trim();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log(text)

    const flashcards = JSON.parse(text.trim());
    res.json(flashcards);

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
