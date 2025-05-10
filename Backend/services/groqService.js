const Groq = require("groq-sdk");
require('dotenv').config();

// Validate environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ;
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not defined in environment variables");
}

const groq = new Groq({
  apiKey: GROQ_API_KEY
});

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"; // or "llama3-70b-8192", etc.

exports.queryLLM = async (prompt) => {
  try {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error("Prompt must be a non-empty string");
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from Groq API");
    }

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq API Error:", {
      message: err.message,
      status: err.status
    });
    
    throw new Error(`Failed to query Groq LLM: ${err.message}`);
  }
};