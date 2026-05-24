const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function unwrapJson(responseText) {
  const trimmed = responseText.trim();
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");

  if (firstBracket !== -1 && lastBracket !== -1) {
    const jsonFragment = trimmed.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(jsonFragment);
    } catch {
      // fall through to direct parse attempt below
    }
  }

  return JSON.parse(trimmed);
}

function normalizeIdeas(rawIdeas, allowedCategories) {
  if (!Array.isArray(rawIdeas)) {
    throw new Error("AI response did not return an array of ideas.");
  }

  return rawIdeas
    .filter((idea) => idea && typeof idea === "object")
    .slice(0, 5)
    .map((idea, index) => {
      const title = String(idea.title || idea.name || "Untitled idea").trim();
      const description = String(idea.description || idea.text || "No description provided.").trim();
      const category = String(idea.category || idea.type || "Creative").trim();

      const normalizedCategory = allowedCategories.find(
        (allowed) => allowed.toLowerCase() === category.toLowerCase()
      ) || category;

      return {
        title,
        description,
        category: normalizedCategory,
      };
    });
}

function buildSystemMessage(allowedCategories) {
  return `You are a creative project assistant for a hobby project dashboard. Respond only with valid JSON. Generate exactly the requested number of ideas and do not include any explanation or markdown. Each idea must be an object with title, description, and category. Categories should come from: ${allowedCategories.join(", ")}.`;
}

function buildUserMessage({ promptType, promptValue, ideaCount }) {
  if (promptType === "category") {
    return `Create ${ideaCount} unique hobby project ideas using the category: ${promptValue}. Return a JSON array with title, description, and category.`;
  }

  if (promptType === "description") {
    return `Create ${ideaCount} unique hobby project ideas inspired by this description: ${promptValue}. Return a JSON array with title, description, and category.`;
  }

  return `Create ${ideaCount} unique hobby project ideas inspired by this title: ${promptValue}. Return a JSON array with title, description, and category.`;
}

export async function fetchProjectIdeas({ promptType, promptValue, categories = [], ideaCount = 3 }) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key. Add VITE_OPENAI_API_KEY or OPENAI_API_KEY to your .env file.");
  }

  const allowedCategories = categories.length ? categories : ["Crochet", "Knitting", "Clay sculpting", "Watercolor", "Embroidery", "Paper crafts", "Sewing"];
  const systemMessage = buildSystemMessage(allowedCategories);
  const userMessage = buildUserMessage({ promptType, promptValue, ideaCount });

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content || "";
  const ideas = unwrapJson(text);
  return normalizeIdeas(ideas, allowedCategories).slice(0, ideaCount);
}
