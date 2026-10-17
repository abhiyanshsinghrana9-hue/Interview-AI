import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 shadow-lg">
        <div className="text-2xl font-bold text-blue-400">
          🤖 InterviewAI
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-gray-300 hover:text-white">
            Login
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            Sign Up Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h1 className="text-5xl font-bold mb-6">
          Ace Every <span className="text-blue-400">Interview</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          Practice with AI-powered mock interviews. Get real-time feedback, 
          improve your answers, and land your dream job.
        </p>
        <button 
          onClick={() => navigate('/signup')}
          className="px-8 py-4 bg-blue-600 text-white text-xl 
          rounded-xl hover:bg-blue-700 font-semibold shadow-lg">
          Start Free Interview 🚀
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 py-10 bg-gray-900">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">1000+</div>
          <div className="text-gray-400">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">50+</div>
          <div className="text-gray-400">Companies</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">AI</div>
          <div className="text-gray-400">Powered</div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16">
        <div className="bg-gray-900 p-6 rounded-xl text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Smart Questions</h3>
          <p className="text-gray-400">
            AI generates questions based on your role and experience level
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
          <p className="text-gray-400">
            Get detailed score and improvement tips after every answer
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl text-center">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-bold mb-2">Track Progress</h3>
          <p className="text-gray-400">
            See your improvement over time with detailed analytics
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-gray-500 bg-gray-900">
        Made with ❤️ by InterviewAI
      </div>

    </div>
  );
}

export default Landing;