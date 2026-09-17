const mockQuizQuestions = [
  {
    id: "q1",
    conceptId: "basic",
    prompt: "In the fraction 3/4, what does the 4 represent?",
    options: [
      {
        id: "a",
        text: "How many parts you have",
        correct: false,
        misconceptionTag: "confuses-numerator-denominator",
      },
      {
        id: "b",
        text: "How many equal parts the whole is split into",
        correct: true,
      },
      { id: "c", text: "The total value of the fraction", correct: false },
    ],
  },
  {
    id: "q2",
    conceptId: "equivalent",
    prompt: "Which of these is equivalent to 2/4?",
    options: [
      { id: "a", text: "1/2", correct: true },
      { id: "b", text: "2/8", correct: false },
      { id: "c", text: "3/4", correct: false },
    ],
  },
  {
    id: "q3",
    conceptId: "denominator",
    prompt: "What's the common denominator for 1/3 and 1/6?",
    options: [
      { id: "a", text: "6", correct: true },
      { id: "b", text: "3", correct: false },
      { id: "c", text: "9", correct: false },
    ],
  },
  {
    id: "q4",
    conceptId: "addition",
    prompt: "What is 1/2 + 1/3?",
    options: [
      { id: "a", text: "5/6", correct: true },
      {
        id: "b",
        text: "2/5",
        correct: false,
        misconceptionTag: "adds-num-and-denom-directly",
      },
      { id: "c", text: "3/6", correct: false },
    ],
  },
  {
    id: "q5",
    conceptId: "addition",
    prompt: "What is 1/4 + 1/4?",
    options: [
      {
        id: "a",
        text: "2/8",
        correct: false,
        misconceptionTag: "adds-num-and-denom-directly",
      },
      { id: "b", text: "2/4", correct: true },
      { id: "c", text: "1/4", correct: false },
    ],
  },
];

export default mockQuizQuestions;
