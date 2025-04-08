import React, { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, ArrowLeft, Music, Loader2 } from "lucide-react";
import Loading from "./Loading";

const questions = [
  { id: 1, text: "How are you feeling right now?", type: "text", icon: "😊" },
  { id: 2, text: "What's the first word that comes to your mind about how you feel?", type: "text", icon: "💭" },
  { id: 3, text: "If your mood was weather, what would it be?", type: "text", icon: "🌦️" },
];

export const Service = forwardRef((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [animation, setAnimation] = useState("");
  const navigate = useNavigate();

  const formatResponse = (q, ans) => {
    if (!ans.trim()) return "neutral"; 
    if (q.text.includes("first word")) return `I am feeling like ${ans}.`;
    return `I am feeling ${ans} right now.`;
  };

  useEffect(() => {
    setAnimation("fade-in");
    const timer = setTimeout(() => setAnimation(""), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (answers[questions[currentIndex].id]?.trim()) {
      setAnimation("fade-out");
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 300);
    } else {
      document.getElementById("answer-input").classList.add("shake");
      setTimeout(() => {
        document.getElementById("answer-input").classList.remove("shake");
      }, 500);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setAnimation("fade-out");
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }, 300);
    }
  };

  const handleChange = (e) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!answers[questions[currentIndex].id]?.trim()) {
      document.getElementById("answer-input").classList.add("shake");
      setTimeout(() => {
        document.getElementById("answer-input").classList.remove("shake");
      }, 500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedResponses = questions.map((q) => formatResponse(q, answers[q.id] || ""));
      const response = await axios.post("http://localhost:3000/getsongs", {
        responses: formattedResponses,
      });

      console.log("🎭 Detected Emotion:", response.data.genre);
      console.log("🎵 Recommendations:", response.data.recommendations);

      navigate("/getsong", {
        state: {
          emotion: response.data.genre,
          recommendations: response.data.recommendations || [],
        },
      });
    } catch (error) {
      setError("Failed to fetch songs. Try again later.");
      console.error("❌ Error detecting genre:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex === questions.length - 1) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div 
      ref={ref}
      className="max-w-full w-full min-h-screen flex justify-center items-center mx-auto py-20 relative overflow-hidden bg-black text-white"
    >
      {/* Enhanced blurred pastel decorations with animations */}
      <div className="absolute top-[-5rem] left-[-5rem] w-[18rem] h-[18rem] bg-[#3b3570] rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDuration: '15s' }}></div>
      <div className="absolute bottom-[-4rem] right-[-6rem] w-[20rem] h-[20rem] bg-[#242661] rounded-full blur-[100px] opacity-30 animate-pulse" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-[10%] w-[8rem] h-[8rem] bg-[#4e2e4f] rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-[20%] left-[60%] w-[10rem] h-[10rem] bg-[#2d4170] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }}></div>

      <div className="relative w-full max-w-4xl px-6">
        {/* Enhance progress bar with animation */}
        <div className="mb-12 w-full bg-gray-800 backdrop-blur-sm h-2 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#6e5bb9] to-[#606bf0] transition-all duration-500 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className={`bg-gray-900 backdrop-blur-sm rounded-3xl shadow-2xl p-12 transition-all duration-300 ${animation} border border-gray-800`}>
            {/* Enhanced question number indicator */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#6e5bb9] to-[#606bf0] text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-gray-800">
              <div className="flex items-center justify-center w-full h-full relative">
                <span>{currentIndex + 1}/{questions.length}</span>
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-60" style={{ animationDuration: '2s' }}></div>
              </div>
            </div>

            <div className="text-6xl mb-8 filter drop-shadow-md">{questions[currentIndex].icon}</div>

            <h1 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#6e5bb9] to-[#606bf0]">
              {questions[currentIndex].text}
            </h1>

            <div className="relative mb-12">
              <input
                id="answer-input"
                className="text-2xl font-light w-full h-20 px-8 text-center rounded-full border-2 border-gray-700 bg-gray-800 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all duration-300 shadow-inner"
                placeholder="Describe your feelings..."
                type={questions[currentIndex].type}
                value={answers[questions[currentIndex].id] || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className="absolute inset-x-0 bottom-0 h-20 rounded-full bg-gradient-to-r from-[#6e5bb9]/10 to-[#606bf0]/10 -z-10"></div>
            </div>

            <div className="flex justify-center items-center gap-6 mt-8">
              {currentIndex > 0 && (
                <button 
                  onClick={handlePrev}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-700 hover:bg-gray-800 transition-all duration-300 group text-gray-300"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden md:inline">Previous</span>
                </button>
              )}

              {currentIndex === questions.length - 1 ? (
                <button 
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6e5bb9] to-[#606bf0] text-white rounded-full hover:shadow-lg hover:shadow-[#6e5bb9]/20 transition-all duration-300 font-medium relative group overflow-hidden"
                  disabled={loading}
                >
                  <span className="relative z-10">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin inline mr-2" size={20} />
                        <span>Analyzing Mood...</span>
                      </>
                    ) : (
                      <>
                        <Music size={20} className="inline mr-2" />
                        <span>Find Songs for me</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#5a4a9e] to-[#4f5cd4] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6e5bb9] to-[#606bf0] text-white rounded-full hover:shadow-lg hover:shadow-[#6e5bb9]/20 transition-all duration-300 font-medium relative group overflow-hidden"
                >
                  <span className="relative z-10">Next Question</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#5a4a9e] to-[#4f5cd4] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border border-red-800 text-red-300 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        .fade-out {
          animation: fadeOut 0.3s ease forwards;
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
});