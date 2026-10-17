import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Feedback() {

  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [results, setResults] = useState([]);

  useEffect(() => {

    const storedAnswers = JSON.parse(
      localStorage.getItem('interviewAnswers')
    );

    console.log(
      'STORED ANSWERS:',
      storedAnswers
    );

    if (
      storedAnswers &&
      storedAnswers.length > 0
    ) {

      setAnswers(storedAnswers);

      evaluateAnswers(storedAnswers);

    } else {

      setLoading(false);

    }

  }, []);

  const evaluateAnswers = async (allAnswers) => {

    try {

      const evaluatedResults = [];

      for (const item of allAnswers) {

        const response = await axios.post(
          'http://localhost:5000/api/ai/evaluate',
          {
            question: item.question,
            answer: item.answer
          }
        );

        evaluatedResults.push({
          question: item.question,
          answer: item.answer,
          ...response.data
        });

      }

      setResults(evaluatedResults);

    } catch (error) {

      console.log(
        'EVALUATION ERROR:',
        error
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center text-3xl">

        Evaluating Answers...

      </div>

    );

  }

  if (answers.length === 0) {

    return (

      <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center">

        <h1 className="text-4xl font-bold mb-6">

          No answers found!

        </h1>

        <button
          onClick={() => navigate('/setup')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-xl"
        >

          Go Back to Setup

        </button>

      </div>

    );

  }

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (acc, item) =>
              acc + item.score,
            0
          ) / results.length
        )
      : 0;

  return (

    <div className="min-h-screen bg-gray-950 text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-4">

          🎯 Interview Feedback

        </h1>

        <div className="text-center mb-12">

          <p className="text-7xl font-bold text-blue-400">

            {averageScore}/100

          </p>

        </div>

        <div className="space-y-8">

          {results.map((item, index) => (

            <div
              key={index}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">

                  Q{index + 1}. {item.question}

                </h2>

                <span className="text-3xl font-bold text-yellow-400">

                  {item.score}/100

                </span>

              </div>

              <div className="bg-gray-800 p-4 rounded-xl mb-4">

                <p className="text-gray-400 mb-2">
                  Your Answer:
                </p>

                <p>{item.answer}</p>

              </div>

              <div className="mb-4">

                <p className="text-red-300 mb-2">

                  📊 {item.feedback}

                </p>

                <p className="text-yellow-300">

                  💡 {item.tip}

                </p>

              </div>

              <div className="bg-green-900 p-4 rounded-xl border border-green-700">

                <p className="text-green-300 font-semibold mb-2">

                  ✅ Ideal Answer:

                </p>

                <p className="text-green-100">

                  {item.idealAnswer}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Feedback;