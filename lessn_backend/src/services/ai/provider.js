// src/services/ai/provider.js
const { AI_MODE, OPENAI_API_KEY } = require('../../config/env');
const mode = (AI_MODE || 'mock').toLowerCase();

/**
 * Generate a structured lesson JSON.
 * Returns: { title, grade, subject, topic, language, slides: [{ title, bullets: string[], notes? }] }
 */
async function generateLesson({ grade, subject, topic, length = 10, language = 'English' }) {
  const slidesCount = Math.max(6, Math.min(20, Number(length) || 10));

  // ---- MOCK MODE (default; no keys or extra deps required) ----
  if (mode === 'mock') {
    const slides = [
      { title: `${topic || 'Untitled'} — Introduction`, bullets: [`Grade: ${grade || 'N/A'}`, `Subject: ${subject || 'N/A'}`, `Language: ${language}`] },
      { title: 'Objectives', bullets: ['Understand key concepts', 'Engage in activity', 'Assess learning'] },
      { title: 'Warm-up', bullets: ['Quick question', 'Pair discussion'] },
      { title: 'Direct Instruction', bullets: ['Explain concept A', 'Show example B'] },
      { title: 'Guided Practice', bullets: ['Work problem together', 'Teacher checks understanding'] },
      { title: 'Independent Practice', bullets: ['Students complete task'] },
      { title: 'Assessment', bullets: ['Exit ticket / quiz'] },
      { title: 'Differentiation', bullets: ['Support for varied levels'] },
      { title: 'Extension', bullets: ['Extra challenge / homework'] },
      { title: 'Wrap-up', bullets: ['Recap & next steps'] },
    ].slice(0, slidesCount);

    return {
      title: `${topic || 'Untitled Topic'} (Auto-Generated)`,
      grade: grade || null,
      subject: subject || null,
      topic: topic || null,
      language,
      slides,
    };
  }

  // ---- OPENAI MODE (optional) ----
  if (mode === 'openai') {
    if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing for AI_MODE=openai');

    // Lazy-load axios so mock mode doesn't require it to be installed
    const axios = require('axios');

    const prompt = `
Generate a structured lesson plan as JSON with this exact shape:
{
  "title": "string",
  "slides": [
    { "title": "string", "bullets": ["string", "string"], "notes": "string (optional)" }
  ]
}
Constraints:
- Slides count: ${slidesCount}
- Grade: ${grade || 'N/A'}
- Subject: ${subject || 'N/A'}
- Topic: ${topic || 'Untitled'}
- Language: ${language}
Return ONLY valid JSON. No prose, no markdown.
`.trim();

    const resp = await axios.post(
      'https://api.openai.com/v1/responses',
      { model: 'gpt-4.1-mini', input: prompt },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const text = resp.data?.output_text || resp.data?.content?.[0]?.text || '';
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error('AI returned non-JSON payload');
    }
    if (!json || !Array.isArray(json.slides)) {
      throw new Error('Malformed slides JSON from AI');
    }

    json.grade = grade || null;
    json.subject = subject || null;
    json.topic = topic || null;
    json.language = language;
    return json;
  }

  // ---- Unsupported mode ----
  throw new Error(`AI provider "${mode}" not configured. Use AI_MODE=mock (default) or AI_MODE=openai.`);
}

module.exports = { generateLesson };
