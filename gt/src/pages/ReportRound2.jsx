import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Trophy, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import ExposureMeter from '../components/reports/ExposureMeter';
import { TimeByCategory, HoverTimeChart, ComparisonStats } from '../components/reports/TrackingCharts';
import InferenceCard from '../components/reports/InferenceCard';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { useTracking } from '../components/tracking/TrackingContext';
import { createPageUrl } from "@/utils";

export default function ReportRound2() {
  const { round1Data, round2Data } = useTracking();

  if (!round2Data || !round1Data) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Data Found</h2>
            <p className="text-muted-foreground mb-4">
              Please complete both browsing rounds first.
            </p>
            <Link to={createPageUrl('BrowseRound1')}>
              <Button>Start from Beginning</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const exposureDelta = round2Data.exposureScore - round1Data.exposureScore;
  const improved = exposureDelta < 0;

  return (
    <div className="min-h-screen bg-background cyber-grid py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <ProgressIndicator currentStep="report-2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-mono text-muted-foreground">05 // </span>
            Round 2 Results
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let's see how your mindful browsing compared to your natural browsing.
          </p>
        </motion.div>

        {/* Result Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className={`border-2 ${improved ? 'border-green-500 bg-green-500/5' : 'border-yellow-500 bg-yellow-500/5'}`}>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {improved ? (
                  <>
                    <Trophy className="w-10 h-10 text-green-500" />
                    <h2 className="text-2xl font-bold text-green-500">You Reduced Your Exposure!</h2>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-10 h-10 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-yellow-500">Room for Improvement</h2>
                  </>
                )}
              </div>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {improved
                  ? `Your exposure score dropped by ${Math.abs(exposureDelta)} points. Mindful browsing made a real difference!`
                  : `Your exposure actually increased by ${exposureDelta} points. Changing browsing habits takes practice!`
                }
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Side by Side Exposure Meters */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div>
            <h3 className="text-center font-mono text-muted-foreground mb-4">ROUND 1</h3>
            <ExposureMeter score={round1Data.exposureScore} />
          </div>
          <div>
            <h3 className="text-center font-mono text-muted-foreground mb-4">ROUND 2</h3>
            <ExposureMeter
              score={round2Data.exposureScore}
              previousScore={round1Data.exposureScore}
            />
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="mb-12">
          <ComparisonStats round1={round1Data} round2={round2Data} />
        </div>

        {/* Charts for Round 2 */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <TimeByCategory data={round2Data.articles} />
          <HoverTimeChart data={round2Data.articles} />
        </div>

        {/* Inferences */}
        <div className="mb-12">
          <InferenceCard data={round2Data} />
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <Card className="border-secondary/50 bg-secondary/5">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-secondary shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-4">Privacy Recommendations</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Use Privacy-Focused Browsers",
                        desc: "Firefox, Brave, or Tor Browser have built-in tracking protection"
                      },
                      {
                        title: "Install Ad Blockers",
                        desc: "uBlock Origin blocks most tracking scripts and pixels"
                      },
                      {
                        title: "Clear Cookies Regularly",
                        desc: "Or use browser extensions that do this automatically"
                      },
                      {
                        title: "Use Private/Incognito Mode",
                        desc: "Prevents persistent tracking across sessions"
                      },
                      {
                        title: "Consider a VPN",
                        desc: "Masks your IP address from websites you visit"
                      },
                      {
                        title: "Read Privacy Policies",
                        desc: "Know what data companies collect and how they use it"
                      }
                    ].map((rec, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border">
                        <h4 className="font-medium mb-1">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground">{rec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Final Step: Post-Quiz</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Now let's see how much your understanding of online tracking has improved.
              </p>
              <Link to={createPageUrl('PostQuiz')}>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Take Post-Quiz
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
