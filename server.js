const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

const axios = require('axios');

const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// SUPABASE
// =========================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.locals.supabase = supabase;

// =========================
// MIDDLEWARE
// =========================

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// =========================
// ROUTES
// =========================

const authRoutes = require('./routes/authRoutes');

const aiRoutes = require('./routes/aiRoutes');

const questionRoutes = require('./routes/questionRoutes');

app.use('/api/auth', authRoutes);

app.use('/api/ai', aiRoutes);

app.use('/api/questions', questionRoutes);

// =========================
// HOME ROUTE
// =========================

app.get('/', (req, res) => {

  res.json({
    success: true,
    message: 'InterviewAI Backend Running 🚀'
  });

});

// =========================
// TEST AI ROUTE
// =========================

app.get('/test-ai', async (req, res) => {

  try {

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',

        messages: [
          {
            role: 'user',
            content: 'Hello AI'
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      aiResponse:
        response.data.choices[0].message.content
    });

  } catch (error) {

    console.log(
      'AI TEST ERROR:',
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      error:
        error.response?.data || error.message
    });

  }

});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {

  console.error('SERVER ERROR:', err);

  res.status(500).json({
    success: false,
    message:
      err.message || 'Internal Server Error'
  });

});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

  console.log(
    `✅ Server running on http://localhost:${PORT}`
  );

});