// HuggingFace API service for emotion and sentiment analysis
// TODO: Add your HuggingFace API token to environment variables

const HF_API_TOKEN = process.env.VITE_HF_API_TOKEN || "";

export interface EmotionAnalysisResult {
  emotion: string;
  sentiment: string;
  severity: "normal" | "moderate" | "crisis";
  intent?: string;
  confidence: number;
}

// GoEmotions model emotions
const EMOTIONS = [
  "sadness",
  "joy",
  "anger",
  "fear",
  "disgust",
  "surprise",
  "love",
  "neutral",
  "anxiety",
  "loneliness",
  "stress",
  "confusion",
];

// Crisis keywords to detect severity
const CRISIS_KEYWORDS = [
  "suicide",
  "suicidal",
  "kill myself",
  "kill myself",
  "end it all",
  "no point",
  "don't want to live",
  "want to hurt myself",
  "harm myself",
  "self harm",
  "i should die",
  "i want to die",
];

// Helper function to determine sentiment from emotion
function emotionToSentiment(emotion: string): string {
  const positive = ["joy", "love", "surprise"];
  const negative = ["sadness", "anger", "fear", "disgust", "anxiety", "stress", "confusion", "loneliness"];

  if (positive.includes(emotion.toLowerCase())) return "positive";
  if (negative.includes(emotion.toLowerCase())) return "negative";
  return "neutral";
}

// Helper function to determine severity
function determineSeverity(text: string): "normal" | "moderate" | "crisis" {
  const lowerText = text.toLowerCase();

  // Check for crisis keywords
  if (CRISIS_KEYWORDS.some((keyword) => lowerText.includes(keyword))) {
    return "crisis";
  }

  // Check for moderate severity indicators
  const moderateKeywords = ["overwhelmed", "depressed", "desperate", "hopeless", "broken"];
  if (moderateKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "moderate";
  }

  return "normal";
}

// Main function to analyze text
export async function analyzeText(text: string): Promise<EmotionAnalysisResult> {
  try {
    // TODO: Replace with actual HuggingFace API call when token is available
    // For now, return mock data based on keywords

    const severity = determineSeverity(text);

    // Simple keyword-based emotion detection for now
    const lowerText = text.toLowerCase();
    let detectedEmotion = "neutral";

    if (lowerText.includes("sad") || lowerText.includes("unhappy") || lowerText.includes("down")) {
      detectedEmotion = "sadness";
    } else if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("love")) {
      detectedEmotion = "joy";
    } else if (lowerText.includes("angry") || lowerText.includes("mad") || lowerText.includes("furious")) {
      detectedEmotion = "anger";
    } else if (lowerText.includes("afraid") || lowerText.includes("scared") || lowerText.includes("worried")) {
      detectedEmotion = "fear";
    } else if (lowerText.includes("anxious") || lowerText.includes("nervous") || lowerText.includes("panic")) {
      detectedEmotion = "anxiety";
    } else if (lowerText.includes("lonely") || lowerText.includes("alone")) {
      detectedEmotion = "loneliness";
    } else if (lowerText.includes("stressed") || lowerText.includes("pressure")) {
      detectedEmotion = "stress";
    } else if (lowerText.includes("confused") || lowerText.includes("confused")) {
      detectedEmotion = "confusion";
    }

    const sentiment = emotionToSentiment(detectedEmotion);

    return {
      emotion: detectedEmotion,
      sentiment,
      severity,
      intent: detectIntent(text),
      confidence: 0.85,
    };
  } catch (error) {
    console.error("Error analyzing text:", error);

    // Fallback response
    return {
      emotion: "neutral",
      sentiment: "neutral",
      severity: "normal",
      confidence: 0,
    };
  }
}

// Helper function to detect user intent
function detectIntent(text: string): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("what") || lowerText.includes("how") || lowerText.includes("why")) {
    return "seek_advice";
  }
  if (lowerText.includes("i need") || lowerText.includes("help") || lowerText.includes("support")) {
    return "seek_support";
  }
  if (lowerText.includes("just") && lowerText.includes("say")) {
    return "venting";
  }

  return "general";
}

// Actual HuggingFace API call (commented out for now)
/*
export async function analyzeTextWithHF(text: string): Promise<EmotionAnalysisResult> {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier",
      {
        headers: { Authorization: `Bearer ${HF_API_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await response.json();

    // Parse HuggingFace response
    const emotions = data[0] as Array<{ label: string; score: number }>;
    emotions.sort((a, b) => b.score - a.score);

    const topEmotion = emotions[0];
    const sentiment = emotionToSentiment(topEmotion.label);
    const severity = determineSeverity(text);

    return {
      emotion: topEmotion.label,
      sentiment,
      severity,
      intent: detectIntent(text),
      confidence: topEmotion.score,
    };
  } catch (error) {
    console.error("HuggingFace API error:", error);
    return {
      emotion: "neutral",
      sentiment: "neutral",
      severity: "normal",
      confidence: 0,
    };
  }
}
*/
