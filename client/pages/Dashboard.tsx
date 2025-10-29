import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { TrendingUp, Heart, Brain, Zap, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function Dashboard() {
  const {
    moodEntries,
    getAverageMood,
    getTotalChats,
    journalEntries,
    getCurrentStreak,
    getEmotionStats,
  } = useAppContext();

  const averageMood = getAverageMood();
  const totalChats = getTotalChats();
  const currentStreak = getCurrentStreak();
  const emotionStats = getEmotionStats();

  // Prepare data for charts
  const chartData = moodEntries.map((entry) => ({
    name: entry.date,
    mood: entry.mood,
    messageCount: entry.messageCount || 0,
  }));

  const emotionChartData = emotionStats.slice(0, 6).map((stat) => ({
    name: stat.emotion.substring(0, 6), // Truncate for mobile
    fullName: stat.emotion,
    value: stat.count,
  }));

  // Calculate mood trend
  const moodTrend =
    moodEntries.length >= 2
      ? moodEntries[0].mood - moodEntries[moodEntries.length - 1].mood
      : 0;

  const wellnessTips = [
    {
      title: "Stay Connected",
      description: "Reach out to friends and family regularly. Connection is healing.",
      icon: Heart,
      color: "from-pink-50 to-rose-50",
    },
    {
      title: "Practice Mindfulness",
      description: "Spend 10 minutes daily in meditation or deep breathing exercises.",
      icon: Brain,
      color: "from-purple-50 to-indigo-50",
    },
    {
      title: "Move Your Body",
      description: "Physical activity boosts mood. Even a short walk helps significantly.",
      icon: Zap,
      color: "from-orange-50 to-amber-50",
    },
    {
      title: "Celebrate Progress",
      description: `Your ${currentStreak}-day streak shows commitment to your wellness journey!`,
      icon: Trophy,
      color: "from-yellow-50 to-lime-50",
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
            {/* Average Mood */}
            <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">Avg Mood</p>
                {moodTrend > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className="text-4xl font-bold text-wellness-600 mb-1">
                {averageMood}
              </p>
              <p className="text-xs text-muted-foreground">out of 10</p>
            </div>

            {/* Total Chats */}
            <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">Chats</p>
                <Brain className="h-5 w-5 text-primary opacity-60" />
              </div>
              <p className="text-4xl font-bold text-primary mb-1">
                {totalChats}
              </p>
              <p className="text-xs text-muted-foreground">
                conversations with MindCare
              </p>
            </div>

            {/* Journal Entries */}
            <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">Entries</p>
                <Heart className="h-5 w-5 text-secondary opacity-60" />
              </div>
              <p className="text-4xl font-bold text-secondary mb-1">
                {journalEntries.length}
              </p>
              <p className="text-xs text-muted-foreground">reflections</p>
            </div>

            {/* Current Streak */}
            <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">Streak</p>
                <Zap className="h-5 w-5 text-accent opacity-60" />
              </div>
              <p className="text-4xl font-bold text-accent mb-1">
                {currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">days active</p>
            </div>

            {/* Best Day */}
            <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground font-medium">Peak Day</p>
                <Trophy className="h-5 w-5 text-wellness-500 opacity-60" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">
                {moodEntries.length > 0
                  ? moodEntries.reduce((max, entry) =>
                      entry.mood > max.mood ? entry : max
                    ).date
                  : "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">highest mood score</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Professional Mood Trend Chart */}
            <div className="lg:col-span-2 bg-card rounded-lg p-8 border border-border shadow-subtle">
              <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Mood Trend
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: "Mood Score", angle: -90, position: "insideLeft" }}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                    formatter={(value) => [`${value}/10`, "Mood"]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#moodGradient)"
                    dot={{
                      fill: "hsl(var(--primary))",
                      r: 6,
                      strokeWidth: 2,
                      stroke: "hsl(var(--card))",
                    }}
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Emotions */}
            <div className="bg-card rounded-lg p-8 border border-border shadow-subtle">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Top Emotions
              </h2>
              <div className="space-y-4">
                {emotionStats.slice(0, 5).map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {stat.emotion}
                      </span>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {stat.count}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{
                          width: `${(stat.count / Math.max(...emotionStats.map(s => s.count), 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Distribution Chart - Improved Bar Chart */}
          <div className="bg-card rounded-lg p-8 border border-border shadow-subtle mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              Emotion Distribution (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={emotionChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  formatter={(value, name, props) => [
                    value,
                    props.payload.fullName,
                  ]}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
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
                    className={`bg-gradient-to-br ${tip.color} rounded-lg p-6 border border-wellness-200 hover:shadow-md-wellness transition-shadow`}
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
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg p-8 shadow-md-wellness">
            <h2 className="text-2xl font-bold mb-4">🎯 Your Insights</h2>
            <div className="space-y-3">
              {averageMood >= 7 && (
                <p>
                  ✅ Excellent work! Your average mood is {averageMood}/10. Keep
                  up this positive momentum!
                </p>
              )}
              {averageMood >= 5 && averageMood < 7 && (
                <p>
                  ✅ You're doing well with an average mood of {averageMood}/10.
                  Small improvements in daily habits can boost this further.
                </p>
              )}
              {averageMood < 5 && (
                <p>
                  💙 Your mood is averaging {averageMood}/10. Consider increasing
                  positive activities and reaching out for support.
                </p>
              )}

              {currentStreak >= 5 && (
                <p>
                  🔥 Amazing streak of {currentStreak} days! This consistency shows
                  real commitment to your wellness.
                </p>
              )}

              {emotionStats[0] && (
                <p>
                  🎯 Your most frequent emotion is{" "}
                  <strong>{emotionStats[0].emotion}</strong>. Explore what triggers
                  this and how you can nurture it.
                </p>
              )}

              <p>
                📊 You've had {totalChats} conversations with MindCare and{" "}
                {journalEntries.length} journal entries. Your wellness data is
                helping you understand yourself better!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
