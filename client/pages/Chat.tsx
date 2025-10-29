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

export default function Chat() {
  const { addChatMessage } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! 💙 I'm MindCare, your AI wellness companion. I'm here to listen without judgment and support you through anything you're feeling. Whether you're celebrating a win, working through a challenge, or just need to talk—I'm here for you. What's on your mind today?",
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

      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

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

      // Add wellness tip for moderate severity
      if (crisisCheck.severity === "moderate") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const wellnessMsg: Message = {
          id: (Date.now() + 2).toString(),
          text: `💚 ${getWellnessSuggestion(analysis.emotion)}`,
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
        text: "I'm having trouble processing your message right now, but I'm still here for you. Please try again.",
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

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Crisis Alert */}
        {crisisActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg border-2 border-crisis">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-crisis animate-pulse" />
                <h2 className="text-xl font-bold text-foreground">
                  You Matter & You're Not Alone
                </h2>
              </div>

              <p className="text-muted-foreground mb-6">
                I hear that you're going through something very difficult right
                now. Your life has value, and there are people who want to help
                you.
              </p>

              <div className="space-y-3 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-foreground">
                  Crisis Support Helpline:
                </p>
                <p className="text-lg font-bold text-crisis">
                  📞 AASRA: +91 9820466726
                </p>
                <p className="text-sm text-muted-foreground">
                  Available 24/7 • Free & Confidential
                </p>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-foreground mb-3">
                  Grounding Exercise (5-4-3-2-1):
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>5 things you can <strong>see</strong></p>
                  <p>4 things you can <strong>touch</strong></p>
                  <p>3 things you can <strong>hear</strong></p>
                  <p>2 things you can <strong>smell</strong></p>
                  <p>1 thing you can <strong>taste</strong></p>
                </div>
              </div>

              <Button
                onClick={() => setCrisisActive(false)}
                className="w-full bg-primary hover:bg-wellness-600 h-11"
              >
                I'm Safe & Want to Talk
              </Button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="container mx-auto max-w-2xl flex-1 flex flex-col px-4 py-6">
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
                  className={`max-w-lg px-5 py-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none shadow-md"
                      : message.isTyping
                      ? "bg-card border border-border rounded-bl-none"
                      : "bg-card border border-border rounded-bl-none shadow-subtle"
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex gap-2 py-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-100"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-200"></div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed">{message.text}</p>

                      {/* Emotion Tags */}
                      {message.sender === "ai" && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.emotion && (
                            <Badge
                              className="bg-primary/10 text-primary cursor-default gap-1"
                              variant="secondary"
                            >
                              <span>{emotionEmojis[message.emotion] || "😐"}</span>
                              {message.emotion}
                            </Badge>
                          )}
                          {message.sentiment && (
                            <Badge
                              className={`cursor-default ${
                                message.sentiment === "positive"
                                  ? "bg-green-100 text-green-700"
                                  : message.sentiment === "negative"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
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
                        <div className="mt-3 flex gap-2">
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
                            <RotateCcw className="h-4 w-4 text-muted-foreground" />
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

          {/* Suggested Prompts - Show when no messages or at start */}
          {messages.length <= 1 && !isLoading && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Suggestions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-left p-3 rounded-lg bg-gradient-wellness border border-wellness-200 hover:border-wellness-400 hover:bg-wellness-100 transition-all text-sm text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wellness Reminder */}
          {!crisisActive && messages.length > 3 && (
            <div className="mb-6 p-4 bg-wellness-50 border border-wellness-200 rounded-lg flex gap-3">
              <Lightbulb className="h-5 w-5 text-wellness-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-wellness-700 mb-1">
                  💚 Wellness Reminder
                </p>
                <p className="text-wellness-600">
                  Remember to take breaks, stay hydrated, and be kind to
                  yourself. You're doing great by seeking support.
                </p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3 mt-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 h-11 rounded-full pl-6"
              disabled={isLoading || crisisActive}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || crisisActive}
              className="bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11 px-6 rounded-full"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>

          {/* Status Indicator */}
          {isLoading && (
            <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-2">
              <Brain className="h-3 w-3 animate-pulse" />
              MindCare is thinking...
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
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </Layout>
  );
}
