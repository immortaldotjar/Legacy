import { useEffect, useState } from "react";
import {questions} from "../data/questions"
const STORAGE_KEY = "legacy-interview";

const initialAnswers = {
  passion: "",
  beginning: "",
  challenge: "",
  motivation: "",
  achievement: "",
  future: "",
};

export default function useInterview() {
  const savedInterview = (() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  const [current, setCurrent] = useState(savedInterview?.current ?? 0);

  const [answers, setAnswers] = useState(
    savedInterview?.answers ?? initialAnswers
  );

  const question = questions[current];

  function updateAnswer(value) {
    setAnswers((prev) => ({
      ...prev,
      [question.key]: value,
    }));
  }

  function next() {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    }
  }

  function previous() {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    }
  }

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        current,
        answers,
      })
    );
  }, [current, answers]);

  function clearInterview() {
    setCurrent(0);
    setAnswers(initialAnswers);
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    current,
    question,
    answers,
    total: questions.length,
    updateAnswer,
    next,
    previous,
    clearInterview,
  };
}