// HuggingFace API service for emotion and sentiment analysis
// Uses advanced models: GoEmotions and Twitter RoBERTa sentiment

const HF_API_TOKEN = process.env.VITE_HF_API_TOKEN || "";

export interface EmotionAnalysisResult {
  emotion: string;
  sentiment: string;
  severity: "normal" | "moderate" | "crisis";
  intent: string;
  confidence: number;
}

// GoEmotions emotion categories
const EMOTION_LABELS = {
  sadness: "sadness",
  joy: "joy",
  anger: "anger",
  fear: "fear",
  disgust: "disgust",
  surprise: "surprise",
  love: "love",
  neutral: "neutral",
  anxiety: "anxiety",
  loneliness: "loneliness",
  stress: "stress",
  confusion: "confusion",
};

// Crisis severity keywords - HIGH RISK
const CRISIS_KEYWORDS = [
  "kill myself",
  "suicide",
  "die",
  "end my life",
  "worthless",
  "no reason to live",
  "cut myself",
  "jump off",
  "self harm",
  "hurt myself",
];

// Moderate warning keywords
const MODERATE_KEYWORDS = [
  "depressed",
  "hopeless",
  "scared",
  "lonely",
  "anxious",
  "panic",
  "stress",
  "crying",
  "broken",
];

// Intent classification rules
const INTENT_PATTERNS = {
  ask_advice: [
    "what should i do",
    "suggest",
    "help me solve",
    "how can i",
    "what can i do",
    "advice",
    "tips",
  ],
  venting: [
    "i hate my life",
    "everything sucks",
    "everything is terrible",
    "why me",
    "fed up",
    "sick of",
  ],
  seeking_support: [
    "please help",
    "i need someone",
    "i feel",
    "im struggling",
    "i'm struggling",
    "help me",
    "support",
    "i need help",
  ],
  general: ["tell me", "what", "how", "why"],
};

// Detect crisis severity from keywords
function determineSeverity(text: string): "normal" | "moderate" | "crisis" {
  const lowerText = text.toLowerCase();

  // Check for crisis keywords first (highest priority)
  if (CRISIS_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
    return "crisis";
  }

  // Check for moderate keywords
  if (MODERATE_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
    return "moderate";
  }

  return "normal";
}

// Classify user intent
function detectIntent(text: string): string {
  const lowerText = text.toLowerCase();

  if (INTENT_PATTERNS.ask_advice.some((pattern) => lowerText.includes(pattern))) {
    return "ask_advice";
  }
  if (INTENT_PATTERNS.venting.some((pattern) => lowerText.includes(pattern))) {
    return "venting";
  }
  if (INTENT_PATTERNS.seeking_support.some((pattern) => lowerText.includes(pattern))) {
    return "seeking_support";
  }

  return "general_conversation";
}

// Map HuggingFace emotion labels to our standard emotions
function mapEmotionLabel(label: string): string {
  const lowerLabel = label.toLowerCase();

  // Direct matches
  if (EMOTION_LABELS[lowerLabel as keyof typeof EMOTION_LABELS]) {
    return lowerLabel;
  }

  // Map similar emotions
  const emotionMap: Record<string, string> = {
    admiration: "joy",
    amusement: "joy",
    approval: "joy",
    excitement: "joy",
    gratitude: "joy",
    pride: "joy",
    relief: "joy",
    trust: "love",
    caring: "love",
    desire: "love",
    remorse: "sadness",
    sorrow: "sadness",
    suffering: "sadness",
    shame: "sadness",
    grief: "sadness",
    disappointment: "sadness",
    embarrassment: "sadness",
    confusion: "confusion",
    realization: "confusion",
    optimism: "joy",
    nervousness: "anxiety",
    annoyance: "anger",
    disapproval: "anger",
  };

  return emotionMap[lowerLabel] || "neutral";
}

// Call HuggingFace Emotion API
async function getEmotionFromHF(text: string): Promise<{ emotion: string; confidence: number }> {
  try {
    if (!HF_API_TOKEN) {
      console.warn("HF_API_TOKEN not set, using fallback emotion detection");
      return { emotion: "neutral", confidence: 0 };
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/joeddav/distilbert-base-uncased-go-emotions-student",
      {
        headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const emotions = data[0] as Array<{ label: string; score: number }>;
      emotions.sort((a, b) => b.score - a.score);

      const topEmotion = emotions[0];
      const mappedEmotion = mapEmotionLabel(topEmotion.label);

      return {
        emotion: mappedEmotion,
        confidence: topEmotion.score,
      };
    }

    return { emotion: "neutral", confidence: 0 };
  } catch (error) {
    console.error("Error getting emotion from HF:", error);
    return { emotion: "neutral", confidence: 0 };
  }
}

// Call HuggingFace Sentiment API
async function getSentimentFromHF(text: string): Promise<string> {
  try {
    if (!HF_API_TOKEN) {
      console.warn("HF_API_TOKEN not set, using fallback sentiment detection");
      return "neutral";
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
      {
        headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const sentiments = data[0] as Array<{ label: string; score: number }>;
      sentiments.sort((a, b) => b.score - a.score);

      return sentiments[0].label.toLowerCase();
    }

    return "neutral";
  } catch (error) {
    console.error("Error getting sentiment from HF:", error);
    return "neutral";
  }
}

// Main analysis function
export async function analyzeText(text: string): Promise<EmotionAnalysisResult> {
  try {
    // Determine severity first (keyword-based, most reliable)
    const severity = determineSeverity(text);

    // Detect intent (keyword-based)
    const intent = detectIntent(text);

    // Get emotion and sentiment from HuggingFace (or fallback)
    const [emotionResult, sentiment] = await Promise.all([
      getEmotionFromHF(text),
      getSentimentFromHF(text),
    ]);

    return {
      emotion: emotionResult.emotion,
      sentiment,
      severity,
      intent,
      confidence: emotionResult.confidence,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);

    // Graceful fallback
    return {
      emotion: "neutral",
      sentiment: "neutral",
      severity: determineSeverity(text),
      intent: detectIntent(text),
      confidence: 0,
    };
  }
}
