import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, TrendingUp, User, Clock, MousePointer } from 'lucide-react';

export default function InferenceCard({ data }) {
  const generateInferences = () => {
    const inferences = [];
    const { articles, totalTimeMs, scrollDepthPercent } = data;

    // Interest inference based on hover time
    const categoryHover = articles.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.hoverTimeMs;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryHover)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat);

    if (topCategories.length > 0 && categoryHover[topCategories[0]] > 2000) {
      inferences.push({
        icon: Target,
        title: 'Interest Profile',
        text: `You appear most interested in ${topCategories.join(' and ')} content.`,
        color: 'text-primary'
      });
    }

    // Engagement level based on scroll and time
    const engagementLevel =
      scrollDepthPercent > 80 && totalTimeMs > 60000 ? 'very high' :
      scrollDepthPercent > 50 && totalTimeMs > 30000 ? 'high' :
      scrollDepthPercent > 30 ? 'moderate' : 'low';

    inferences.push({
      icon: TrendingUp,
      title: 'Engagement Pattern',
      text: `Your engagement level appears ${engagementLevel}. ${
        engagementLevel === 'very high'
          ? 'You thoroughly explored the content.'
          : engagementLevel === 'high'
            ? 'You showed significant interest in browsing.'
            : 'You browsed quickly without deep engagement.'
      }`,
      color: 'text-secondary'
    });

    // Click behavior
    const clickCount = articles.filter(a => a.clicked).length;
    const clickedCategories = [...new Set(articles.filter(a => a.clicked).map(a => a.category))];

    if (clickCount > 0) {
      inferences.push({
        icon: MousePointer,
        title: 'Click Behavior',
        text: `You clicked on ${clickCount} article${clickCount > 1 ? 's' : ''}, primarily in ${
          clickedCategories.join(', ')
        }. This indicates active interest in specific content.`,
        color: 'text-accent'
      });
    }

    // Time pattern
    const avgTimePerScroll = totalTimeMs / (scrollDepthPercent || 1);
    const readingPattern = avgTimePerScroll > 1500 ? 'careful reader' : 'quick scanner';

    inferences.push({
      icon: Clock,
      title: 'Reading Pattern',
      text: `Based on your scroll speed, you appear to be a ${readingPattern}. ${
        readingPattern === 'careful reader'
          ? 'You take time to absorb content.'
          : 'You prefer to skim through content quickly.'
      }`,
      color: 'text-chart-4'
    });

    // Demographic inference (simulated)
    inferences.push({
      icon: User,
      title: 'Demographic Inference',
      text: `Your browsing patterns suggest a younger, tech-savvy user who values ${
        topCategories[0] || 'diverse'
      } content. Advertisers would likely categorize you as a "${
        topCategories[0] === 'Technology' ? 'Tech Enthusiast' :
        topCategories[0] === 'Entertainment' ? 'Entertainment Seeker' :
        topCategories[0] === 'Lifestyle' ? 'Lifestyle Explorer' :
        'General Interest Reader'
      }".`,
      color: 'text-chart-5'
    });

    return inferences;
  };

  const inferences = generateInferences();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-2xl bg-card/50 border border-border"
    >
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-mono text-muted-foreground">INFERENCES ABOUT YOU</h3>
      </div>

      <div className="space-y-4">
        {inferences.map((inference, index) => {
          const Icon = inference.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${inference.color} shrink-0 mt-0.5`} />
                <div>
                  <h4 className={`font-medium ${inference.color} mb-1`}>{inference.title}</h4>
                  <p className="text-sm text-muted-foreground">{inference.text}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm text-primary">
          <strong>Note:</strong> These are simplified examples. Real tracking systems use far more data points
          and sophisticated algorithms to build detailed profiles that persist across websites.
        </p>
      </div>
    </motion.div>
  );
}
