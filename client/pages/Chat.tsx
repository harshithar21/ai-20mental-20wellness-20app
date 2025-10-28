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
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI analysis and response
    setTimeout(() => {
      // TODO: Integrate HuggingFace API for emotion/sentiment detection
      const emotion = ["sadness", "joy", "anxiety"][
        Math.floor(Math.random() * 3)
      ];
      const sentiment = ["positive", "negative", "neutral"][
        Math.floor(Math.random() * 3)
      ];
      const severity = ["normal", "moderate"][Math.floor(Math.random() * 2)];

      // Check for crisis keywords (simplified)
      const crisisKeywords = [
        "suicide",
        "kill myself",
        "no point",
        "end it",
      ];
      const isCrisis = crisisKeywords.some((keyword) =>
        input.toLowerCase().includes(keyword)
      );

      if (isCrisis) {
        setCrisisActive(true);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: isCrisis
          ? "I hear that you're going through something very difficult right now. Your life has value, and there are people who want to help. Please reach out to the crisis support number below. You're not alone."
          : `Thank you for sharing that with me. I can sense you're feeling ${emotion}. I'm here to listen and support you. Would you like to talk more about what you're experiencing?`,
        sender: "ai",
        timestamp: new Date(),
        emotion,
        sentiment,
        severity,
        isCrisis,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        {/* Crisis Alert */}
        {crisisActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-lg border-2 border-crisis">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-crisis" />
                <h2 className="text-xl font-bold text-foreground">
                  We Care About You
                </h2>
              </div>

              <p className="text-muted-foreground mb-6">
                If you're having thoughts of suicide, please reach out for help
                immediately. You're not alone, and support is available.
              </p>

              <div className="space-y-3 mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-foreground">Crisis Support:</p>
                <p className="text-lg font-bold text-crisis">
                  AASRA: +91 9820466726
                </p>
                <p className="text-sm text-muted-foreground">
                  Available 24/7. Your call is free and confidential.
                </p>
              </div>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  Grounding Techniques:
                </p>
                <ul className="space-y-1">
                  <li>
                    • Name 5 things you can see around you right now
                  </li>
                  <li>
                    • Feel your feet on the ground, take slow breaths
                  </li>
                  <li>
                    • Hold an ice cube or splash cold water on your face
                  </li>
                  <li>
                    • Call a trusted friend or family member
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setCrisisActive(false)}
                className="w-full bg-primary hover:bg-wellness-600"
              >
                I'm Safe for Now
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

          {/* Wellness Tips */}
          {!crisisActive && (
            <div className="mb-6 p-4 bg-wellness-50 border border-wellness-200 rounded-lg flex gap-3">
              <Lightbulb className="h-5 w-5 text-wellness-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-wellness-700 mb-1">
                  Wellness Tip
                </p>
                <p className="text-wellness-600">
                  Taking deep breaths can help calm your nervous system. Try
                  breathing in for 4 counts, holding for 4, and exhaling for 4.
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
