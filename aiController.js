const axios = require('axios');

const evaluateAnswer = async (req, res) => {
  try {

    const { question, answer } = req.body;

    // Handle skipped answers
    if (
      !answer ||
      answer.trim() === '' ||
      answer === 'Skipped'
    ) {
      return res.json({
        score: 0,
        relevance: 0,
        communication: 0,
        technicalAccuracy: 0,
        structure: 0,
        feedback: 'Question was skipped.',
        tip: 'Attempt every interview question seriously.',
        idealAnswer: 'N/A'
      });
    }

    const cleanedAnswer = answer.trim().toLowerCase();

    // Detect meaningless/random answers
    const nonsensePatterns = [
      /^[a-z]{1,8}$/i,
      /^[0-9]+$/,
      /^(.)\1+$/,
      /^[a-z0-9]+$/i
    ];

    const isMeaningless =
      cleanedAnswer.length < 12 ||
      nonsensePatterns.some((pattern) =>
        pattern.test(cleanedAnswer.replace(/\s/g, ''))
      );

    // Direct fail for nonsense answers
    if (isMeaningless) {
      return res.json({
        score: 0,
        relevance: 0,
        communication: 0,
        technicalAccuracy: 0,
        structure: 0,
        feedback:
          'The answer is meaningless, irrelevant, or too short for the question.',
        tip:
          'Provide a proper explanation related to the question.',
        idealAnswer:
          'A strong answer should clearly explain the concept with proper details and examples.'
      });
    }

    const prompt = `
You are a senior FAANG-level interviewer.

Your job is to STRICTLY evaluate interview answers like real HR and technical interview rounds.

IMPORTANT:
For HR questions like:
- Tell me about yourself
- Introduce yourself
- Strengths and weaknesses
- Career goals

Answers containing:
- education
- projects
- technical skills
- strengths
- goals
- background
- achievements

should be considered VALID and RELEVANT.

DO NOT mark them irrelevant unless completely unrelated.

EVALUATION PARAMETERS:

1. Relevance to question
2. Technical correctness
3. Communication clarity
4. Structure and completeness
5. Confidence and professionalism
6. Real-world understanding
7. Examples and explanation quality

STRICT SCORING RULES:

- Random or nonsense answer:
  Score = 0

- Completely wrong answer:
  Score = 0-20

- Weak answer:
  Score = 20-40

- Average answer:
  Score = 40-60

- Good answer:
  Score = 60-80

- Excellent answer:
  Score = 80-100

VERY IMPORTANT:
- NEVER praise meaningless answers.
- NEVER say "Good attempt" for bad answers.
- Be strict but fair.
- Evaluate exactly like Google, Amazon, Microsoft interviewers.
- Give low score for vague or copied answers.
- Give high score only if answer is genuinely good.

Question:
${question}

Candidate Answer:
${answer}

Return ONLY valid JSON.

{
  "score": 0,
  "relevance": 0,
  "technicalAccuracy": 0,
  "communication": 0,
  "structure": 0,
  "feedback": "",
  "tip": "",
  "idealAnswer": ""
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

        temperature: 0.1
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

    console.log('AI RESPONSE:', text);

    // Clean markdown
    const cleanText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;

    try {

      parsed = JSON.parse(cleanText);

    } catch (parseError) {

      console.log('JSON PARSE ERROR:', parseError);

      return res.json({
        score: 0,
        relevance: 0,
        communication: 0,
        technicalAccuracy: 0,
        structure: 0,
        feedback:
          'The answer could not be evaluated properly.',
        tip:
          'Write clear, meaningful, and structured answers.',
        idealAnswer:
          'Provide relevant explanation with examples.'
      });
    }

    // Remove fake positive feedback
    if (
      parsed.feedback &&
      (
        parsed.feedback.toLowerCase().includes('good attempt') ||
        parsed.feedback.toLowerCase().includes('nice try')
      ) &&
      parsed.score < 60
    ) {
      parsed.feedback =
        'The answer is weak, incomplete, or not fully relevant to the question.';
    }

    // Final response
    return res.json({
      score:
        typeof parsed.score === 'number'
          ? parsed.score
          : 0,

      relevance:
        typeof parsed.relevance === 'number'
          ? parsed.relevance
          : 0,

      communication:
        typeof parsed.communication === 'number'
          ? parsed.communication
          : 0,

      technicalAccuracy:
        typeof parsed.technicalAccuracy === 'number'
          ? parsed.technicalAccuracy
          : 0,

      structure:
        typeof parsed.structure === 'number'
          ? parsed.structure
          : 0,

      feedback:
        parsed.feedback || 'Invalid answer.',

      tip:
        parsed.tip || 'Practice more.',

      idealAnswer:
        parsed.idealAnswer || 'N/A'
    });

  } catch (error) {

    console.log(
      'AI ERROR FULL:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      score: 0,
      relevance: 0,
      communication: 0,
      technicalAccuracy: 0,
      structure: 0,
      feedback:
        'AI evaluation failed.',
      tip:
        'Check OpenRouter API configuration.',
      idealAnswer: 'N/A'
    });
  }
};

module.exports = { evaluateAnswer };