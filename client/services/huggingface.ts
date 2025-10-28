// HuggingFace API service for emotion and sentiment analysis
// Uses advanced models: GoEmotions and Twitter RoBERTa sentiment

const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || "";

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

// Fallback emotion detection using keywords
function detectEmotionFallback(text: string): string {
  const lowerText = text.toLowerCase();

  const emotionPatterns: Record<string, string[]> = {
    sadness: [
      "sad",
      "unhappy",
      "down",
      "depressed",
      "blue",
      "heartbroken",
      "miserable",
      "awful",
    ],
    joy: [
      "happy",
      "great",
      "love",
      "wonderful",
      "awesome",
      "excellent",
      "fantastic",
      "amazing",
    ],
    anger: ["angry", "mad", "furious", "enraged", "outraged", "hate"],
    anxiety: [
      "anxious",
      "nervous",
      "panic",
      "worried",
      "uneasy",
      "tense",
      "jittery",
    ],
    fear: ["afraid", "scared", "frightened", "terrified", "fearful"],
    loneliness: ["lonely", "alone", "isolated", "abandoned"],
    stress: ["stressed", "pressure", "overwhelmed", "burdened", "strained"],
    confusion: ["confused", "puzzled", "lost", "unclear"],
    neutral: ["ok", "fine", "good", "normal", "alright"],
  };

  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return emotion;
    }
  }

  return "neutral";
}

// Fallback sentiment detection
function detectSentimentFallback(text: string): string {
  const lowerText = text.toLowerCase();

  const positiveWords = [
    "good",
    "great",
    "happy",
    "love",
    "wonderful",
    "excellent",
    "amazing",
    "fantastic",
    "blessed",
    "grateful",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "hate",
    "awful",
    "horrible",
    "worst",
    "sad",
    "angry",
    "frustrated",
    "depressed",
  ];

  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  if (positiveCount > negativeCount) return "positive";
  if (negativeCount > positiveCount) return "negative";
  return "neutral";
}

// Main analysis function
export async function analyzeText(text: string): Promise<EmotionAnalysisResult> {
  try {
    // Determine severity first (keyword-based, most reliable)
    const severity = determineSeverity(text);

    // Detect intent (keyword-based)
    const intent = detectIntent(text);

    // Try to get emotion and sentiment from HuggingFace (with timeout)
    let emotion = "neutral";
    let sentiment = "neutral";
    let confidence = 0;

    if (HF_API_TOKEN) {
      try {
        const [emotionResult, sentimentResult] = await Promise.all([
          getEmotionFromHF(text),
          getSentimentFromHF(text),
        ]);

        emotion = emotionResult.emotion;
        sentiment = sentimentResult;
        confidence = emotionResult.confidence;
      } catch (error) {
        console.warn("HuggingFace API failed, using fallback detection", error);
        emotion = detectEmotionFallback(text);
        sentiment = detectSentimentFallback(text);
      }
    } else {
      // No token - use fallback detection
      emotion = detectEmotionFallback(text);
      sentiment = detectSentimentFallback(text);
    }

    return {
      emotion,
      sentiment,
      severity,
      intent,
      confidence,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);

    // Graceful fallback
    return {
      emotion: detectEmotionFallback(text),
      sentiment: detectSentimentFallback(text),
      severity: determineSeverity(text),
      intent: detectIntent(text),
      confidence: 0,
    };
  }
}
