import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, MousePointer } from 'lucide-react';
import { categoryColors } from './newsArticles';

export default function ArticleCard({
  article,
  onHoverStart,
  onHoverEnd,
  onClick,
  showTracking = false,
  hoverTime = 0,
  clicked = false
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverStart(article.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverEnd(article.id);
  };

  const handleClick = () => {
    onClick(article.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className={`
        overflow-hidden border transition-all duration-300 h-full
        ${isHovered ? 'border-primary neon-border' : 'border-border'}
        ${clicked && showTracking ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
        bg-card/50 backdrop-blur
      `}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
            onError={(e) => {
              e.target.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Category badge */}
          <Badge
            className={`absolute top-3 left-3 ${categoryColors[article.category]} border`}
          >
            {article.category}
          </Badge>

          {/* Tracking indicators (only shown when enabled) */}
          {showTracking && (
            <div className="absolute top-3 right-3 flex gap-2">
              {hoverTime > 0 && (
                <Badge variant="secondary" className="bg-secondary/80 backdrop-blur gap-1">
                  <Eye className="w-3 h-3" />
                  {(hoverTime / 1000).toFixed(1)}s
                </Badge>
              )}
              {clicked && (
                <Badge className="bg-accent/80 backdrop-blur gap-1">
                  <MousePointer className="w-3 h-3" />
                  Clicked
                </Badge>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-lg leading-snug mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.snippet}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>
        </CardContent>

        {/* Hover indicator line */}
        <div
          className={`
            h-1 bg-gradient-to-r from-primary via-secondary to-accent
            transition-transform duration-300 origin-left
            ${isHovered ? 'scale-x-100' : 'scale-x-0'}
          `}
        />
      </Card>
    </motion.div>
  );
}
