import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/api/generate-summary', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { memories } = req.body;
    const prompt = `You are an AI that summarizes shared memories for a long-distance relationship journal called Full Moon. 
    Here are the memories shared recently:
    ${JSON.stringify(memories)}

    Write a short, heartwarming summary (2-3 sentences) of these memories, focusing on the emotional connection and recurring themes. Use a supportive, poetic tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.post('/api/generate-prompts', async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an AI in a shared memory journal app called Full Moon. Generate 3 short, personalized prompts to encourage a long-distance couple to share meaningful moments.
    Examples: "Show something that made you smile today.", "Take a picture of the sky where you are."
    Return ONLY a JSON array of 3 strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text || "[]";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const prompts = JSON.parse(text);

    res.json({ prompts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate prompts' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
