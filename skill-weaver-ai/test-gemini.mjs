import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no direct listModels in the generative-ai SDK for node yet in a simple way 
    // but we can try to generate a simple test with gemini-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
    console.log(result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-pro");
    } catch (e2) {
        console.error("Failed with gemini-pro:", e2.message);
    }
  }
}

listModels();
