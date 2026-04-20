import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  Shield,
  Brain,
  ArrowRight,
  MousePointer,
  Clock,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { createPageUrl } from "@/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 data-stream opacity-30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-primary">Educational Experience</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Discover How</span>
              <br />
              <span className="neon-glow text-primary">Websites Track You</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience firsthand how your browsing behavior is collected and analyzed.
              Learn what data is gathered from your scrolls, hovers, and clicks —
              and what companies can infer about you.
            </p>

            <Link to={createPageUrl('PreQuiz')}>
              <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 neon-border">
                Start the Experience
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            <span className="font-mono text-muted-foreground">// </span>
            What You'll Discover
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MousePointer,
                title: "Silent Tracking",
                description: "See how websites record your mouse movements, scroll depth, and dwell time without any visible indication.",
                color: "text-primary"
              },
              {
                icon: Brain,
                title: "Data Inference",
                description: "Learn what companies can deduce about your interests, engagement patterns, and potential demographics.",
                color: "text-secondary"
              },
              {
                icon: Shield,
                title: "Privacy Strategies",
                description: "Discover practical techniques to reduce your data footprint while browsing online.",
                color: "text-accent"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-6">
                    <item.icon className={`w-10 h-10 ${item.color} mb-4`} />
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="font-mono text-muted-foreground">// </span>
            How It Works
          </h2>

          <div className="space-y-6">
            {[
              { step: 1, title: "Take the Pre-Quiz", desc: "Test your current knowledge about online tracking" },
              { step: 2, title: "Browse Round 1", desc: "Explore a simulated news feed while we silently track your behavior" },
              { step: 3, title: "View Report 1", desc: "See exactly what data was collected and what it reveals" },
              { step: 4, title: "Browse Round 2", desc: "Try again with awareness — can you reduce your exposure?" },
              { step: 5, title: "Compare Results", desc: "See how your behavior changed and what you learned" },
              { step: 6, title: "Take the Post-Quiz", desc: "Measure how much your understanding has improved" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-mono font-bold text-primary">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="p-6 flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-accent shrink-0" />
              <div>
                <h3 className="font-bold text-accent mb-2">This Is Educational</h3>
                <p className="text-muted-foreground text-sm">
                  The tracking demonstrated in this app is a simplified version of real-world practices.
                  Actual data collection by companies is far more sophisticated and pervasive.
                  This experience is designed to help UW students understand and think critically
                  about online privacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to See What They See?</h2>
          <p className="text-muted-foreground mb-8">Takes about 10-15 minutes to complete</p>
          <Link to={createPageUrl('PreQuiz')}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Begin Experience
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground font-mono">
          <p>Data Privacy Education Project • University of Washington</p>
        </div>
      </footer>
    </div>
  );
}
