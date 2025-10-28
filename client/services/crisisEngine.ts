// Crisis Safety Engine
// Detects crisis indicators using keyword rules provided by user

export interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: "normal" | "moderate" | "crisis";
  indicators: string[];
  helplineNumber: string;
  emergencyResponse: string;
  groundingTechniques: string[];
}

// Crisis keywords - High Risk (from user specification)
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

// Moderate warning keywords - (from user specification)
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

// Grounding techniques
const GROUNDING_TECHNIQUES = [
  "Name 5 things you can see around you.",
  "4 things you can touch.",
  "3 things you can hear.",
  "2 things you can smell.",
  "1 thing you can taste.",
];

// Emergency helpline numbers (India focus, but can be expanded)
const HELPLINE_NUMBERS = {
  AASRA: "+91 9820466726",
  ICALL: "+91 9152987821",
  VANDREVALA_FOUNDATION: "+91 9999 77 8888",
  LIFELINE: "1800 200 8332",
};

// Detect crisis based on keywords
export function detectCrisis(text: string): CrisisDetectionResult {
  const lowerText = text.toLowerCase();
  const detectedIndicators: string[] = [];
  let severity: "normal" | "moderate" | "crisis" = "normal";

  // Check for crisis keywords (highest priority)
  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      detectedIndicators.push(keyword);
      severity = "crisis";
    }
  }

  // Check for moderate keywords (only if not already crisis)
  if (severity !== "crisis") {
    for (const keyword of MODERATE_KEYWORDS) {
      if (lowerText.includes(keyword)) {
        detectedIndicators.push(keyword);
        severity = "moderate";
      }
    }
  }

  const isCrisis = severity === "crisis";

  let emergencyResponse = "";
  if (severity === "crisis") {
    emergencyResponse = `I hear you. Your feelings are valid and you are strong for sharing this. You deserve safety and care. Please contact AASRA suicide prevention helpline: ${HELPLINE_NUMBERS.AASRA}. You are important.`;
  } else if (severity === "moderate") {
    emergencyResponse =
      "I hear that you're struggling with difficult feelings. Your well-being matters. Would you like to talk more, or would it help to reach out to someone you trust?";
  } else {
    emergencyResponse = "";
  }

  return {
    isCrisis,
    severity,
    indicators: [...new Set(detectedIndicators)],
    helplineNumber: HELPLINE_NUMBERS.AASRA,
    emergencyResponse,
    groundingTechniques: isCrisis ? GROUNDING_TECHNIQUES : [],
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
