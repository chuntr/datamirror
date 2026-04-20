import { useState, useRef, useEffect, useCallback } from 'react';

export function useArticleTracking(articles) {
  const [trackingData, setTrackingData] = useState({
    totalTimeMs: 0,
    scrollDepthPercent: 0,
    articles: articles.map(a => ({
      id: a.id,
      category: a.category,
      title: a.title,
      hoverTimeMs: 0,
      clicked: false
    }))
  });

  const startTimeRef = useRef(Date.now());
  const hoverStartRef = useRef({});
  const maxScrollRef = useRef(0);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
        setTrackingData(prev => ({
          ...prev,
          scrollDepthPercent: Math.round(scrollPercent)
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update total time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData(prev => ({
        ...prev,
        totalTimeMs: Date.now() - startTimeRef.current
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleHoverStart = useCallback((articleId) => {
    hoverStartRef.current[articleId] = Date.now();
  }, []);

  const handleHoverEnd = useCallback((articleId) => {
    const startTime = hoverStartRef.current[articleId];
    if (startTime) {
      const hoverDuration = Date.now() - startTime;
      delete hoverStartRef.current[articleId];

      setTrackingData(prev => ({
        ...prev,
        articles: prev.articles.map(a =>
          a.id === articleId
            ? { ...a, hoverTimeMs: a.hoverTimeMs + hoverDuration }
            : a
        )
      }));
    }
  }, []);

  const handleClick = useCallback((articleId) => {
    setTrackingData(prev => ({
      ...prev,
      articles: prev.articles.map(a =>
        a.id === articleId ? { ...a, clicked: true } : a
      )
    }));
  }, []);

  const getFinalData = useCallback(() => {
    // Finalize any ongoing hovers
    Object.keys(hoverStartRef.current).forEach(articleId => {
      handleHoverEnd(articleId);
    });

    return {
      ...trackingData,
      totalTimeMs: Date.now() - startTimeRef.current
    };
  }, [trackingData, handleHoverEnd]);

  return {
    trackingData,
    handleHoverStart,
    handleHoverEnd,
    handleClick,
    getFinalData
  };
}
