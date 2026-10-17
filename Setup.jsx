import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Setup() {

  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [type, setType] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {

    if (!role || !experience || !type) {

      alert('Please fill all required fields!');

      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        'http://localhost:5000/api/questions/generate',
        {
          role,
          company: company || 'General',
          experience,
          interviewType: type,
          difficulty: 'Medium'
        }
      );

      localStorage.setItem(
        'aiQuestions',
        JSON.stringify(res.data.questions)
      );

      localStorage.setItem(
        'interviewSetup',
        JSON.stringify({
          role,
          experience,
          type,
          company
        })
      );

      navigate('/interview');

    } catch (error) {

      console.log(error);

      alert('Failed to generate interview questions');

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen text-white overflow-hidden relative">

      {/* Professional Dynamic Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 animate-pulse"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop')"
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>

      {/* Animated Gradient Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full animate-pulse"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-600 opacity-20 blur-[120px] rounded-full animate-pulse"></div>

      {/* Navbar */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-5 border-b border-white/10 backdrop-blur-xl bg-black/30">

        {/* Logo */}
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/40">

            🤖

          </div>

          <div>

            <h1 className="text-3xl font-black tracking-wide">

              InterviewAI

            </h1>

            <p className="text-gray-300 text-sm">

              AI Powered Interview Platform

            </p>

          </div>

        </div>

        {/* Premium Home Button */}
        <button
          onClick={() => navigate('/')}
          className="
            group
            relative
            overflow-hidden
            px-6
            py-3
            rounded-2xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            hover:bg-white/10
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-2xl
            hover:shadow-cyan-500/20
          "
        >

          {/* Glow */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-r
            from-cyan-500/20
            via-blue-500/20
            to-purple-500/20
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
          "></div>

          <div className="relative flex items-center gap-3">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              flex
              items-center
              justify-center
              shadow-lg
              shadow-cyan-500/30
              text-lg
            ">

              🏠

            </div>

            <div className="flex flex-col items-start">

              <span className="font-bold tracking-wide text-white text-sm">

                Back Home

              </span>

              <span className="text-xs text-gray-300">

                Return Dashboard

              </span>

            </div>

          </div>

        </button>

      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-16">

          <h1 className="text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent">

            Crack Your Dream Job 🚀

          </h1>

          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">

            Practice real AI-generated interview questions inspired by Google, Amazon, Microsoft, Infosys and more.

          </p>

        </div>

        {/* Main Card */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl shadow-blue-500/10">

          {/* Role */}
          <div className="mb-12">

            <h2 className="text-3xl font-bold mb-6 text-blue-300">

              💼 Choose Your Role

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {[
                'Software Developer',
                'Frontend Developer',
                'Backend Developer',
                'Full Stack Developer',
                'Data Analyst',
                'DevOps Engineer'
              ].map((r) => (

                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-6 rounded-3xl text-left border transition-all duration-300 hover:scale-105

                  ${role === r
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-xl shadow-blue-500/30'
                    : 'bg-black/40 border-gray-700 hover:border-blue-500 hover:bg-black/60'
                  }`}
                >

                  <h3 className="text-xl font-bold mb-2">

                    {r}

                  </h3>

                  <p className="text-sm text-gray-300">

                    

                  </p>

                </button>

              ))}

            </div>

          </div>

          {/* Experience */}
          <div className="mb-12">

            <h2 className="text-3xl font-bold mb-6 text-cyan-300">

              🚀 Experience Level

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {[
                'Fresher',
                '1-2 Years',
                '3-5 Years'
              ].map((e) => (

                <button
                  key={e}
                  onClick={() => setExperience(e)}
                  className={`py-6 rounded-3xl text-xl font-bold border transition-all duration-300 hover:scale-105

                  ${experience === e
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300 shadow-xl shadow-cyan-500/30'
                    : 'bg-black/40 border-gray-700 hover:border-cyan-500'
                  }`}
                >

                  {e}

                </button>

              ))}

            </div>

          </div>

          {/* Interview Type */}
          <div className="mb-12">

            <h2 className="text-3xl font-bold mb-6 text-purple-300">

              🎯 Interview Type

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {[
                'Technical',
                'HR',
                'Both'
              ].map((t) => (

                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-6 rounded-3xl text-xl font-bold border transition-all duration-300 hover:scale-105

                  ${type === t
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 border-purple-300 shadow-xl shadow-purple-500/30'
                    : 'bg-black/40 border-gray-700 hover:border-purple-500'
                  }`}
                >

                  {t}

                </button>

              ))}

            </div>

          </div>

          {/* Company */}
          <div className="mb-12">

            <h2 className="text-3xl font-bold mb-6 text-yellow-300">

              🏢 Target Company

            </h2>

            <input
              type="text"
              placeholder="Google, Amazon, Microsoft, TCS..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-6 py-5 rounded-3xl bg-black/40 border border-gray-700 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300"
            />

          </div>

          {/* Summary */}
          {role && experience && type && (

            <div className="mb-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8">

              <h2 className="text-3xl font-bold text-blue-300 mb-5">

                ✅ Interview Summary

              </h2>

              <div className="flex flex-wrap gap-4">

                <span className="px-5 py-3 rounded-2xl bg-blue-600 font-bold">

                  {role}

                </span>

                <span className="px-5 py-3 rounded-2xl bg-cyan-600 font-bold">

                  {experience}

                </span>

                <span className="px-5 py-3 rounded-2xl bg-purple-600 font-bold">

                  {type}

                </span>

                {company && (

                  <span className="px-5 py-3 rounded-2xl bg-yellow-400 text-black font-black">

                    {company}

                  </span>

                )}

              </div>

            </div>

          )}

          {/* Start Button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-7 rounded-3xl text-3xl font-black bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-blue-500/40 disabled:opacity-50"
          >

            {loading
              ? 'Generating AI Questions...'
              : 'Start AI Interview 🚀'}

          </button>

        </div>

      </div>

    </div>
  );
}

export default Setup;