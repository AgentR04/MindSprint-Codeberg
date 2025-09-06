// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/mealplan", async (req, res) => {
  try {
    const userProfile = req.body;

    const prompt = `
You are a meal planning assistant.
Generate a 7-day meal plan with breakfast, lunch, dinner, and one snack per day.
Respect these constraints: ${JSON.stringify(userProfile)}.
Return ONLY valid JSON. Do not include explanations or markdown fences.
Schema:
{
  "days": [...],
  "shopping_list": [...]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // 🧹 Remove common junk (markdown fences, "json", trailing notes)
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ✅ Extract only the first JSON object
    const firstCurly = text.indexOf("{");
    const lastCurly = text.lastIndexOf("}");
    if (firstCurly === -1 || lastCurly === -1) {
      throw new Error("No JSON object found in response");
    }

    const jsonString = text.substring(firstCurly, lastCurly + 1);

    const json = JSON.parse(jsonString);

    res.json({ plan: json });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () =>
  console.log("✅ Backend running on http://localhost:5000")
);
