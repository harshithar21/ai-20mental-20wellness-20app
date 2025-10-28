// Crisis Safety Engine
// Detects crisis indicators and provides appropriate responses

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: "low" | "medium" | "high";
  indicators: string[];
  helplineNumber: string;
  emergencyResponse: string;
  groundingTechniques: string[];
}

// Crisis keywords and phrases
const CRISIS_INDICATORS = {
  highRisk: [
    "suicide",
    "suicidal thoughts",
    "kill myself",
    "kill myself",
    "end it all",
    "no point",
    "don't want to live",
    "want to hurt myself",
    "self harm",
    "self-harm",
    "i should die",
    "i want to die",
    "i'm going to kill myself",
    "planning to kill myself",
    "method to kill myself",
  ],
  mediumRisk: [
    "tired of living",
    "life is meaningless",
    "hopeless",
    "hopelessness",
    "useless",
    "don't care anymore",
    "don't want to exist",
    "pain too much",
    "can't take it",
    "devastated",
    "desperate",
    "severe depression",
    "panic attack",
  ],
  lowRisk: [
    "sad",
    "depressed",
    "anxious",
    "stressed",
    "overwhelmed",
    "struggling",
    "not okay",
    "hurting",
  ],
};

// Grounding techniques
const GROUNDING_TECHNIQUES = [
  "5-4-3-2-1 Technique: Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste",
  "Cold Water Technique: Splash cold water on your face or hold ice in your hands",
  "Breathing Exercise: Breathe in for 4 counts, hold for 4, exhale for 4",
  "Grounding with Your Senses: Focus on textures, sounds, or scents around you",
  "Physical Activity: Go for a walk, do stretches, or any physical movement",
  "Progressive Muscle Relaxation: Tense and release different muscle groups",
  "Mindfulness Meditation: Focus on the present moment",
  "Connect with Someone: Call or text a trusted friend or family member",
];

// Emergency helpline numbers (India focus, but can be expanded)
const HELPLINE_NUMBERS = {
  AASRA: "+91 9820466726",
  ICALL: "+91 9152987821",
  VANDREVALA_FOUNDATION: "+91 9999 77 8888",
  LIFELINE: "1800 200 8332",
};

export function detectCrisis(text: string): CrisisDetectionResult {
  const lowerText = text.toLowerCase();
  const detectedIndicators: string[] = [];
  let severity: "low" | "medium" | "high" = "low";

  // Check for high-risk indicators
  for (const indicator of CRISIS_INDICATORS.highRisk) {
    if (lowerText.includes(indicator)) {
      detectedIndicators.push(indicator);
      severity = "high";
    }
  }

  // Check for medium-risk indicators (only if not already high)
  if (severity !== "high") {
    for (const indicator of CRISIS_INDICATORS.mediumRisk) {
      if (lowerText.includes(indicator)) {
        detectedIndicators.push(indicator);
        severity = "medium";
      }
    }
  }

  // Check for low-risk indicators (only if not already higher)
  if (severity === "low") {
    for (const indicator of CRISIS_INDICATORS.lowRisk) {
      if (lowerText.includes(indicator)) {
        detectedIndicators.push(indicator);
        severity = "low";
      }
    }
  }

  const isCrisis = severity === "high";

  let emergencyResponse = "";
  if (severity === "high") {
    emergencyResponse =
      "I'm deeply concerned about what you're sharing. Your life has value, and there are people who want to help you right now. Please reach out to a crisis helpline immediately. You don't have to face this alone.";
  } else if (severity === "medium") {
    emergencyResponse =
      "I hear that you're in significant pain. What you're feeling is important, and you deserve support. Please consider reaching out to someone you trust or contacting a helpline to talk through this.";
  } else {
    emergencyResponse =
      "Thank you for sharing with me. I'm here to listen and support you through this.";
  }

  return {
    isCrisis,
    severity,
    indicators: [...new Set(detectedIndicators)],
    helplineNumber: HELPLINE_NUMBERS.AASRA,
    emergencyResponse,
    groundingTechniques: isCrisis ? GROUNDING_TECHNIQUES.slice(0, 4) : [],
  };
}

// Log crisis event to database (without personal details)
export async function logCrisisEvent(
  userId: string,
  severity: string,
  timestamp: string
) {
  try {
    // TODO: When Supabase is connected, log the event
    // This should NOT store message content, only metadata
    console.log("Crisis event logged", {
      user_id: userId,
      severity,
      timestamp,
      // No message content stored
    });
  } catch (error) {
    console.error("Error logging crisis event:", error);
  }
}

// Get all helpline numbers
export function getHelplineNumbers() {
  return HELPLINE_NUMBERS;
}

// Check if text contains crisis indicators
export function hasCrisisIndicators(text: string): boolean {
  const lowerText = text.toLowerCase();
  const allIndicators = [
    ...CRISIS_INDICATORS.highRisk,
    ...CRISIS_INDICATORS.mediumRisk,
  ];

  return allIndicators.some((indicator) => lowerText.includes(indicator));
}
