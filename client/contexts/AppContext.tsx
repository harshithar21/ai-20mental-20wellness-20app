import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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

  // Loading state
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default user profile
const defaultUserProfile: UserProfile = {
  name: "User",
  email: "user@example.com",
  avatar: "👤",
  theme: "light",
  notificationsEnabled: true,
  privacyLevel: "private",
};

// Storage key
const STORAGE_KEY = "mindcare_app_data";

interface StoredData {
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  chatMessages: ChatMessage[];
  userProfile: UserProfile;
}

function getStoredData(): StoredData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert timestamp strings back to dates
      if (parsed.chatMessages) {
        parsed.chatMessages = parsed.chatMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error("Error loading stored data:", error);
  }

  // Return empty data structure if nothing stored
  return {
    moodEntries: [],
    journalEntries: [],
    chatMessages: [],
    userProfile: defaultUserProfile,
  };
}

function saveDataToStorage(data: StoredData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = getStoredData();
    setMoodEntries(stored.moodEntries);
    setJournalEntries(stored.journalEntries);
    setChatMessages(stored.chatMessages);
    setUserProfile(stored.userProfile);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      saveDataToStorage({
        moodEntries,
        journalEntries,
        chatMessages,
        userProfile,
      });
    }
  }, [moodEntries, journalEntries, chatMessages, userProfile, isLoading]);

  const addMoodEntry = (entry: MoodEntry) => {
    setMoodEntries((prev) => [entry, ...prev]);
  };

  const updateMoodEntry = (id: string, updates: Partial<MoodEntry>) => {
    setMoodEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
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
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
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
    if (journalEntries.length === 0) return 0;
    return Math.min(journalEntries.length, 365); // Max 365 days
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

  // Don't render until data is loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">💙</div>
          <p className="text-muted-foreground">Loading MindCare...</p>
        </div>
      </div>
    );
  }

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
        isLoading: false,
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
