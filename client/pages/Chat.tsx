import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  AlertTriangle,
  Lightbulb,
  Heart,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  Brain,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analyzeText } from "@/services/huggingface";
import { detectCrisis } from "@/services/crisisEngine";
import {
  getSupportiveResponse,
  getWellnessSuggestion,
} from "@/services/supportiveResponses";
import { useAppContext } from "@/contexts/AppContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  emotion?: string;
  sentiment?: string;
  severity?: string;
  intent?: string;
  isCrisis?: boolean;
  isTyping?: boolean;
}

const emotionEmojis: Record<string, string> = {
  sadness: "😢",
  anger: "😠",
  anxiety: "😟",
  loneliness: "🥺",
  joy: "😊",
  stress: "😰",
  confusion: "🤔",
  fear: "😨",
  neutral: "😐",
  love: "❤️",
  surprise: "😮",
  disgust: "🤢",
};

const suggestedPrompts = [
  "I'm feeling anxious about work",
  "I've had a great day!",
  "Help me manage my stress",
  "I need grounding techniques",
  "What can improve my mood?",
  "I'm struggling with loneliness",
];

const quickActions = [
  { icon: "😌", label: "Meditation Tips", query: "Can you give me meditation tips?" },
  { icon: "🎯", label: "Goal Setting", query: "Help me set realistic wellness goals" },
  { icon: "🌙", label: "Sleep Help", query: "I'm having trouble sleeping" },
  { icon: "💪", label: "Motivation", query: "I need motivation and encouragement" },
];

