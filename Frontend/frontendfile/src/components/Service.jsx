import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import next1 from "./assets/next1.png";
import previous from "./assets/previous.png";

const questions = [
  { id: 1, text: "How are you feeling right now?", type: "text" },
  { id: 2, text: "What’s the first word that comes to your mind about how you feel?", type: "text" },
  { id: 3, text: "If your emotions right now were a color, what would they be?", type: "text" },
];

export const Service = forwardRef((props, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleNext = () => {
    if (answers[questions[currentIndex].id]) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("Please enter a response before proceeding.");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleChange = (e) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!answers[questions[currentIndex].id]) {
      alert("Please enter a response before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3000/getsongs", {
        questions: Object.values(answers),
      });

      console.log("🎶 Songs Received:", response.data);
      navigate("/getsong", { state: response.data });

    } catch (error) {
      setError("Failed to fetch songs. Try again later.");
      console.error("❌ Error fetching songs:", error.response?.data || error.message);
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

  return (
    <div ref={ref} className="max-w-full w-full h-screen flex justify-center text-center mx-auto flex-col">
      <h1 className="text-5xl m-20">{questions[currentIndex].text}</h1>
      
      <div>
        <input
          className="text-3xl font-extralight border min-w-[800px] h-20 text-center rounded-full hover:shadow-2xl"
          placeholder={questions[currentIndex].text}
          type={questions[currentIndex].type}
          value={answers[questions[currentIndex].id] || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="mt-20">
        {currentIndex === questions.length - 1 ? (
          <button 
            onClick={handleSubmit} 
            className="border rounded-xl hover:shadow-2xl m-5 p-5"
            disabled={loading}
          >
            {loading ? "Finding Songs..." : "Find Songs for me"}
          </button>
        ) : (
          <>
            <button onClick={handlePrev} disabled={currentIndex === 0} className="rounded-xl hover:shadow-2xl">
              <img src={previous} className="h-14 w-14" alt="Previous" />
            </button>
            <button onClick={handleNext} className="rounded-xl hover:shadow-2xl m-5">
              <img src={next1} alt="Next" className="h-14 w-14" />
            </button>
          </>
        )}
      </div>

      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
});
