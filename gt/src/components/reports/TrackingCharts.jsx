import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

const COLORS = ['#00d4aa', '#a855f7', '#ec4899', '#22c55e', '#ef4444', '#3b82f6'];

export function TimeByCategory({ data }) {
  // Group by category and sum hover times
  const categoryData = data.reduce((acc, article) => {
    const existing = acc.find(c => c.category === article.category);
    if (existing) {
      existing.time += article.hoverTimeMs / 1000;
    } else {
      acc.push({ category: article.category, time: article.hoverTimeMs / 1000 });
    }
    return acc;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 rounded-2xl bg-card/50 border border-border"
    >
      <h3 className="text-lg font-mono text-muted-foreground mb-4">TIME SPENT BY CATEGORY</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `${v.toFixed(1)}s`}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="hsl(var(--muted-foreground))"
              width={100}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${value.toFixed(2)}s`, 'Time Spent']}
            />
            <Bar dataKey="time" radius={[0, 4, 4, 0]}>
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function HoverTimeChart({ data }) {
  const chartData = data
    .filter(a => a.hoverTimeMs > 0)
    .map(a => ({
      name: a.title.substring(0, 20) + '...',
      fullTitle: a.title,
      time: a.hoverTimeMs / 1000,
      category: a.category
    }))
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-card/50 border border-border"
    >
      <h3 className="text-lg font-mono text-muted-foreground mb-4">HOVER TIME PER ARTICLE</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fontSize: 10 }}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `${v}s`}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [`${value.toFixed(2)}s`, props.payload.fullTitle]}
            />
            <Bar dataKey="time" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function ClickDistribution({ data }) {
  const clickedByCategory = data.reduce((acc, article) => {
    if (article.clicked) {
      const existing = acc.find(c => c.name === article.category);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: article.category, value: 1 });
      }
    }
    return acc;
  }, []);

  if (clickedByCategory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-card/50 border border-border text-center"
      >
        <h3 className="text-lg font-mono text-muted-foreground mb-4">CLICK DISTRIBUTION</h3>
        <p className="text-muted-foreground">No articles were clicked</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 rounded-2xl bg-card/50 border border-border"
    >
      <h3 className="text-lg font-mono text-muted-foreground mb-4">CLICK DISTRIBUTION</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={clickedByCategory}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {clickedByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function ComparisonStats({ round1, round2 }) {
  const stats = [
    {
      label: 'Total Time',
      r1: `${(round1.totalTimeMs / 1000).toFixed(1)}s`,
      r2: `${(round2.totalTimeMs / 1000).toFixed(1)}s`,
      delta: round2.totalTimeMs - round1.totalTimeMs,
      format: (d) => `${d > 0 ? '+' : ''}${(d / 1000).toFixed(1)}s`
    },
    {
      label: 'Scroll Depth',
      r1: `${round1.scrollDepthPercent}%`,
      r2: `${round2.scrollDepthPercent}%`,
      delta: round2.scrollDepthPercent - round1.scrollDepthPercent,
      format: (d) => `${d > 0 ? '+' : ''}${d}%`
    },
    {
      label: 'Articles Clicked',
      r1: round1.articles.filter(a => a.clicked).length,
      r2: round2.articles.filter(a => a.clicked).length,
      delta: round2.articles.filter(a => a.clicked).length - round1.articles.filter(a => a.clicked).length,
      format: (d) => `${d > 0 ? '+' : ''}${d}`
    },
    {
      label: 'Total Hover Time',
      r1: `${(round1.articles.reduce((s, a) => s + a.hoverTimeMs, 0) / 1000).toFixed(1)}s`,
      r2: `${(round2.articles.reduce((s, a) => s + a.hoverTimeMs, 0) / 1000).toFixed(1)}s`,
      delta: round2.articles.reduce((s, a) => s + a.hoverTimeMs, 0) - round1.articles.reduce((s, a) => s + a.hoverTimeMs, 0),
      format: (d) => `${d > 0 ? '+' : ''}${(d / 1000).toFixed(1)}s`
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-2xl bg-card/50 border border-border"
    >
      <h3 className="text-lg font-mono text-muted-foreground mb-4">ROUND 1 VS ROUND 2</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-center">
            <span className="text-sm font-mono text-muted-foreground">{stat.label}</span>
            <span className="text-center font-mono">{stat.r1}</span>
            <span className="text-center font-mono">{stat.r2}</span>
            <span className={`text-center font-mono font-bold ${
              stat.delta < 0 ? 'text-green-500' : stat.delta > 0 ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {stat.format(stat.delta)}
            </span>
          </div>
        ))}
        <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground border-t border-border pt-2 mt-4">
          <span></span>
          <span className="text-center">Round 1</span>
          <span className="text-center">Round 2</span>
          <span className="text-center">Change</span>
        </div>
      </div>
    </motion.div>
  );
}
