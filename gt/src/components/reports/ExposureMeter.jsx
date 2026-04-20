import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ExposureMeter({ score, previousScore = null }) {
  const getExposureLevel = (s) => {
    if (s < 25) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-500', icon: ShieldCheck };
    if (s < 50) return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-500', icon: Shield };
    if (s < 75) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-500', icon: ShieldAlert };
    return { level: 'Very High', color: 'text-red-500', bg: 'bg-red-500', icon: AlertTriangle };
  };

  const exposure = getExposureLevel(score);
  const Icon = exposure.icon;
  const delta = previousScore !== null ? score - previousScore : null;

  return (
    <div className="relative p-6 rounded-2xl bg-card/50 border border-border neon-border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-mono text-muted-foreground mb-2">DATA EXPOSURE SCORE</h3>
        <div className="flex items-center justify-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Icon className={`w-12 h-12 ${exposure.color}`} />
          </motion.div>
          <motion.span
            className={`text-6xl font-bold font-mono ${exposure.color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {score}
          </motion.span>
          <span className="text-2xl text-muted-foreground font-mono">/100</span>
        </div>

        {delta !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-2 text-lg font-mono ${delta < 0 ? 'text-green-500' : delta > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            {delta > 0 ? '+' : ''}{delta} from Round 1
            {delta < 0 && ' ✓'}
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-4 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full ${exposure.bg}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        />

        {/* Threshold markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4" />
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Very High</span>
      </div>

      {/* Exposure level badge */}
      <motion.div
        className={`
          mt-6 py-2 px-4 rounded-lg text-center font-mono
          ${exposure.bg}/20 border border-current ${exposure.color}
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-sm uppercase tracking-wider">Exposure Level: </span>
        <span className="font-bold">{exposure.level}</span>
      </motion.div>
    </div>
  );
}
