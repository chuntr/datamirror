import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Eye, AlertTriangle, Info } from 'lucide-react';
import ExposureMeter from '../components/reports/ExposureMeter';
import { TimeByCategory, HoverTimeChart, ClickDistribution } from '../components/reports/TrackingCharts';
import InferenceCard from '../components/reports/InferenceCard';
import ProgressIndicator from '../components/ui/ProgressIndicator';
import { useTracking } from '../components/tracking/TrackingContext';
import { createPageUrl } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ReportRound1() {
  const { round1Data } = useTracking();

  if (!round1Data) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Data Found</h2>
            <p className="text-muted-foreground mb-4">
              Please complete the browsing round first.
            </p>
            <Link to={createPageUrl('BrowseRound1')}>
              <Button>Go to Browsing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <ProgressIndicator currentStep="report-1" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-mono text-muted-foreground">03 // </span>
            Your Data Report
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here's what we collected during your browsing session. This mirrors
            the type of data websites gather about you in real-time.
          </p>
        </motion.div>

        {/* Exposure Score */}
        <div className="mb-12">
          <ExposureMeter score={round1Data.exposureScore} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Time on Page', value: `${(round1Data.totalTimeMs / 1000).toFixed(1)}s`, icon: Eye },
            { label: 'Scroll Depth', value: `${round1Data.scrollDepthPercent}%`, icon: Eye },
            { label: 'Articles Clicked', value: round1Data.articles.filter(a => a.clicked).length, icon: Eye },
            { label: 'Total Hover Time', value: `${(round1Data.articles.reduce((s, a) => s + a.hoverTimeMs, 0) / 1000).toFixed(1)}s`, icon: Eye }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="bg-card/50 border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold font-mono text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <TimeByCategory data={round1Data.articles} />
          <HoverTimeChart data={round1Data.articles} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ClickDistribution data={round1Data.articles} />
          <InferenceCard data={round1Data} />
        </div>

        {/* Explanation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-accent/50 bg-accent/5 mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-accent shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-accent mb-4">What Just Happened?</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      While you were browsing, we tracked <strong>every interaction</strong> you made:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Scroll tracking</strong> revealed how engaged you were with the content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Hover time</strong> showed which articles caught your attention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Clicks</strong> indicated your strongest interests</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span><strong>Time on page</strong> measured your overall engagement</span>
                      </li>
                    </ul>
                    <p>
                      Real websites use this data — combined with information from other sites — to build
                      detailed profiles about your interests, demographics, and behavior patterns.
                    </p>
                  </div>

                  <TooltipProvider>
                    <div className="flex flex-wrap gap-4 mt-6">
                      {[
                        { term: 'Tracking Pixel', def: 'A tiny 1x1 image that loads when you view content, notifying servers about your activity.' },
                        { term: 'Behavioral Profiling', def: 'Building a profile based on your actions like clicks, scrolls, and time spent on content.' },
                        { term: 'Fingerprinting', def: 'Identifying your device using unique characteristics like screen size, fonts, and browser settings.' }
                      ].map((item, i) => (
                        <Tooltip key={i}>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted/50 border border-border cursor-help text-sm">
                              <Info className="w-3 h-3 text-primary" />
                              <span>{item.term}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{item.def}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-4">Ready for Round 2?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Now that you know what's being tracked, try browsing again.
                Can you reduce your data exposure while still getting the information you need?
              </p>
              <Link to={createPageUrl('BrowseRound2')}>
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Round 2
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
