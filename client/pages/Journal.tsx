import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Heart, Save, Flame, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
];

const moodOptions = [
  { value: 1, label: "😢 Terrible", color: "bg-red-100 text-red-800" },
  { value: 2, label: "😟 Poor", color: "bg-orange-100 text-orange-800" },
  { value: 3, label: "😕 Bad", color: "bg-amber-100 text-amber-800" },
  { value: 4, label: "😐 Okay", color: "bg-yellow-100 text-yellow-800" },
  { value: 5, label: "🙂 Good", color: "bg-lime-100 text-lime-800" },
  { value: 6, label: "😊 Great", color: "bg-wellness-100 text-wellness-800" },
  { value: 7, label: "😄 Excellent", color: "bg-green-100 text-green-800" },
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "Jan 15, 2024",
      title: "Great day at work",
      content:
        "Today was productive. I completed the project I was working on and got positive feedback from my team. Feeling accomplished and grateful.",
      moodRating: 7,
      moodTag: "Excellent",
    },
    {
      id: "2",
      date: "Jan 14, 2024",
      title: "Feeling anxious",
      content:
        "Had a difficult conversation today. Feeling anxious about the outcome, but I'm trying to trust the process. Went for a walk which helped.",
      moodRating: 4,
      moodTag: "Okay",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [moodRating, setMoodRating] = useState(6);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const streak = 7;
  const totalEntries = entries.length;

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

      setEntries([newEntry, ...entries]);
      setTitle("");
      setContent("");
      setMoodRating(6);
      setShowForm(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const getMoodColor = (rating: number) => {
    return moodOptions[rating - 1]?.color || "bg-gray-100 text-gray-800";
  };

  const nextPrompt = () => {
    setCurrentPromptIndex(
      (prev) => (prev + 1) % reflectionPrompts.length
    );
  };

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              📝 Your Journal & Reflections
            </h1>
            <p className="text-muted-foreground">
              Write your thoughts, track your mood, and celebrate your progress
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Entries
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {totalEntries}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {streak} days
                  </p>
                </div>
                <Flame className="h-8 w-8 text-accent opacity-50" />
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Avg Mood
                  </p>
                  <p className="text-3xl font-bold text-wellness-600">5.5/7</p>
                </div>
                <Heart className="h-8 w-8 text-wellness-600 opacity-50" />
              </div>
            </div>
          </div>

          {/* New Entry Form */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-8 h-12 bg-primary hover:bg-wellness-600 text-primary-foreground text-lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Start a New Journal Entry
            </Button>
          )}

          {showForm && (
            <Card className="mb-8 p-6 bg-card border-wellness-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  New Journal Entry
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Reflection Prompt */}
              <div className="mb-6 p-4 bg-wellness-50 rounded-lg border border-wellness-200">
                <p className="text-sm text-muted-foreground mb-2">
                  💡 Reflection Prompt
                </p>
                <p className="text-lg text-foreground font-medium mb-3">
                  "{reflectionPrompts[currentPromptIndex]}"
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPrompt}
                  className="text-xs"
                >
                  Next Prompt
                </Button>
              </div>

              {/* Title Input */}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Entry Title
                </label>
                <Input
                  placeholder="Give your entry a title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Mood Rating */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  How are you feeling?
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setMoodRating(mood.value)}
                      className={`py-2 px-1 rounded-lg font-medium text-xs transition-all ${
                        moodRating === mood.value
                          ? `${mood.color} ring-2 ring-primary`
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {mood.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Thoughts
                </label>
                <Textarea
                  placeholder="Write freely here. There's no judgment, only reflection and growth..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-48 p-3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddEntry}
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11"
                >
                  <Save className="h-4 w-4" />
                  Save Entry
                </Button>
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Journal Entries List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Your Entries
            </h2>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No entries yet. Start journaling to build your wellness habit!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    className="p-6 hover:shadow-md-wellness transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>

                    {/* Mood Badge */}
                    <div className="mb-3">
                      <Badge
                        className={`${getMoodColor(entry.moodRating)} cursor-default`}
                        variant="secondary"
                      >
                        {moodOptions[entry.moodRating - 1].label}
                      </Badge>
                    </div>

                    {/* Content */}
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {entry.content}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Journaling Tips */}
          <div className="mt-12 bg-gradient-wellness rounded-lg p-8 border border-wellness-200">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              💚 Tips for Better Journaling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="text-2xl">✍️</div>
                <div>
                  <p className="font-semibold text-foreground">Be Honest</p>
                  <p className="text-sm text-muted-foreground">
                    Your journal is a safe space. Write what you truly feel.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <p className="font-semibold text-foreground">Be Specific</p>
                  <p className="text-sm text-muted-foreground">
                    Focus on specific situations and feelings, not generalizations.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="font-semibold text-foreground">Be Present</p>
                  <p className="text-sm text-muted-foreground">
                    Write while the feelings and memories are fresh.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🌱</div>
                <div>
                  <p className="font-semibold text-foreground">Be Kind</p>
                  <p className="text-sm text-muted-foreground">
                    Treat yourself with compassion as you reflect on your day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
