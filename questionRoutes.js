const express = require('express');

const axios = require('axios');

const router = express.Router();

router.post('/generate', async (req, res) => {

  try {

    const {
      role,
      company,
      experience,
      interviewType,
      difficulty
    } = req.body;

    const prompt = `
You are an expert technical interviewer.

Generate 10 realistic interview questions.

Role: ${role}
Company: ${company}
Experience: ${experience}
Interview Type: ${interviewType}
Difficulty: ${difficulty}

IMPORTANT:
- Questions must feel realistic.
- Mix technical + HR questions if needed.
- Return ONLY JSON array.

Example:
[
  "Tell me about yourself",
  "Explain REST API",
  "What is React?"
]
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

    console.log('AI QUESTIONS:', text);

    const cleanText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let questions;

    try {

      questions = JSON.parse(cleanText);

    } catch (parseError) {

      console.log(
        'QUESTION PARSE ERROR:',
        parseError
      );

      questions = [
        'Tell me about yourself',
        'What are your strengths?',
        'Explain REST API',
        'Difference between SQL and NoSQL',
        'Explain OOPS concepts',
        'What is React?',
        'What is Node.js?',
        'Explain Git workflow',
        'Describe your project',
        'Why should we hire you?'
      ];
    }

    return res.json({
      success: true,
      questions
    });

  } catch (error) {

    console.log(
      'QUESTION GENERATION ERROR:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to generate questions'
    });
  }

});

module.exports = router;