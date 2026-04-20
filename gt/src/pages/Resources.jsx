import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Shield,
  Book,
  Globe,
  Lock,
  Puzzle,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import PrivacyScoreCalculator from '../components/privacy/PrivacyScoreCalculator';

const resources = [
  {
    category: "Privacy Browsers",
    icon: Globe,
    items: [
      {
        name: "Firefox",
        url: "https://www.mozilla.org/firefox/",
        description: "Open-source browser with strong privacy features and Enhanced Tracking Protection"
      },
      {
        name: "Brave Browser",
        url: "https://brave.com/",
        description: "Chromium-based browser with built-in ad blocking and fingerprinting protection"
      },
      {
        name: "Tor Browser",
        url: "https://www.torproject.org/",
        description: "Maximum anonymity browser that routes traffic through the Tor network"
      }
    ]
  },
  {
    category: "Browser Extensions",
    icon: Puzzle,
    items: [
      {
        name: "uBlock Origin",
        url: "https://ublockorigin.com/",
        description: "Powerful, open-source ad and tracker blocker"
      },
      {
        name: "Privacy Badger",
        url: "https://privacybadger.org/",
        description: "EFF's extension that learns to block invisible trackers"
      },
      {
        name: "HTTPS Everywhere",
        url: "https://www.eff.org/https-everywhere",
        description: "Forces encrypted connections when available"
      }
    ]
  },
  {
    category: "VPN Services",
    icon: Lock,
    items: [
      {
        name: "Mullvad VPN",
        url: "https://mullvad.net/",
        description: "Privacy-focused VPN with anonymous account system"
      },
      {
        name: "ProtonVPN",
        url: "https://protonvpn.com/",
        description: "From the makers of ProtonMail, with a free tier"
      },
      {
        name: "IVPN",
        url: "https://www.ivpn.net/",
        description: "Transparent VPN with strong privacy commitments"
      }
    ]
  },
  {
    category: "Private Search Engines",
    icon: Search,
    items: [
      {
        name: "DuckDuckGo",
        url: "https://duckduckgo.com/",
        description: "Search engine that doesn't track you"
      },
      {
        name: "Startpage",
        url: "https://www.startpage.com/",
        description: "Google results without the tracking"
      },
      {
        name: "Qwant",
        url: "https://www.qwant.com/",
        description: "European privacy-focused search engine"
      }
    ]
  },
  {
    category: "Educational Resources",
    icon: Book,
    items: [
      {
        name: "EFF's Surveillance Self-Defense",
        url: "https://ssd.eff.org/",
        description: "Comprehensive guide to protecting yourself online"
      },
      {
        name: "Privacy Tools",
        url: "https://www.privacytools.io/",
        description: "Community-curated list of privacy services and tools"
      },
      {
        name: "The Markup",
        url: "https://themarkup.org/",
        description: "Investigative journalism on big tech and data"
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background cyber-grid py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="font-mono text-muted-foreground">// </span>
            Privacy Resources
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Tools, extensions, and guides to help you take control of your online privacy.
          </p>
        </motion.div>

        {/* Privacy Score Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <PrivacyScoreCalculator />
        </motion.div>

        {/* Resources Grid */}
        <div className="space-y-8">
          {resources.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold">{category.category}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <Card
                      key={item.name}
                      className="bg-card/50 border-border hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold">{item.name}</h3>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <Card className="border-secondary/50 bg-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-secondary" />
                Quick Privacy Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Use different browsers for different activities (work, personal, shopping)",
                  "Enable Do Not Track in your browser settings",
                  "Regularly clear cookies and browsing data",
                  "Review and limit app permissions on your phone",
                  "Use unique, strong passwords with a password manager",
                  "Be skeptical of free services — you might be the product",
                  "Check privacy settings on social media regularly",
                  "Consider using a privacy-focused email provider"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-mono text-secondary">{index + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
