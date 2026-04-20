import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, ArrowRight, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';
import QuizComponent from '../components/quiz/QuizComponent';
import PrivacyScoreCalculator from '../components/privacy/PrivacyScoreCalculator';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { useTracking } from '../components/tracking/TrackingContext';
import { quizQuestions } from '../components/quiz/quizQuestions';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function PostQuiz() {
  const { preQuizScore, postQuizScore, saveQuizResults, round1Data, round2Data } = useTracking();
  const [showResults, setShowResults] = useState(false);
  const [finalPostScore, setFinalPostScore] = useState(null);

  const handleComplete = (answers, score, total) => {
    saveQuizResults('post', answers, score, total);
    setFinalPostScore({ score, total });
    setShowResults(true);
  };

  if (showResults && finalPostScore) {
    const preScore = preQuizScore?.score || 0;
    const postScore = finalPostScore.score;
    const improvement = postScore - preScore;
    const prePercent = Math.round((preScore / quizQuestions.length) * 100);
    const postPercent = Math.round((postScore / quizQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-background cyber-grid py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <ProgressIndicator currentStep="post-quiz" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="font-mono text-muted-foreground">07 // </span>
              Experience Complete!
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's a summary of your learning journey through this privacy education experience.
            </p>
          </motion.div>

          {/* Quiz Comparison */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className={`border-2 ${improvement > 0 ? 'border-green-500 bg-green-500/5' : improvement === 0 ? 'border-primary bg-primary/5' : 'border-yellow-500 bg-yellow-500/5'}`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Trophy className={`w-10 h-10 ${improvement > 0 ? 'text-green-500' : 'text-primary'}`} />
                  <h2 className="text-2xl font-bold">
                    {improvement > 0
                      ? 'Your Knowledge Improved!'
                      : improvement === 0
                        ? 'Solid Performance!'
                        : 'Keep Learning!'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="p-6 rounded-xl bg-card/50 border border-border">
                    <div className="text-sm font-mono text-muted-foreground mb-2">PRE-QUIZ</div>
                    <div className="text-4xl font-bold font-mono text-muted-foreground">{preScore}/{quizQuestions.length}</div>
                    <div className="text-sm text-muted-foreground mt-1">{prePercent}%</div>
                  </div>

                  <div className="p-6 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="text-sm font-mono text-primary mb-2">IMPROVEMENT</div>
                    <div className={`text-4xl font-bold font-mono ${improvement > 0 ? 'text-green-500' : improvement < 0 ? 'text-yellow-500' : 'text-primary'}`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {improvement > 0 ? 'More correct' : improvement < 0 ? 'Questions' : 'No change'}
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="text-sm font-mono text-green-500 mb-2">POST-QUIZ</div>
                    <div className="text-4xl font-bold font-mono text-green-500">{postScore}/{quizQuestions.length}</div>
                    <div className="text-sm text-muted-foreground mt-1">{postPercent}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Browsing Summary */}
          {round1Data && round2Data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="border-border bg-card/50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-secondary" />
                    <h3 className="text-xl font-bold">Your Browsing Summary</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-mono text-muted-foreground mb-4">EXPOSURE SCORES</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold font-mono text-muted-foreground">{round1Data.exposureScore}</div>
                          <div className="text-xs text-muted-foreground">Round 1</div>
                        </div>
                        <TrendingUp className={`w-6 h-6 ${round2Data.exposureScore < round1Data.exposureScore ? 'text-green-500 rotate-180' : 'text-yellow-500'}`} />
                        <div className="text-center">
                          <div className={`text-3xl font-bold font-mono ${round2Data.exposureScore < round1Data.exposureScore ? 'text-green-500' : 'text-yellow-500'}`}>
                            {round2Data.exposureScore}
                          </div>
                          <div className="text-xs text-muted-foreground">Round 2</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-mono text-muted-foreground mb-4">KEY METRICS</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time saved:</span>
                          <span className={round2Data.totalTimeMs < round1Data.totalTimeMs ? 'text-green-500' : 'text-yellow-500'}>
                            {((round1Data.totalTimeMs - round2Data.totalTimeMs) / 1000).toFixed(1)}s
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Scroll reduction:</span>
                          <span className={round2Data.scrollDepthPercent < round1Data.scrollDepthPercent ? 'text-green-500' : 'text-yellow-500'}>
                            {round1Data.scrollDepthPercent - round2Data.scrollDepthPercent}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Clicks reduced:</span>
                          <span className={round2Data.articles.filter(a => a.clicked).length < round1Data.articles.filter(a => a.clicked).length ? 'text-green-500' : 'text-yellow-500'}>
                            {round1Data.articles.filter(a => a.clicked).length - round2Data.articles.filter(a => a.clicked).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Privacy Score Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-center mb-6">
              Bonus: Calculate Your Privacy Stack Score
            </h3>
            <PrivacyScoreCalculator />
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Key Takeaways</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Websites track far more than just clicks — scrolls, hovers, and dwell time reveal your interests",
                    "Your browsing behavior can be used to infer demographics, interests, and engagement patterns",
                    "Mindful browsing can significantly reduce your data exposure",
                    "Privacy tools like ad blockers and privacy-focused browsers provide additional protection",
                    "Understanding tracking is the first step to protecting your privacy",
                    "Even small changes in browsing habits can make a difference"
                  ].map((takeaway, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Restart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Link to={createPageUrl('Home')}>
              <Button variant="outline" size="lg">
                Return to Home
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <ProgressIndicator currentStep="post-quiz" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-mono text-muted-foreground">06 // </span>
            Post-Experience Quiz
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let's see how much your understanding of online tracking has improved
            after experiencing it firsthand.
          </p>
        </motion.div>

        <QuizComponent onComplete={handleComplete} quizType="post" />
      </div>
    </div>
  );
}
