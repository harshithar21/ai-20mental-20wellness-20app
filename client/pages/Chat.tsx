import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertTriangle, Lightbulb, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analyzeText } from "@/services/huggingface";
import { detectCrisis } from "@/services/crisisEngine";
import {
  getSupportiveResponse,
  getWellnessSuggestion,
} from "@/services/supportiveResponses";

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
}

const emotionColors: Record<string, string> = {
  sadness: "bg-blue-100 text-blue-800",
  anger: "bg-red-100 text-red-800",
  anxiety: "bg-orange-100 text-orange-800",
  loneliness: "bg-purple-100 text-purple-800",
  joy: "bg-yellow-100 text-yellow-800",
  stress: "bg-rose-100 text-rose-800",
  confusion: "bg-amber-100 text-amber-800",
  fear: "bg-indigo-100 text-indigo-800",
  neutral: "bg-gray-100 text-gray-800",
  love: "bg-pink-100 text-pink-800",
  surprise: "bg-cyan-100 text-cyan-800",
  disgust: "bg-green-100 text-green-800",
};

const sentimentColors: Record<string, string> = {
  positive: "bg-wellness-100 text-wellness-700",
  neutral: "bg-gray-100 text-gray-700",
  negative: "bg-red-100 text-red-700",
};

const severityColors: Record<string, string> = {
  normal: "bg-green-100 text-green-700",
  moderate: "bg-amber-100 text-amber-700",
  crisis: "bg-red-100 text-red-700",
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm MindCare, your AI wellness companion. I'm here to listen and support you. What's on your mind today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [crisisActive, setCrisisActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      // Analyze text using HuggingFace and keyword rules
      const analysis = await analyzeText(userInput);
      const crisisCheck = detectCrisis(userInput);

      // Check if this is a crisis situation
      if (crisisCheck.isCrisis) {
        setCrisisActive(true);

        // Show crisis response immediately
        const crisisMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: crisisCheck.emergencyResponse,
          sender: "ai",
          timestamp: new Date(),
          emotion: analysis.emotion,
          sentiment: analysis.sentiment,
          severity: "crisis",
          isCrisis: true,
        };

        setMessages((prev) => [...prev, crisisMessage]);
        setIsLoading(false);
        return;
      }

      // Get supportive response based on emotion and intent
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
        isCrisis: false,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If moderate severity, add a follow-up wellness message
      if (crisisCheck.severity === "moderate") {
        const wellnessMsg: Message = {
          id: (Date.now() + 2).toString(),
          text: `💚 ${getWellnessSuggestion(analysis.emotion)}`,
          sender: "ai",
          timestamp: new Date(),
          emotion: analysis.emotion,
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, wellnessMsg]);
        }, 800);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing your message right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
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
                  Available 24/7 • Free & Confidential • No judgment
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  They are trained to help and want to listen to you.
                </p>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-foreground mb-3">
                  Let's Ground You Now:
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">5</span>
                    <span>things you can see around you</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">4</span>
                    <span>things you can touch</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">3</span>
                    <span>things you can hear</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">2</span>
                    <span>things you can smell</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 mt-0.5">1</span>
                    <span>thing you can taste</span>
                  </p>
                </div>
                <p className="text-xs text-blue-600 mt-3 italic">
                  This brings you back to the present moment. You're safe right
                  now.
                </p>
              </div>

              <div className="space-y-2 mb-6">
                <p className="font-semibold text-foreground text-sm">
                  Also Consider:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>💙 Call a trusted friend or family member</li>
                  <li>🏥 Go to your nearest emergency room</li>
                  <li>📱 Text "HELLO" to 741741 (Crisis Text Line)</li>
                </ul>
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
        <div className="container mx-auto h-screen max-w-4xl flex flex-col px-4 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-border">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Talk with MindCare
            </h1>
            <p className="text-muted-foreground mt-1">
              Share your thoughts and feelings. I'm here to listen.
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-3 rounded-xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border rounded-bl-none"
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.text}</p>

                  {/* Tags for AI messages */}
                  {message.sender === "ai" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.emotion && (
                        <Badge
                          className={`${
                            emotionColors[message.emotion.toLowerCase()] ||
                            emotionColors.neutral
                          } cursor-default`}
                          variant="secondary"
                        >
                          {message.emotion}
                        </Badge>
                      )}
                      {message.sentiment && (
                        <Badge
                          className={`${
                            sentimentColors[message.sentiment.toLowerCase()] ||
                            sentimentColors.neutral
                          } cursor-default`}
                          variant="secondary"
                        >
                          {message.sentiment}
                        </Badge>
                      )}
                      {message.severity && (
                        <Badge
                          className={`${
                            severityColors[message.severity.toLowerCase()] ||
                            severityColors.normal
                          } cursor-default`}
                          variant="secondary"
                        >
                          {message.severity}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border px-4 py-3 rounded-xl rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse"></div>
                    <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-100"></div>
                    <div className="h-3 w-3 rounded-full bg-muted-foreground animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Wellness Tips - Dynamic based on recent messages */}
          {!crisisActive && (
            <div className="mb-6 p-4 bg-wellness-50 border border-wellness-200 rounded-lg flex gap-3">
              <Lightbulb className="h-5 w-5 text-wellness-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-wellness-700 mb-1">
                  💚 Wellness Reminder
                </p>
                <p className="text-wellness-600">
                  {messages.length > 1 && messages[messages.length - 1].sender === "ai"
                    ? messages[messages.length - 1].emotion
                      ? getWellnessSuggestion(messages[messages.length - 1].emotion || "neutral")
                      : "Remember to take care of yourself. You deserve compassion, especially from yourself."
                    : "Taking care of your mental health is important. You're doing great by reaching out."}
                </p>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 h-11"
              disabled={isLoading || crisisActive}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || crisisActive}
              className="bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11 px-4 sm:px-6"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
