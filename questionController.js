const axios = require('axios');

const generateQuestions = async (req, res) => {

  try {

    const {
      role,
      company,
      experience,
      techStack,
      difficulty
    } = req.body;

    const prompt = `
You are an expert technical interviewer.

Generate 10 realistic interview questions.

Requirements:

Role: ${role}
Company: ${company}
Experience: ${experience}
Tech Stack: ${techStack}
Difficulty: ${difficulty}

IMPORTANT:
- Questions should feel like real interviews.
- Mix HR + Technical + Scenario-based questions.
- Questions should match the company style.
- Do not generate generic beginner questions only.

Return ONLY valid JSON array.

Example:
{
  "questions": [
    "Tell me about yourself",
    "Explain React Virtual DOM",
    "What challenges did you face in projects?"
  ]
}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',

        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],

        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const text =
      response.data.choices[0].message.content;

    const cleanText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanText);

    return res.json(parsed);

  } catch (error) {

    console.log(error.response?.data || error.message);

    return res.status(500).json({
      message: 'Failed to generate questions'
    });
  }
};

module.exports = { generateQuestions };