import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizComponent from '../components/quiz/QuizComponent';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { useTracking } from '../components/tracking/TrackingContext';
import { createPageUrl } from "@/utils";

export default function PreQuiz() {
  const navigate = useNavigate();
  const { saveQuizResults } = useTracking();

  const handleComplete = (answers, score, total) => {
    saveQuizResults('pre', answers, score, total);
    navigate(createPageUrl('BrowseRound1'));
  };

  return (
    <div className="min-h-screen bg-background cyber-grid py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep="pre-quiz" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-mono text-muted-foreground">01 // </span>
            Pre-Experience Quiz
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Before we begin, let's see what you already know about online tracking.
            Don't worry — this is just to measure your starting point.
          </p>
        </motion.div>

        <QuizComponent onComplete={handleComplete} quizType="pre" />
      </div>
    </div>
  );
}