export default function Chat() {
  const { addChatMessage, moodEntries } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! 💙 I'm MindCare, your personal AI wellness companion. I'm here to listen, understand, and support you through anything you're feeling. Whether you're celebrating a win, working through a challenge, or just need someone to talk to—I'm here for you.\n\nShare what's on your mind, and I'll provide thoughtful, personalized support tailored to what you're experiencing. You're not alone in this journey.",
      sender: "ai",
      timestamp: new Date(),
      emotion: "joy",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || crisisActive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    // Add typing indicator
    const typingId = `typing-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        text: "",
        sender: "ai",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      const analysis = await analyzeText(userInput);
      const crisisCheck = detectCrisis(userInput);

      // Simulate realistic typing delay based on response length
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => m.id !== typingId));

      if (crisisCheck.isCrisis) {
        setCrisisActive(true);
        const crisisMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: crisisCheck.emergencyResponse,
          sender: "ai",
          timestamp: new Date(),
          severity: "crisis",
          isCrisis: true,
        };
        setMessages((prev) => [...prev, crisisMessage]);
        setIsLoading(false);
        return;
      }

      const supportiveResponse = getSupportiveResponse({
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        intent: analysis.intent,
        isCrisis: false,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: supportiveResponse,
        sender: "ai",
        timestamp: new Date(),
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        severity: crisisCheck.severity,
        intent: analysis.intent,
      };

      setMessages((prev) => [...prev, aiMessage]);
      addChatMessage({
        id: aiMessage.id,
        text: aiMessage.text,
        sender: "ai",
        timestamp: new Date(),
        emotion: analysis.emotion,
        sentiment: analysis.sentiment,
        severity: crisisCheck.severity,
      });

      // Add follow-up wellness message based on intent and emotion
      if (crisisCheck.severity === "moderate" || analysis.intent === "seeking_support") {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const wellnessMsg: Message = {
          id: (Date.now() + 2).toString(),
          text: `💚 **Wellness Tip:** ${getWellnessSuggestion(analysis.emotion)}\n\nRemember, reaching out is a sign of strength. You're taking steps to care for yourself, and that's wonderful.`,
          sender: "ai",
          timestamp: new Date(),
          emotion: analysis.emotion,
        };
        setMessages((prev) => [...prev, wellnessMsg]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => prev.filter((m) => m.id !== typingId));

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a moment of trouble processing that, but I'm here for you. Could you share what you're feeling in a different way? Or ask me anything else on your mind.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
  };

  const handleRetry = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const userMessage = messages[messageIndex - 1];
      if (userMessage.sender === "user") {
        setInput(userMessage.text);
        setMessages((prev) =>
          prev.slice(0, messageIndex - 1)
        );
      }
    }
  };

  const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
        {/* Crisis Alert */}
        {crisisActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border-2 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-7 w-7 text-red-600 animate-pulse" />
                <h2 className="text-2xl font-bold text-foreground">
                  You Matter & You're Not Alone
                </h2>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                I hear that you're going through something very difficult right now. Your life has real value, and there are people who want to help you. Please reach out to one of these resources immediately.
              </p>

              <div className="space-y-3 mb-6 p-5 bg-red-50 rounded-xl border border-red-200">
                <p className="font-bold text-foreground text-lg">
                  🆘 Crisis Support Helpline
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">AASRA (India)</p>
                    <p className="text-xl font-bold text-red-600">+91 9820466726</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">iCall (India)</p>
                    <p className="text-xl font-bold text-red-600">9152987821</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Available 24/7 • Free & Confidential
                </p>
              </div>

              <div className="space-y-3 mb-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-bold text-foreground">
                  📍 Grounding Exercise (5-4-3-2-1)
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>🔍 5 things you can <strong>see</strong></p>
                  <p>✋ 4 things you can <strong>touch</strong></p>
                  <p>👂 3 things you can <strong>hear</strong></p>
                  <p>👃 2 things you can <strong>smell</strong></p>
                  <p>👅 1 thing you can <strong>taste</strong></p>
                </div>
              </div>

              <Button
                onClick={() => setCrisisActive(false)}
                className="w-full bg-primary hover:bg-wellness-600 h-12 font-semibold text-base"
              >
                I'm Safe & Want to Talk
              </Button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="container mx-auto max-w-3xl flex-1 flex flex-col px-4 py-6">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-xl px-5 py-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none shadow-md hover:shadow-lg transition-shadow"
                      : message.isTyping
                      ? "bg-card border border-border rounded-bl-none"
                      : "bg-card border border-border rounded-bl-none shadow-sm hover:shadow-md transition-shadow"
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex gap-2 py-2">
                      <div className="h-3 w-3 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="h-3 w-3 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="h-3 w-3 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

                      {/* Emotion Tags */}
                      {message.sender === "ai" && !message.isTyping && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.emotion && (
                            <Badge
                              className="bg-primary/15 text-primary cursor-default gap-1 border-primary/30"
                              variant="secondary"
                            >
                              <span>{emotionEmojis[message.emotion] || "😐"}</span>
                              <span className="capitalize">{message.emotion}</span>
                            </Badge>
                          )}
                          {message.sentiment && (
                            <Badge
                              className={`cursor-default capitalize border ${
                                message.sentiment === "positive"
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : message.sentiment === "negative"
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                              variant="secondary"
                            >
                              {message.sentiment}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Message Actions */}
                      {message.sender === "ai" && !message.isTyping && (
                        <div className="mt-3 flex gap-1">
                          <button
                            onClick={() =>
                              handleCopyMessage(message.id, message.text)
                            }
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Copy message"
                          >
                            <Copy
                              className={`h-4 w-4 ${
                                copiedId === message.id
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() =>
                              setFeedback((prev) => ({
                                ...prev,
                                [message.id]: "up",
                              }))
                            }
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="This was helpful"
                          >
                            <ThumbsUp
                              className={`h-4 w-4 ${
                                feedback[message.id] === "up"
                                  ? "text-green-600 fill-green-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() =>
                              setFeedback((prev) => ({
                                ...prev,
                                [message.id]: "down",
                              }))
                            }
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Not helpful"
                          >
                            <ThumbsDown
                              className={`h-4 w-4 ${
                                feedback[message.id] === "down"
                                  ? "text-red-600 fill-red-600"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleRetry(message.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors ml-auto"
                            title="Regenerate response"
                          >
                            <RotateCcw className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts & Quick Actions - Show when no extended conversation */}
          {messages.length <= 2 && !isLoading && (
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  SUGGESTED TOPICS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="text-left p-3 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all text-sm text-foreground font-medium hover:shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2 font-semibold">
                  <Zap className="h-3 w-3" />
                  QUICK ACTIONS
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/50 transition-all text-xs font-medium text-foreground hover:shadow-sm"
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <span className="text-center">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Wellness Reminder */}
          {!crisisActive && messages.length > 4 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-wellness-50 to-primary/5 border border-wellness-200 rounded-xl flex gap-3 animate-fadeIn">
              <Lightbulb className="h-5 w-5 text-wellness-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-wellness-700 mb-1">💚 Wellness Reminder</p>
                <p className="text-wellness-600 text-xs">
                  You're doing great by exploring your feelings. Remember: small steps lead to big changes. Be patient and kind to yourself.
                </p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind... I'm here to listen 💙"
              className="flex-1 h-12 rounded-full pl-6 pr-4 text-base bg-card border-border/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
              disabled={isLoading || crisisActive}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || crisisActive}
              className="bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-12 px-7 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>

          {/* Status Indicator */}
          {isLoading && (
            <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-2 animate-fadeIn">
              <Brain className="h-3 w-3 animate-pulse" />
              <span>MindCare is thinking and understanding you...</span>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </Layout>
  );
}
