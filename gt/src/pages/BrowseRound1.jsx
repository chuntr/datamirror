import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, ArrowRight, AlertCircle } from 'lucide-react';
import ArticleCard from '../components/news/ArticleCard';
import { newsArticles } from '../components/news/newsArticles';
import { useArticleTracking } from '../components/tracking/useArticleTracking';
import { useTracking } from '../components/tracking/TrackingContext';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { createPageUrl } from "@/utils";

export default function BrowseRound1() {
  const navigate = useNavigate();
  const { saveRoundData } = useTracking();
  const [showIntro, setShowIntro] = useState(true);
  const [finishing, setFinishing] = useState(false);

  const {
    trackingData,
    handleHoverStart,
    handleHoverEnd,
    handleClick,
    getFinalData
  } = useArticleTracking(newsArticles);

  const handleFinish = () => {
    setFinishing(true);
    const finalData = getFinalData();
    saveRoundData(1, finalData);

    setTimeout(() => {
      navigate(createPageUrl('ReportRound1'));
    }, 500);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background cyber-grid py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressIndicator currentStep="browse-1" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card/50 backdrop-blur neon-border">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  Round 1: Browse Naturally
                </h1>

                <p className="text-muted-foreground mb-6">
                  You're about to browse a simulated news feed. Act naturally —
                  scroll through the articles, hover over ones that interest you,
                  and click on anything you'd like to read more about.
                </p>

                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    What we'll track:
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• How far you scroll down the page</li>
                    <li>• How long you spend on the page</li>
                    <li>• Which articles you hover over and for how long</li>
                    <li>• Which articles you click on</li>
                  </ul>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <Clock className="w-4 h-4" />
                  <span>Recommended: 1-2 minutes of browsing</span>
                </div>

                <Button
                  size="lg"
                  onClick={() => setShowIntro(false)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start Browsing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="font-mono">
                Round 1
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(trackingData.totalTimeMs / 1000)}s</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Scroll: {trackingData.scrollDepthPercent}%</span>
              </div>
            </div>

            <Button
              onClick={handleFinish}
              disabled={finishing}
              className="bg-primary hover:bg-primary/90"
            >
              {finishing ? 'Saving...' : 'Finish Browsing'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Daily Digest</h1>
          <p className="text-muted-foreground">Your personalized news feed</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ArticleCard
                article={article}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onClick={handleClick}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom spacer for scroll tracking */}
        <div className="h-32" />
      </div>

      {/* Floating indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-lg">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">TRACKING ACTIVE</span>
        </div>
      </motion.div>
    </div>
  );
}
