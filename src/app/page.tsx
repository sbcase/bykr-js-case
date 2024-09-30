"use client";
import { useEffect, useState } from "react";

interface Question {
  title: string;
  body: string;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isOptionEnabled, setIsOptionEnabled] = useState(false);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setQuestions(data.slice(0, 10)));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 1) return prev - 1;
        nextQuestion();
        return 30;
      });
    }, 1000);

    setIsOptionEnabled(false);
    const enableOptionsTimer = setTimeout(() => setIsOptionEnabled(true), 100);

    return () => {
      clearInterval(timer);
      clearTimeout(enableOptionsTimer);
    };
  }, [currentQuestionIndex]);

  const nextQuestion = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(30);
    } else {
      setQuizFinished(true);
    }
  };

  const selectAnswer = (answer: string) => {
    if (!isOptionEnabled) return;
    setSelectedAnswers((prev) => [...prev, answer]);
    nextQuestion();
  };

  if (quizFinished) {
    return (
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sonuçlar</h1>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Soru</th>
              <th className="py-2 px-4 border">Cevabın</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border text-left">
                  {index + 1} - {q.title}
                </td>
                <td className="py-2 px-4 border text-left">
                  {selectedAnswers[index]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>Yükleniyor...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const words = currentQuestion.body.split(" ");
  const options = [
    "A: " + words.slice(0, 5).join(" "),
    "B: " + words.slice(5, 10).join(" "),
    "C: " + words.slice(10, 15).join(" "),
    "D: " + words.slice(15, 20).join(" "),
  ];

  return (
    <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-xl font-bold mb-4">{currentQuestion.title}</h1>
      <div className="text-left mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => selectAnswer(option)}
            className={`block w-full text-left py-2 px-4 mb-2 border rounded-md ${
              isOptionEnabled
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={!isOptionEnabled}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="text-gray-700">
        Kalan Süre: <span className="font-bold">{timeRemaining}</span>s
      </div>
    </div>
  );
}
