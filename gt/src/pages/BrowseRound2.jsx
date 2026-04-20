import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, ArrowRight, Lightbulb, CheckCircle2 } from 'lucide-react';
import ArticleCard from '../components/news/ArticleCard';
import { newsArticles } from '../components/news/newsArticles';
import { useArticleTracking } from '../components/tracking/useArticleTracking';
import { useTracking } from '../components/tracking/TrackingContext';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { createPageUrl } from "@/utils";

export default function BrowseRound2() {
  const navigate = useNavigate();
  const { saveRoundData, round1Data } = useTracking();
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
    saveRoundData(2, finalData);

    setTimeout(() => {
      navigate(createPageUrl('ReportRound2'));
    }, 500);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background cyber-grid py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressIndicator currentStep="browse-2" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border bg-card/50 backdrop-blur neon-border">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-secondary" />
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold mb-4">
                    Round 2: Browse Mindfully
                  </h1>

                  <p className="text-muted-foreground">
                    Now that you've seen what gets tracked, try to minimize your data exposure.
                    Here are some strategies:
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      tip: "Skim headlines quickly",
                      detail: "Don't hover over articles for long periods unless you truly want to read them"
                    },
                    {
                      tip: "Be intentional with clicks",
                      detail: "Only click on articles you genuinely need to read"
                    },
                    {
                      tip: "Limit scroll depth",
                      detail: "You don't need to scroll to the bottom if you've found what you need"
                    },
                    {
                      tip: "Spend less time overall",
                      detail: "Get in, get what you need, and leave"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{item.tip}</div>
                        <div className="text-sm text-muted-foreground">{item.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {round1Data && (
                  <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-medium mb-2 text-primary">Your Round 1 Stats to Beat:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Time: {(round1Data.totalTimeMs / 1000).toFixed(1)}s</div>
                      <div>Scroll: {round1Data.scrollDepthPercent}%</div>
                      <div>Clicks: {round1Data.articles.filter(a => a.clicked).length}</div>
                      <div>Exposure: {round1Data.exposureScore}/100</div>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={() => setShowIntro(false)}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    Start Mindful Browsing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
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
              <Badge variant="outline" className="font-mono border-secondary text-secondary">
                Round 2
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(trackingData.totalTimeMs / 1000)}s</span>
                {round1Data && trackingData.totalTimeMs < round1Data.totalTimeMs && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Scroll: {trackingData.scrollDepthPercent}%</span>
                {round1Data && trackingData.scrollDepthPercent < round1Data.scrollDepthPercent && (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>

            <Button
              onClick={handleFinish}
              disabled={finishing}
              className="bg-secondary hover:bg-secondary/90"
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
          <p className="text-muted-foreground">Browse mindfully — minimize your data footprint</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsArticles.map((article, index) => {
            const articleData = trackingData.articles.find(a => a.id === article.id);
            return (
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
                  showTracking={true}
                  hoverTime={articleData?.hoverTimeMs || 0}
                  clicked={articleData?.clicked || false}
                />
              </motion.div>
            );
          })}
        </div>

        <div className="h-32" />
      </div>

      {/* Floating indicator with comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-secondary shadow-lg">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">MINDFUL MODE</span>
        </div>
      </motion.div>
    </div>
  );
}
