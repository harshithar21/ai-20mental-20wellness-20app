import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Heart, Save, Flame, Calendar, Trash2, Edit2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/contexts/AppContext";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  moodRating: number;
  moodTag: string;
}

const reflectionPrompts = [
  "What made me smile today?",
  "What challenged me today, and how did I handle it?",
  "What am I grateful for right now?",
  "How did I show kindness to myself today?",
  "What emotion did I feel most strongly today?",
  "What do I want to remember about today?",
  "What would make tomorrow better?",
  "How did I take care of my mental health today?",
  "What was a moment of peace or calm today?",
  "What did I learn about myself today?",
];

const moodOptions = [
  { value: 1, label: "😢 Terrible", color: "bg-red-100 text-red-800 border-red-300" },
  { value: 2, label: "😟 Poor", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { value: 3, label: "😕 Bad", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: 4, label: "😐 Okay", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: 5, label: "🙂 Good", color: "bg-lime-100 text-lime-800 border-lime-300" },
  { value: 6, label: "😊 Great", color: "bg-wellness-100 text-wellness-800 border-wellness-300" },
  { value: 7, label: "😄 Excellent", color: "bg-green-100 text-green-800 border-green-300" },
];

export default function Journal() {
  const {
    journalEntries,
    addJournalEntry,
    deleteJournalEntry,
    getCurrentStreak,
  } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodRating, setMoodRating] = useState(6);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const streak = getCurrentStreak();
  const totalEntries = journalEntries.length;
  const averageMood = journalEntries.length > 0
    ? Math.round((journalEntries.reduce((sum, e) => sum + e.moodRating, 0) / journalEntries.length) * 10) / 10
    : 0;

  const handleAddEntry = () => {
    if (title.trim() || content.trim()) {
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: today,
        title: title || "Untitled Entry",
        content,
        moodRating,
        moodTag: moodOptions[moodRating - 1].label.split(" ")[1],
      };

      addJournalEntry(newEntry);
      resetForm();
      alert("✅ Entry saved! Great job documenting your feelings.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMoodRating(6);
    setShowForm(false);
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      deleteJournalEntry(id);
      alert("Entry deleted.");
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMoodRating(entry.moodRating);
    setEditingId(entry.id);
    setShowForm(true);
  };

  const getMoodColor = (rating: number) => {
    return moodOptions[rating - 1]?.color || "bg-gray-100 text-gray-800";
  };

  const nextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % reflectionPrompts.length);
  };

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-wellness-50/30">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              📝 Your Journal & Reflections
            </h1>
            <p className="text-lg text-muted-foreground">
              Write your thoughts, track your mood, and celebrate your progress
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Card className="p-6 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    Total Entries
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {totalEntries}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    Current Streak
                  </p>
                  <p className="text-4xl font-bold text-accent">
                    {streak}
                  </p>
                  <p className="text-xs text-muted-foreground">days active</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Flame className="h-8 w-8 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-semibold mb-2">
                    Average Mood
                  </p>
                  <p className="text-4xl font-bold text-wellness-600">
                    {averageMood}
                  </p>
                  <p className="text-xs text-muted-foreground">out of 7</p>
                </div>
                <div className="p-3 bg-wellness-100 rounded-lg">
                  <Heart className="h-8 w-8 text-wellness-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* New/Edit Entry Form */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-10 h-13 bg-primary hover:bg-wellness-600 text-primary-foreground text-base font-semibold shadow-md hover:shadow-lg transition-all gap-2"
            >
              <Heart className="h-5 w-5" />
              Start a New Journal Entry
            </Button>
          )}

          {showForm && (
            <Card className="mb-10 p-8 bg-gradient-to-br from-card to-card/50 border-wellness-200/50 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {editingId ? "Edit Entry" : "New Journal Entry"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Reflection Prompt */}
              <div className="mb-8 p-5 bg-wellness-50 rounded-xl border border-wellness-200">
                <p className="text-xs text-wellness-700 font-semibold mb-2 uppercase">
                  💡 Reflection Prompt
                </p>
                <p className="text-lg text-foreground font-semibold mb-4 italic">
                  "{reflectionPrompts[currentPromptIndex]}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPrompt}
                  className="text-xs font-semibold"
                >
                  Next Prompt
                </Button>
              </div>

              {/* Title Input */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Entry Title
                </label>
                <Input
                  placeholder="Give your entry a title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 text-base bg-card border-border/50 focus:border-primary"
                />
              </div>

              {/* Mood Rating */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-foreground mb-4 block">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setMoodRating(mood.value)}
                      className={`py-3 px-1 rounded-lg font-semibold text-sm transition-all border-2 ${
                        moodRating === mood.value
                          ? `${mood.color} ring-2 ring-primary`
                          : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                      }`}
                    >
                      {mood.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mb-8">
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Your Thoughts
                </label>
                <Textarea
                  placeholder="Write freely here. There's no judgment, only reflection and growth. Share your feelings, thoughts, and experiences..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-56 p-4 text-base bg-card border-border/50 focus:border-primary resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddEntry}
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11 font-semibold text-base"
                >
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 h-11 font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Journal Entries List */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Your Entries {totalEntries > 0 && `(${totalEntries})`}
              </h2>
              {totalEntries > 0 && (
                <Badge className="bg-primary/10 text-primary border-primary/30">
                  ✨ Keep going!
                </Badge>
              )}
            </div>

            {journalEntries.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border/50 shadow-sm">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-4 font-medium">
                  No entries yet. Start journaling to build your wellness habit!
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Journaling helps you process emotions, track patterns, and celebrate growth.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="p-6 hover:shadow-md-wellness transition-all border-border/50 shadow-sm group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {entry.date}
                          </p>
                          <Badge
                            className={`${getMoodColor(entry.moodRating)} cursor-default border-2`}
                            variant="secondary"
                          >
                            {moodOptions[entry.moodRating - 1].label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit entry"
                        >
                          <Edit2 className="h-4 w-4 text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                      {entry.content}
                    </p>

                    {/* Read More Link */}
                    <button className="text-sm text-primary hover:text-wellness-600 font-semibold flex items-center gap-1 transition-colors">
                      Read more <ChevronRight className="h-3 w-3" />
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Journaling Tips */}
          <Card className="p-8 bg-gradient-to-br from-wellness-50 to-primary/5 border-wellness-200 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              💚 Tips for Better Journaling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  emoji: "✍️",
                  title: "Be Honest",
                  desc: "Your journal is a safe space. Write what you truly feel, not what you think you should feel.",
                },
                {
                  emoji: "🎯",
                  title: "Be Specific",
                  desc: "Focus on specific situations and feelings instead of generalizations. Details matter.",
                },
                {
                  emoji: "📍",
                  title: "Be Present",
                  desc: "Write while the feelings and memories are fresh. This captures authenticity.",
                },
                {
                  emoji: "🌱",
                  title: "Be Kind",
                  desc: "Treat yourself with compassion as you reflect. You're on a growth journey.",
                },
                {
                  emoji: "🔄",
                  title: "Be Consistent",
                  desc: "Regular journaling builds self-awareness. Even 5 minutes daily makes a difference.",
                },
                {
                  emoji: "🎨",
                  title: "Be Creative",
                  desc: "Don't just write. Draw, use prompts, or write poetry. Make it enjoyable.",
                },
              ].map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/50 rounded-lg border border-wellness-200/50">
                  <div className="text-3xl flex-shrink-0">{tip.emoji}</div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{tip.title}</p>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
