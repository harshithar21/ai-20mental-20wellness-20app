import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Heart, Brain, Zap, Trophy } from "lucide-react";

interface MoodEntry {
  date: string;
  mood: number;
  emotion: string;
  sentiment: string;
}

interface EmotionStat {
  emotion: string;
  count: number;
  color: string;
}

export default function Dashboard() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([
    { date: "Mon", mood: 6, emotion: "joy", sentiment: "positive" },
    { date: "Tue", mood: 5, emotion: "anxiety", sentiment: "negative" },
    { date: "Wed", mood: 7, emotion: "calm", sentiment: "positive" },
    { date: "Thu", mood: 5, emotion: "stress", sentiment: "negative" },
    { date: "Fri", mood: 8, emotion: "joy", sentiment: "positive" },
    { date: "Sat", mood: 7, emotion: "love", sentiment: "positive" },
    { date: "Sun", mood: 6, emotion: "neutral", sentiment: "neutral" },
  ]);

  const [emotionStats, setEmotionStats] = useState<EmotionStat[]>([
    { emotion: "Joy", count: 24, color: "#FFD700" },
    { emotion: "Calm", count: 18, color: "#87CEEB" },
    { emotion: "Anxiety", count: 12, color: "#FF8C00" },
    { emotion: "Stress", count: 8, color: "#FF6B6B" },
    { emotion: "Love", count: 15, color: "#FF69B4" },
  ]);

  const [stats, setStats] = useState({
    averageMood: 6.4,
    totalChats: 120,
    journalEntries: 24,
    currentStreak: 7,
    bestMoodDay: "Friday",
  });

  // Calculate average mood from last 7 days
  useEffect(() => {
    const avgMood =
      moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
    setStats((prev) => ({
      ...prev,
      averageMood: Math.round(avgMood * 10) / 10,
    }));
  }, [moodData]);

  const chartData = moodData.map((entry) => ({
    ...entry,
    moodScore: entry.mood,
  }));

  const emotionChartData = emotionStats.map((stat) => ({
    name: stat.emotion,
    value: stat.count,
  }));

  const wellnessTips = [
    {
      title: "Stay Connected",
      description:
        "Reach out to friends and family regularly. Connection is healing.",
      icon: Heart,
    },
    {
      title: "Practice Mindfulness",
      description:
        "Spend 10 minutes daily in meditation or deep breathing exercises.",
      icon: Brain,
    },
    {
      title: "Move Your Body",
      description:
        "Physical activity boosts mood. Even a short walk helps significantly.",
      icon: Zap,
    },
    {
      title: "Celebrate Progress",
      description:
        "Your 7-day streak shows commitment to your wellness journey!",
      icon: Trophy,
    },
  ];

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              📊 Your Wellness Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your emotional journey and wellness progress over time
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Avg Mood Score
                  </p>
                  <p className="text-3xl font-bold text-wellness-600">
                    {stats.averageMood}/10
                  </p>
                </div>
                <div className="text-3xl">😊</div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Chats
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {stats.totalChats}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Journal Entries
                  </p>
                  <p className="text-3xl font-bold text-secondary">
                    {stats.journalEntries}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-secondary opacity-50" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {stats.currentStreak} days
                  </p>
                </div>
                <Zap className="h-8 w-8 text-accent opacity-50" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Best Day
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {stats.bestMoodDay}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-wellness-500 opacity-50" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Mood Trend Chart */}
            <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Mood Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    cursor={{ stroke: "var(--primary)", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moodScore"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: "var(--primary)", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Emotion Distribution */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Top Emotions
              </h2>
              <div className="space-y-3">
                {emotionStats.map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {stat.emotion}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {stat.count}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(stat.count / 30) * 100}%`,
                          backgroundColor: stat.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Chart */}
          <div className="bg-card rounded-lg p-6 border border-border mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Emotion Distribution (Last 30 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="var(--primary)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Wellness Tips */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              💚 Wellness Tips For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wellnessTips.map((tip, i) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={i}
                    className="bg-gradient-wellness rounded-lg p-6 border border-wellness-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-wellness-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {tip.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights Section */}
          <div className="bg-primary text-primary-foreground rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🎯 Your Insights</h2>
            <div className="space-y-3">
              <p>
                ✅ You've maintained a 7-day streak! This shows real commitment
                to your wellness.
              </p>
              <p>
                ✅ Your mood peaked on Friday with a score of 8/10. What helped
                you feel better that day?
              </p>
              <p>
                ✅ You experience joy and love emotions 39% of the time - that's
                wonderful!
              </p>
              <p>
                ✅ Consider exploring anxiety management techniques on Mondays,
                when your mood dips slightly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
