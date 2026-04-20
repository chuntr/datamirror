import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { id: 'intro', label: 'Intro' },
  { id: 'pre-quiz', label: 'Pre-Quiz' },
  { id: 'browse-1', label: 'Browse 1' },
  { id: 'report-1', label: 'Report 1' },
  { id: 'browse-2', label: 'Browse 2' },
  { id: 'report-2', label: 'Report 2' },
  { id: 'post-quiz', label: 'Post-Quiz' }
];

export default function ProgressIndicator({ currentStep }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? 'hsl(var(--primary))'
                      : isCurrent
                        ? 'hsl(var(--secondary))'
                        : 'hsl(var(--muted))'
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${isCurrent ? 'ring-2 ring-secondary ring-offset-2 ring-offset-background' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <span className={`text-xs font-mono ${
                      isCurrent ? 'text-secondary-foreground' : 'text-muted-foreground'
                    }`}>
                      {index + 1}
                    </span>
                  )}
                </motion.div>
                <span className={`
                  text-xs mt-2 font-mono hidden sm:block
                  ${isCurrent ? 'text-secondary' : isCompleted ? 'text-primary' : 'text-muted-foreground'}
                `}>
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: index < currentIndex
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--muted))'
                    }}
                    className="h-full"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
