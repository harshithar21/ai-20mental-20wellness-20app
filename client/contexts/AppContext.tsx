import React, { createContext, useContext, useState, ReactNode } from "react";

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  emotion: string;
  sentiment: string;
  messageCount?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  moodRating: number;
  moodTag: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  emotion?: string;
  sentiment?: string;
  severity?: string;
  intent?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  privacyLevel: "public" | "private" | "friends";
}

interface AppContextType {
  // Mood & Analytics
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  updateMoodEntry: (id: string, entry: Partial<MoodEntry>) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;

  // Chat History
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Stats
  getTotalChats: () => number;
  getAverageMood: () => number;
  getCurrentStreak: () => number;
  getEmotionStats: () => Array<{ emotion: string; count: number }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize with sample data
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: "m1", date: "Monday", mood: 6, emotion: "joy", sentiment: "positive", messageCount: 5 },
    { id: "m2", date: "Tuesday", mood: 5, emotion: "anxiety", sentiment: "negative", messageCount: 3 },
    { id: "m3", date: "Wednesday", mood: 7, emotion: "calm", sentiment: "positive", messageCount: 6 },
    { id: "m4", date: "Thursday", mood: 5, emotion: "stress", sentiment: "negative", messageCount: 4 },
    { id: "m5", date: "Friday", mood: 8, emotion: "joy", sentiment: "positive", messageCount: 8 },
    { id: "m6", date: "Saturday", mood: 7, emotion: "love", sentiment: "positive", messageCount: 7 },
    { id: "m7", date: "Sunday", mood: 6, emotion: "neutral", sentiment: "neutral", messageCount: 4 },
  ]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      id: "j1",
      date: "Jan 15, 2024",
      title: "Great day at work",
      content: "Today was productive. I completed the project I was working on and got positive feedback from my team. Feeling accomplished and grateful.",
      moodRating: 7,
      moodTag: "Excellent",
    },
    {
      id: "j2",
      date: "Jan 14, 2024",
      title: "Feeling anxious",
      content: "Had a difficult conversation today. Feeling anxious about the outcome, but I'm trying to trust the process. Went for a walk which helped.",
      moodRating: 4,
      moodTag: "Okay",
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "c1",
      text: "Hello! I'm MindCare, your AI wellness companion. I'm here to listen and support you. What's on your mind today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "👩‍🦰",
    theme: "light",
    notificationsEnabled: true,
    privacyLevel: "private",
  });

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [entry, ...prev]);
  };

  const updateMoodEntry = (id: string, updates: Partial<MoodEntry>) => {
    setMoodEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);
  };

  const clearChatHistory = () => {
    setChatMessages([]);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const getTotalChats = () => chatMessages.length;

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const sum = moodEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / moodEntries.length) * 10) / 10;
  };

  const getCurrentStreak = () => {
    // Calculate streak from journal entries (consecutive days)
    if (journalEntries.length === 0) return 0;
    // For now, return a fixed value; in production, calculate from actual dates
    return Math.min(journalEntries.length, 7);
  };

  const getEmotionStats = () => {
    const stats: Record<string, number> = {};
    moodEntries.forEach((entry) => {
      stats[entry.emotion] = (stats[entry.emotion] || 0) + 1;
    });

    return Object.entries(stats)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <AppContext.Provider
      value={{
        moodEntries,
        addMoodEntry,
        updateMoodEntry,
        journalEntries,
        addJournalEntry,
        deleteJournalEntry,
        updateJournalEntry,
        chatMessages,
        addChatMessage,
        clearChatHistory,
        userProfile,
        updateUserProfile,
        getTotalChats,
        getAverageMood,
        getCurrentStreak,
        getEmotionStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
