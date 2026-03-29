import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = Number(process.env.CHAT_API_PORT || 8787);
const githubToken = process.env.GITHUB_TOKEN;
const githubModel = process.env.GITHUB_MODEL || "gpt-4o-mini";
const githubEndpoint = process.env.GITHUB_ENDPOINT || "https://models.inference.ai.azure.com";

// Helper: Extract YouTube video id
const extractVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Initialize GitHub Models client (using OpenAI-compatible SDK)
const client = githubToken && githubToken !== "your_github_token_here" 
  ? new OpenAI({ apiKey: githubToken, baseURL: githubEndpoint }) 
  : null;

// Helper: Split text into chunks
const splitIntoChunks = (text, maxTokens = 1000) => {
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentCount = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentCount += 1;
    if (currentCount >= maxTokens) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
      currentCount = 0;
    }
  }
  if (currentChunk.length > 0) chunks.push(currentChunk.join(" "));
  return chunks;
};

app.get("/api/chat/status", (_req, res) => {
  res.json({
    githubConfigured: Boolean(client),
    model: githubModel,
    status: client ? "Ready" : "Waiting for GitHub Token"
  });
});

// POST /api/generate-assets
app.post("/api/generate-assets", async (req, res) => {
  try {
    const { content, type = "all" } = req.body ?? {};

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Missing content" });
    }

    if (!client) {
      return res.status(503).json({ error: "GitHub Models Token not configured. Please add your PAT to .env" });
    }

    const chunks = splitIntoChunks(content, 2000);
    const results = {
      summary: "",
      levels: [],
      flashcards: [],
      concepts: []
    };

    for (let i = 0; i < Math.min(chunks.length, 3); i++) {
      const chunk = chunks[i];
      const prompt = `
      ACT AS:
      An expert AI learning system and assessment generator designed to deeply analyze educational content and create high-quality, concept-driven quizzes.

      # 🎯 TASK
      Analyze this raw educational content chunk:
      ${chunk}

      Your job is to:
      1. Thoroughly read and understand the entire content.
      2. Identify key concepts, definitions, relationships, and cause-effect examples.
      3. Generate high-quality assets (Summary, Questions, Flashcards, Concepts).

      # 🧠 ANALYSIS REQUIREMENTS (VERY IMPORTANT)
      - Avoid surface-level memorization; test real understanding.
      - Avoid direct copying of lines.
      - Identify core vs. supporting ideas.

      # 🎯 ASSET GENERATION RULES
      - QUESTIONS: Generate exactly 5 MCQs.
      - DIFFICULTY MIX: 2 easy (basic), 2 medium (application), 1 hard (conceptual/tricky).
      - FLASHCARDS: 3-5 high-utility cards.
      - CONCEPTS: 2-3 key concept mappings.

      # 🧾 OUTPUT FORMAT (STRICT JSON)
      Return ONLY valid JSON:
      {
        "summary": "2-3 sentence overview targeting core pedagogical value.",
        "questions": [
          {
            "question": "Deep conceptual or application question",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": 0, // INDEX OF CORRECT OPTION (0-3)
            "answer": "String text of correct answer (redundant for safety)",
            "explanation": "Clear, clean language justifying the correct answer and distractor logic.",
            "difficulty": "easy | medium | hard",
            "category": "Conceptual|Application|Analytical|Tricky"
          }
        ],
        "flashcards": [
          { "question": "Q", "answer": "A", "difficulty": "easy|medium|hard" }
        ],
        "concepts": [
          { "title": "Concept", "definition": "Def", "relationship": "Pedagogical link" }
        ]
      }
      `;

      const response = await client.chat.completions.create({
        model: githubModel,
        messages: [
          { role: "system", content: "You generate high-fidelity pedagogical JSON data. Strictly output JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const rawResponse = response.choices[0].message.content;
      console.log("RAW GITHUB RESPONSE (Chunk " + (i+1) + "):", rawResponse);

      let chunkData;
      try {
        chunkData = JSON.parse(rawResponse);
      } catch (e) {
        console.error("JSON parsing failed for chunk " + i , e);
        throw new Error("Invalid AI response format from cloud model.");
      }

      if (!chunkData.questions || !Array.isArray(chunkData.questions)) {
        chunkData.questions = [];
      }
      
      results.summary += (chunkData.summary + " ");
      results.flashcards.push(...(chunkData.flashcards || []));
      results.concepts.push(...(chunkData.concepts || []));
      
      chunkData.questions.forEach(q => {
        const difficulty = q.difficulty === 'boss' ? 'boss' : (q.difficulty || 'easy');
        let targetLevel = results.levels.find(l => l.difficulty === difficulty);
        
        if (!targetLevel) {
          targetLevel = {
            id: `lvl_${results.levels.length + 1}`,
            title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Node`,
            description: `Topic Focus: ${q.category || 'General'}`,
            difficulty: difficulty,
            isUnlocked: results.levels.length === 0,
            isCompleted: false,
            score: 0,
            questions: []
          };
          results.levels.push(targetLevel);
        }

        let corIndex = q.correctAnswer;
        if (typeof q.answer === 'string' && q.options.includes(q.answer)) {
          corIndex = q.options.indexOf(q.answer);
        } else if (typeof corIndex !== 'number') {
          corIndex = 0;
        }

        targetLevel.questions.push({ 
          ...q, 
          id: `q_${Date.now()}_${Math.random()}`,
          correctAnswer: corIndex,
          topic: q.category || 'General' 
        });
      });
    }

    if (results.levels.length === 0) {
      throw new Error("No study nodes could be generated. Check your content and API token.");
    }

    const diffOrder = { easy: 0, medium: 1, hard: 2, boss: 3 };
    results.levels.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);

    return res.json(results);
  } catch (error) {
    console.error("GITHUB MODELS ASSETS ERROR:", error);
    return res.status(500).json({ error: error.message || "Failed to generate study materials via cloud." });
  }
});

// POST /api/chat
app.post("/api/chat", async (req, res) => {
  try {
    const { userInput, chatHistory, mode = "expert" } = req.body ?? {};
    
    if (!client) return res.status(503).json({ error: "GitHub Models Token missing." });

    const systemPrompts = {
      beginner: "Explain like I'm 5. Use simple analogies and zero jargon.",
      friendly: "Be encouraging and conversational. Style: Like a helpful peer.",
      expert: "Provide deep technical insight, use professional terminology, and highlight nuances."
    };

    const response = await client.chat.completions.create({
      model: githubModel,
      messages: [
        { role: 'system', content: `You are LearnForge Study Buddy. Mode: ${mode}. ${systemPrompts[mode] || systemPrompts.expert}` },
        ...(chatHistory || []),
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
    });

    return res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("GITHUB CHAT ERROR:", error);
    return res.status(500).json({ error: "Cloud chat failed. Check your GitHub PAT." });
  }
});

// Native YouTube Transcript Fetcher (No dynamic import issues)
const getTranscript = async (videoId) => {
  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(videoUrl);
    const html = await response.text();
    
    const jsonStr = html.split('ytInitialPlayerResponse = ')[1]?.split(';</script>')[0];
    if (!jsonStr) throw new Error("Could not find player response");
    
    const playerResponse = JSON.parse(jsonStr);
    const captionTracks = playerResponse.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("No captions found for this video");
    }
    
    // Default to the first track (usually auto-generated or English)
    const transcriptResponse = await fetch(captionTracks[0].baseUrl);
    const transcriptXml = await transcriptResponse.text();
    
    // Simple regex to extract text from XML
    return transcriptXml
      .match(/<text[^>]*>([\s\S]*?)<\/text>/g)
      .map(node => node.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
      .join(" ");
  } catch (err) {
    console.error("Native Transcript Error:", err);
    throw err;
  }
};

// POST /api/transcribe
app.post("/api/transcribe", async (req, res) => {
  try {
    const { url } = req.body ?? {};
    if (!url) return res.status(400).json({ error: "YouTube URL is required" });

    const videoId = extractVideoId(url);
    if (!videoId) return res.status(400).json({ error: "Invalid YouTube URL format" });

    console.log(`Extracting native transcript for ID: ${videoId}`);
    const fullText = await getTranscript(videoId);
    
    return res.json({
      text: fullText,
      videoId: videoId
    });
  } catch (error) {
    console.error("TRANSCRIPTION ERROR:", error);
    return res.status(500).json({ 
      error: "Transcription failed. Does this video have captions enabled?",
      details: error.message 
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`LearnForge AI Service running on http://0.0.0.0:${port}`);
  console.log(`Targeting GitHub Models: ${githubModel} at ${githubEndpoint}`);
});
