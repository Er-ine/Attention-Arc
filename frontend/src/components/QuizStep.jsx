import { useState } from "react";
import mockQuizQuestions from "../mockQuizQuestions";

// Walks through quiz questions one at a time. Records every answer with
// its conceptId and misconceptionTag (if the wrong option carries one) —
// this is the data the Learning Map / Gap screens will consume next.
function QuizStep({ onComplete }) {
  const questions = mockQuizQuestions; // TODO: replace with backend-generated quiz later
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [answers, setAnswers] = useState([]);

  const question = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  function handleSelect(optionId) {
    setSelectedOptionId(optionId);
  }

  function handleNext() {
    const chosenOption = question.options.find(
      (o) => o.id === selectedOptionId,
    );

    const answerRecord = {
      questionId: question.id,
      conceptId: question.conceptId,
      correct: chosenOption.correct,
      misconceptionTag: chosenOption.misconceptionTag || null,
    };

    const updatedAnswers = [...answers, answerRecord];
    setAnswers(updatedAnswers);
    setSelectedOptionId(null);

    if (isLastQuestion) {
      onComplete(updatedAnswers);
    } else {
      setQuestionIndex((i) => i + 1);
    }
  }

  return (
    <div className="screen quiz-screen">
      <p className="progress-text">
        Question {questionIndex + 1} of {questions.length}
      </p>
      <h1 className="headline">{question.prompt}</h1>

      <div className="quiz-options">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`quiz-option ${selectedOptionId === option.id ? "quiz-option-selected" : ""}`}
            onClick={() => handleSelect(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>

      <button
        className="primary-button"
        onClick={handleNext}
        disabled={selectedOptionId === null}
      >
        {isLastQuestion ? "See my results" : "Next question"}
      </button>
    </div>
  );
}

export default QuizStep;
