import React, { createContext, useContext, useState, useCallback } from 'react';

const TrackingContext = createContext(null);

export function TrackingProvider({ children }) {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [round1Data, setRound1Data] = useState(null);
  const [round2Data, setRound2Data] = useState(null);
  const [preQuizScore, setPreQuizScore] = useState(null);
  const [postQuizScore, setPostQuizScore] = useState(null);
  const [preQuizAnswers, setPreQuizAnswers] = useState([]);
  const [postQuizAnswers, setPostQuizAnswers] = useState([]);

  const saveRoundData = useCallback((round, data) => {
    const processedData = {
      ...data,
      sessionId,
      round,
      timestamp: new Date().toISOString(),
      exposureScore: calculateExposureScore(data)
    };

    if (round === 1) {
      setRound1Data(processedData);
    } else {
      setRound2Data(processedData);
    }

    return processedData;
  }, [sessionId]);

  const saveQuizResults = useCallback((type, answers, score, total) => {
    if (type === 'pre') {
      setPreQuizScore({ score, total });
      setPreQuizAnswers(answers);
    } else {
      setPostQuizScore({ score, total });
      setPostQuizAnswers(answers);
    }
  }, []);

  return (
    <TrackingContext.Provider value={{
      sessionId,
      round1Data,
      round2Data,
      preQuizScore,
      postQuizScore,
      preQuizAnswers,
      postQuizAnswers,
      saveRoundData,
      saveQuizResults
    }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within TrackingProvider');
  }
  return context;
}

function calculateExposureScore(data) {
  const { totalTimeMs, scrollDepthPercent, articles } = data;

  // Normalize time (max 5 min = 300000ms = 100%)
  const normalizedTime = Math.min(totalTimeMs / 300000, 1) * 100;

  // Scroll depth already in percent
  const normalizedScroll = scrollDepthPercent;

  // Calculate hover engagement
  const totalHoverTime = articles.reduce((sum, a) => sum + (a.hoverTimeMs || 0), 0);
  const normalizedHover = Math.min(totalHoverTime / 60000, 1) * 100; // max 60s = 100%

  // Click count
  const clickCount = articles.filter(a => a.clicked).length;
  const normalizedClicks = Math.min(clickCount / articles.length, 1) * 100;

  // Weighted average
  const score = (
    normalizedTime * 0.25 +
    normalizedScroll * 0.25 +
    normalizedHover * 0.30 +
    normalizedClicks * 0.20
  );

  return Math.round(score);
}

export default TrackingContext;
