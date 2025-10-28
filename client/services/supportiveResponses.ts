// Emotion-based supportive and non-robotic responses
// Maps emotions and intents to compassionate, helpful responses

export interface ResponseContext {
  emotion: string;
  sentiment: string;
  intent: string;
  isCrisis: boolean;
}

// Main response templates by emotion
const emotionResponses: Record<string, string[]> = {
  sadness: [
    "I am really sorry you are feeling low. You are not alone. Do you want to talk more about what hurts you today?",
    "It sounds like you're carrying something heavy right now. Thank you for trusting me with this. What's weighing on you the most?",
    "Sadness is a valid feeling, and it's okay to feel this way. I'm here to listen. What happened that made you feel this way?",
    "Sometimes life feels overwhelming and that's okay. You're not broken for feeling sad. Tell me more about what's going on.",
  ],
  anger: [
    "It is ok to feel angry when life feels unfair. I am here listening. What made you feel this way?",
    "Your anger is valid. Sometimes we need to feel angry to understand what matters to us. What's really frustrating you?",
    "Anger often masks hurt. I'm here to help you understand what's beneath it. What triggered this feeling?",
    "It's good that you're expressing how you feel. That takes courage. Let's talk about what's making you angry.",
  ],
  anxiety: [
    "Take a slow breath with me. You did the right thing by expressing how you feel. What exactly is worrying you?",
    "Anxiety can feel overwhelming, but you're safe right now. Let's break down what's making you anxious into smaller pieces.",
    "I can sense you're worried. That's okay. Sometimes naming our fears helps make them smaller. What's running through your mind?",
    "Your anxiety is telling you something matters. Let's figure out what it is and what you can do about it.",
  ],
  loneliness: [
    "Feeling alone is painful, but you reached out. That shows strength. I am right here with you.",
    "Loneliness is one of the hardest feelings, and you're brave for acknowledging it. You deserve connection. How long have you felt this way?",
    "I hear that you're feeling isolated. You're not alone in this moment – I'm here. Do you have anyone in your life you can reach out to?",
    "Sometimes loneliness creeps in quietly. But you reaching out here matters. Let's talk about what you're missing.",
  ],
  joy: [
    "This is great to hear. What made your day better?",
    "I'm so glad to hear something positive in your words. Tell me more about what's making you happy!",
    "Your joy is wonderful to see. What's the story behind this good feeling?",
    "Something good happened! I'd love to hear more about what brought you this happiness.",
  ],
  confusion: [
    "Let us figure this out together. What is going through your mind?",
    "It's okay to feel confused. Sometimes we need to sit with uncertainty for a bit. What's unclear to you?",
    "Confusion often comes before clarity. Let's talk through what's confusing you step by step.",
    "You're not alone in feeling lost. Help me understand what's unclear and we'll work through it together.",
  ],
  stress: [
    "You carry a lot. How about we break things into smaller steps?",
    "Stress is your mind and body telling you something needs attention. What's putting the most pressure on you?",
    "It sounds like you're juggling a lot right now. Let's identify what's the most pressing and tackle that first.",
    "You don't have to handle everything at once. What's one small thing we could focus on to make today easier?",
  ],
  fear: [
    "Fear is a natural response when things feel uncertain. I'm here with you. What are you afraid of?",
    "Acknowledging your fear is the first step. You're safe here. What's frightening you?",
    "Fear can paralyze us, but naming it helps. What's the worst thing you're worried might happen?",
    "It's okay to be scared. That means something matters to you. Let's talk about what's frightening you.",
  ],
  neutral: [
    "Tell me how you want to continue. I am here for you.",
    "I'm listening and ready to help however I can. What would be most useful for you right now?",
    "Thank you for sharing with me. I'm curious – what brings you here today?",
    "I'm here to support you. What's on your mind?",
  ],
};

// Intent-specific follow-ups
const intentResponses: Record<string, string> = {
  ask_advice:
    "That's a great question. Let me help you think through this. Here's what might help...",
  venting:
    "Sometimes we just need to let it out. I hear you, and it's okay to feel frustrated. Keep going if you need to.",
  seeking_support:
    "I'm glad you reached out. You deserve support, and I'm here for you. Let's work through this together.",
  general_conversation: "I'm here to listen and help however I can. Tell me more.",
};

// Get appropriate response based on emotion and context
export function getSupportiveResponse(context: ResponseContext): string {
  // Crisis takes absolute priority
  if (context.isCrisis) {
    return ""; // Crisis response is handled separately in Chat.tsx
  }

  // Get base emotion response
  let response =
    emotionResponses[context.emotion]?.[
      Math.floor(Math.random() * emotionResponses[context.emotion].length)
    ] || emotionResponses.neutral[0];

  // Add intent-specific follow-up for certain intents
  if (
    context.intent === "ask_advice" ||
    context.intent === "seeking_support"
  ) {
    const intentAddition = intentResponses[context.intent];
    if (
      !response.toLowerCase().includes("advice") &&
      !response.toLowerCase().includes("help")
    ) {
      response += " " + intentAddition;
    }
  }

  return response;
}

// Get grounding technique suggestions
export function getGroundingTechniques(): string {
  return `Here's a grounding technique that might help:

Take a moment and try the 5-4-3-2-1 technique:
• Name 5 things you can see around you
• 4 things you can touch
• 3 things you can hear
• 2 things you can smell
• 1 thing you can taste

This brings you back to the present moment. You've got this.`;
}

// Get emotion-specific wellness suggestion
export function getWellnessSuggestion(emotion: string): string {
  const suggestions: Record<string, string> = {
    sadness:
      "When sadness takes over, small activities like a short walk or calling a friend can help shift perspective.",
    anxiety:
      "Try a breathing exercise: breathe in for 4 counts, hold for 4, exhale for 4. Repeat 5 times. This signals safety to your nervous system.",
    loneliness:
      "Reaching out to even one person – a friend, family member, or even here – is a step toward connection.",
    stress:
      "Breaking big tasks into smaller ones and tackling one at a time reduces overwhelm significantly.",
    anger:
      "Channel your energy: go for a run, punch a pillow, or write down everything you're angry about. Let it out.",
    joy: "This feeling is precious. Notice what's creating it and do more of that. You deserve happiness.",
    confusion:
      "Write down what's confusing you. Often, seeing it on paper clarifies things. You don't need all the answers right now.",
    fear: "Courage isn't the absence of fear – it's moving forward despite it. You're braver than you know.",
    neutral:
      "I'm here whenever you need me. Whether you want to talk, vent, or get advice, I'm listening.",
  };

  return (
    suggestions[emotion] ||
    "Remember to take care of yourself. You're doing better than you think."
  );
}
