const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateMindMap = async (noteContent) => {
  if (!noteContent || noteContent.trim().length === 0) {
    throw new Error("Note content cannot be empty");
  }

  try {
    const prompt = `
You are an advanced AI mind map generator specialized in transforming unstructured notes into structured semantic knowledge graphs.

Analyze the provided note carefully and generate a hierarchical mind map representation.

Return ONLY valid JSON in the following format:

{
  "central_topic": "",
  "summary": "",
  "nodes": [
    {
      "id": "",
      "label": "",
      "category": ""
    }
  ],
  "connections": [
    {
      "from": "",
      "to": "",
      "relationship": ""
    }
  ]
}

Rules:
- central_topic must represent the main concept of the note.
- summary should provide a concise semantic overview.
- nodes should represent meaningful concepts, technologies, or entities.
- category should classify the node such as:
  "technology",
  "concept",
  "security",
  "deployment",
  "database",
  "AI",
  "tooling"
- connections should represent logical semantic relationships between concepts.
- relationship field should explain the relationship briefly.
- Maximum 10 nodes.
- Avoid duplicate concepts.
- Maintain hierarchical and meaningful relationships.
- Do not return markdown.
- Do not return explanations.
- Return ONLY valid JSON.

The response should resemble a real-world semantic mind map or knowledge graph.

Note Content:
${noteContent}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    let text = response.text.trim();

    // remove markdown if exists
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating mind map:", error);
    throw new Error("Failed to generate AI mind map");
  }
};

module.exports = { generateMindMap };