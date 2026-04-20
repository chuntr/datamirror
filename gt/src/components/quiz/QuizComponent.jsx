import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { quizQuestions, calculateQuizScore } from './quizQuestions';

export default function QuizComponent({ onComplete, quizType }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: parseInt(value)
    }));
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId: parseInt(questionId),
      selectedAnswer
    }));

    const results = calculateQuizScore(answersArray);
    setSubmitted(true);

    setTimeout(() => {
      onComplete(answersArray, results.score, results.total);
    }, 1500);
  };

  const isAnswered = answers[question.id] !== undefined;
  const allAnswered = Object.keys(answers).length === quizQuestions.length;
  const isCorrect = isAnswered && answers[question.id] === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-mono text-muted-foreground">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-mono text-primary">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border bg-card/50 backdrop-blur neon-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-medium leading-relaxed">
                  {question.question}
                </h2>
              </div>

              <RadioGroup
                value={answers[question.id]?.toString()}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {question.options.map((option, index) => {
                  const isSelected = answers[question.id] === index;
                  const showResult = showExplanation && isSelected;
                  const isOptionCorrect = index === question.correctAnswer;

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Label
                        htmlFor={`option-${index}`}
                        className={`
                          flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
                          ${isSelected
                            ? showResult
                              ? isOptionCorrect
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-red-500 bg-red-500/10'
                              : 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }
                        `}
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                          className="shrink-0"
                        />
                        <span className="flex-1">{option}</span>
                        {showResult && isSelected && (
                          isOptionCorrect
                            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                            : <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </Label>
                    </motion.div>
                  );
                })}
              </RadioGroup>

              {/* Show explanation button */}
              {isAnswered && !showExplanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExplanation(true)}
                    className="w-full"
                  >
                    Check Answer & See Explanation
                  </Button>
                </motion.div>
              )}

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`font-medium ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${index === currentQuestion
                  ? 'bg-primary scale-125'
                  : answers[quizQuestions[index].id] !== undefined
                    ? 'bg-primary/50'
                    : 'bg-muted-foreground/30'
                }
              `}
            />
          ))}
        </div>

        {currentQuestion === quizQuestions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitted}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {submitted ? 'Submitting...' : 'Submit Quiz'}
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
