import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

function Interview() {

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState('');

  const [answers, setAnswers] = useState([]);

  useEffect(() => {

    const storedQuestions = JSON.parse(
      localStorage.getItem('aiQuestions')
    );

    if (
      storedQuestions &&
      storedQuestions.length > 0
    ) {

      setQuestions(storedQuestions);

    } else {

      alert('No interview questions found');

      navigate('/setup');

    }

  }, [navigate]);

  const handleNext = () => {

    const updatedAnswers = [

      ...answers,

      {
        question: questions[currentQuestion],

        answer:
          answer.trim() || 'Skipped'
      }

    ];

    setAnswers(updatedAnswers);

    setAnswer('');

    // NEXT QUESTION
    if (
      currentQuestion < questions.length - 1
    ) {

      setCurrentQuestion(currentQuestion + 1);

    }

    // FINISH INTERVIEW
    else {

      // SAVE ANSWERS
      localStorage.setItem(
        'interviewAnswers',
        JSON.stringify(updatedAnswers)
      );

      // SAVE QUESTIONS ALSO
      localStorage.setItem(
        'finalQuestions',
        JSON.stringify(questions)
      );

      navigate('/feedback');

    }

  };

  if (questions.length === 0) {

    return (

      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center text-2xl">

        Loading Questions...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 shadow-lg">

        <div className="text-2xl font-bold text-blue-400">

          🤖 InterviewAI

        </div>

        <div className="text-gray-400">

          Question {currentQuestion + 1} / {questions.length}

        </div>

      </nav>

      {/* Main */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="bg-gray-900 rounded-2xl p-8">

          <h1 className="text-3xl font-bold mb-8 leading-relaxed">

            {questions[currentQuestion]}

          </h1>

          <textarea
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            placeholder="Type your answer here..."
            rows={8}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold"
          >

            {currentQuestion === questions.length - 1

              ? 'Finish Interview 🚀'

              : 'Next Question ➜'}

          </button>

        </div>

      </div>

    </div>

  );
}

export default Interview;