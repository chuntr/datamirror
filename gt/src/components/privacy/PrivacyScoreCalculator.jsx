import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, Lock, Mail, Search, Puzzle, Calculator } from 'lucide-react';

const SCORES = {
  browsers: {
    'Tor Browser': 98,
    'Mullvad Browser': 95,
    'Brave (Aggressive)': 90,
    'Firefox (Strict)': 80,
    'Safari (default)': 60,
    'Microsoft Edge (default)': 50,
    'Google Chrome (default)': 30
  },
  extensions: {
    'uBlock Origin': 95,
    'AdGuard extension': 90,
    'Privacy Badger': 80,
    'Ghostery': 75,
    'No extension': 10
  },
  vpns: {
    'Mullvad VPN': 95,
    'IVPN': 90,
    'Mozilla VPN': 90,
    'ProtonVPN': 88,
    'NordVPN': 75,
    'Surfshark': 75,
    'ExpressVPN': 75,
    'No VPN': 20
  },
  search: {
    'DuckDuckGo': 85,
    'Startpage': 80,
    'Qwant': 80,
    'Google Search': 25
  },
  email: {
    'ProtonMail': 90,
    'Tutanota': 88,
    'Gmail': 40,
    'Outlook': 45
  }
};

const WEIGHTS = {
  browser: 0.4,
  ext1: 0.2,
  ext2: 0.2,
  vpn: 0.1,
  search: 0.05,
  email: 0.05
};

function getExposureBand(score) {
  if (score >= 90) return { band: 'Hardened stack', color: 'text-green-500', bg: 'bg-green-500/20' };
  if (score >= 70) return { band: 'Low exposure', color: 'text-cyan-500', bg: 'bg-cyan-500/20' };
  if (score >= 40) return { band: 'Moderate exposure', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
  return { band: 'High exposure', color: 'text-red-500', bg: 'bg-red-500/20' };
}

export default function PrivacyScoreCalculator() {
  const [selections, setSelections] = useState({
    browser: '',
    ext1: '',
    ext2: '',
    vpn: '',
    search: '',
    email: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

  const calculateScore = () => {
    const browserScore = SCORES.browsers[selections.browser] || 30;
    const ext1Score = SCORES.extensions[selections.ext1] || 10;
    const ext2Score = SCORES.extensions[selections.ext2] || 10;
    const vpnScore = SCORES.vpns[selections.vpn] || 20;
    const searchScore = SCORES.search[selections.search] || 25;
    const emailScore = SCORES.email[selections.email] || 40;

    const stackScore = Math.round(
      WEIGHTS.browser * browserScore +
      WEIGHTS.ext1 * ext1Score +
      WEIGHTS.ext2 * ext2Score +
      WEIGHTS.vpn * vpnScore +
      WEIGHTS.search * searchScore +
      WEIGHTS.email * emailScore
    );

    const exposureInfo = getExposureBand(stackScore);

    const explanation = generateExplanation(stackScore, {
      browser: { name: selections.browser, score: browserScore },
      ext1: { name: selections.ext1, score: ext1Score },
      vpn: { name: selections.vpn, score: vpnScore }
    });

    setResult({
      browserScore,
      ext1Score,
      ext2Score,
      vpnScore,
      searchScore,
      emailScore,
      stackScore,
      exposureBand: exposureInfo.band,
      bandColor: exposureInfo.color,
      bandBg: exposureInfo.bg,
      shortLabel: getShortLabel(stackScore),
      explanation
    });
  };

  const generateExplanation = (score, details) => {
    if (score >= 90) {
      return `Excellent setup! Your combination of ${details.browser.name} with ${details.ext1.name} and ${details.vpn.name || 'a strong VPN'} provides robust protection against most tracking methods.`;
    }
    if (score >= 70) {
      return `Good privacy setup. Your browser choice (${details.browser.name}) provides solid protection. Consider upgrading your extensions or VPN for even better coverage.`;
    }
    if (score >= 40) {
      return `Moderate protection. While ${details.browser.name} offers some privacy features, trackers can still collect significant data. Consider switching to a more privacy-focused browser.`;
    }
    return `Your current setup exposes significant data to trackers. ${details.browser.name} has minimal privacy protections. Consider switching to Brave, Firefox, or Tor for better privacy.`;
  };

  const getShortLabel = (score) => {
    if (score >= 90) return 'Privacy Champion';
    if (score >= 70) return 'Well Protected';
    if (score >= 40) return 'Needs Improvement';
    return 'Highly Exposed';
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary" />
          Privacy Stack Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Select your current browser, extensions, VPN, search engine, and email provider
          to calculate your privacy protection score based on research-derived metrics.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Browser */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Browser (40% weight)
            </label>
            <Select value={selections.browser} onValueChange={(v) => handleChange('browser', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select browser" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.browsers).map(browser => (
                  <SelectItem key={browser} value={browser}>{browser}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Extension 1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-secondary" />
              Primary Extension (20%)
            </label>
            <Select value={selections.ext1} onValueChange={(v) => handleChange('ext1', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select extension" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.extensions).map(ext => (
                  <SelectItem key={ext} value={ext}>{ext}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Extension 2 */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-secondary" />
              Secondary Extension (20%)
            </label>
            <Select value={selections.ext2} onValueChange={(v) => handleChange('ext2', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select extension" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.extensions).map(ext => (
                  <SelectItem key={ext} value={ext}>{ext}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* VPN */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              VPN (10%)
            </label>
            <Select value={selections.vpn} onValueChange={(v) => handleChange('vpn', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select VPN" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.vpns).map(vpn => (
                  <SelectItem key={vpn} value={vpn}>{vpn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4 text-chart-4" />
              Search Engine (5%)
            </label>
            <Select value={selections.search} onValueChange={(v) => handleChange('search', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select search" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.search).map(search => (
                  <SelectItem key={search} value={search}>{search}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-chart-5" />
              Email Provider (5%)
            </label>
            <Select value={selections.email} onValueChange={(v) => handleChange('email', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select email" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SCORES.email).map(email => (
                  <SelectItem key={email} value={email}>{email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={calculateScore}
          className="w-full"
          disabled={!selections.browser}
        >
          <Shield className="w-4 h-4 mr-2" />
          Calculate Privacy Score
        </Button>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-4 border-t border-border"
          >
            <div className="text-center">
              <div className={`text-5xl font-bold font-mono ${result.bandColor}`}>
                {result.stackScore}
              </div>
              <div className="text-sm text-muted-foreground font-mono">/ 100</div>
              <Badge className={`${result.bandBg} ${result.bandColor} mt-2`}>
                {result.exposureBand}
              </Badge>
              <p className={`text-sm mt-2 font-medium ${result.bandColor}`}>
                {result.shortLabel}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">Browser</div>
                <div className="font-bold">{result.browserScore}</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">Ext 1</div>
                <div className="font-bold">{result.ext1Score}</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">Ext 2</div>
                <div className="font-bold">{result.ext2Score}</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">VPN</div>
                <div className="font-bold">{result.vpnScore}</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">Search</div>
                <div className="font-bold">{result.searchScore}</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-muted-foreground">Email</div>
                <div className="font-bold">{result.emailScore}</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
              {result.explanation}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
