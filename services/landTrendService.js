const axios = require('axios');
const { buildLandTrendPrompt } = require('../prompts/landTrendPrompt');

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

exports.generateTrend = async (input) => {
  const prompt = buildLandTrendPrompt(input);

  const headers = {
    Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const body = {
    model: "sonar",
    temperature: 0.3,              // ✅ Consistent, realistic outputs
    top_p: 0.85,                   // ✅ Slight diversity
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      body,
      { headers }
    );

    const content = response.data.choices[0].message.content;
    console.log("🔁 LLM Raw Output:\n", content); // Optional for debugging

    // ✅ Extract the first JSON block from the response
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("LLM response does not contain valid JSON");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (err) {
    console.error("🔥 Perplexity API Error:", err.response?.data || err.message);
    throw new Error(
      `Perplexity API failed: ${
        err.response?.data?.error?.message || err.response?.status || err.message
      }`
    );
  }
};
