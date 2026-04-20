export const quizQuestions = [
  {
    id: 1,
    question: "Which of the following actions can websites track even if you don't click anything?",
    options: [
      "Only button clicks",
      "Mouse movements, scroll position, and time spent on page",
      "Nothing unless you submit a form",
      "Only your location"
    ],
    correctAnswer: 1,
    explanation: "Websites can track passive behaviors like mouse movements, scroll depth, and dwell time using JavaScript event listeners."
  },
  {
    id: 2,
    question: "What can be inferred from how long you stay on a specific article?",
    options: [
      "Your exact age",
      "Your interest level and engagement with that topic",
      "Your credit card number",
      "Nothing meaningful"
    ],
    correctAnswer: 1,
    explanation: "Dwell time is a strong indicator of interest and engagement, helping build behavioral profiles."
  },
  {
    id: 3,
    question: "What is a tracking pixel?",
    options: [
      "A dead pixel on your monitor",
      "A tiny invisible image that records when you view content",
      "A type of camera",
      "A privacy protection tool"
    ],
    correctAnswer: 1,
    explanation: "Tracking pixels are 1x1 transparent images embedded in pages/emails that notify servers when loaded."
  },
  {
    id: 4,
    question: "Which behavior reduces the amount of behavioral data collected about you?",
    options: [
      "Clicking on every interesting article",
      "Hovering over content to read previews",
      "Quickly skimming headlines without lingering",
      "Scrolling to the very bottom of every page"
    ],
    correctAnswer: 2,
    explanation: "Quick, purposeful browsing generates less behavioral data than lingering, hovering, and clicking."
  },
  {
    id: 5,
    question: "When does website tracking typically begin?",
    options: [
      "Only after you log in",
      "Only when you make a purchase",
      "As soon as the page starts loading",
      "Only if you accept cookies"
    ],
    correctAnswer: 2,
    explanation: "Many tracking scripts execute immediately on page load, before any user interaction."
  },
  {
    id: 6,
    question: "What is browser fingerprinting?",
    options: [
      "A security feature that protects your browser",
      "A technique to identify users by their unique browser/device characteristics",
      "The browser's password manager",
      "A type of cookie"
    ],
    correctAnswer: 1,
    explanation: "Fingerprinting combines screen size, fonts, plugins, and other attributes to uniquely identify browsers."
  },
  {
    id: 7,
    question: "How can scroll depth be used to profile users?",
    options: [
      "It can't reveal anything useful",
      "It shows how engaged you are and which content sections interest you most",
      "It only measures page length",
      "It's purely for accessibility"
    ],
    correctAnswer: 1,
    explanation: "Scroll depth reveals reading patterns, engagement levels, and content preferences."
  },
  {
    id: 8,
    question: "What type of data do advertisers typically use to build interest profiles?",
    options: [
      "Only information you explicitly provide",
      "Browsing history, clicks, hovers, and time spent on different content",
      "Only your name and email",
      "Government records"
    ],
    correctAnswer: 1,
    explanation: "Behavioral signals like clicks, hovers, and dwell time are primary inputs for interest profiling."
  }
];

export function calculateQuizScore(answers) {
  let correct = 0;
  const detailed = answers.map(answer => {
    const question = quizQuestions.find(q => q.id === answer.questionId);
    const isCorrect = question && answer.selectedAnswer === question.correctAnswer;
    if (isCorrect) correct++;
    return {
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      correct: isCorrect,
      explanation: question?.explanation
    };
  });

  return {
    score: correct,
    total: quizQuestions.length,
    percentage: Math.round((correct / quizQuestions.length) * 100),
    detailed
  };
}
