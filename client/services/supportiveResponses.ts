// Comprehensive supportive response generator for emotional support and wellness guidance

interface ResponseContext {
  emotion: string;
  sentiment: string;
  intent: string;
  isCrisis: boolean;
}

// Emotion-specific supportive templates
const emotionResponses: Record<string, string[]> = {
  sadness: [
    "I hear that you're feeling down right now, and that's completely valid. It's okay to feel sad sometimes—it's a natural part of being human. Would you like to talk about what's making you feel this way? I'm here to listen.",
    "Sadness can feel overwhelming, but remember that feelings are temporary. What you're experiencing right now won't last forever. What's one small thing that brought you even a tiny bit of joy today?",
    "It sounds like you're carrying something heavy right now. That takes courage to share. Let's explore what's behind these feelings—sometimes understanding them helps us move through them.",
    "I'm sorry you're hurting. Please know that your feelings matter, and you're not alone in feeling this way. Many people experience sadness. What support would help you most right now?",
  ],
  anxiety: [
    "Anxiety can be really intense, and I appreciate you sharing that with me. Your worries are valid, but remember that many of them might not happen. Let's focus on what you can control right now.",
    "Feeling anxious is your mind trying to protect you, even if it sometimes feels overwhelming. Try taking some deep breaths—in for 4, hold for 4, out for 6. This can help calm your nervous system.",
    "Anxiety loves to tell us 'what if' stories. But you're here, you're safe, and you've gotten through difficult moments before. What's one thing you know for sure is true right now?",
    "I understand anxiety is hard. It's like your mind is running ahead of you. Let's bring it back to the present moment. What's one thing you can see, touch, or hear right now that makes you feel grounded?",
  ],
  anger: [
    "Your anger is telling you that something matters to you. That's actually powerful. Instead of pushing it away, let's explore what's beneath it. What do you really need right now?",
    "Anger is valid, and it's okay to feel it. The key is channeling it constructively. Sometimes exercise, creative expression, or just letting it out helps. What feels right for you?",
    "I hear that you're frustrated or upset. That's understandable. Take a moment to breathe. What would help you feel more in control right now?",
    "Anger often comes from a place of pain or injustice. You deserve to feel heard and understood. What would make you feel better about this situation?",
  ],
  joy: [
    "That's wonderful! I'm so happy to hear you're feeling joy. These moments are precious. What made you happy today? Let's celebrate this with you!",
    "Joy is beautiful, and I'm honored you're sharing this positive moment with me. How does it feel in your body right now?",
    "This is amazing! You're experiencing something great. Savor this moment. What does happiness mean to you in this moment?",
    "Your joy is contagious! I love hearing about the good things in your life. What do you want to remember about this feeling?",
  ],
  stress: [
    "Stress can feel like too much on your shoulders. Let's break it down—what's the one thing stressing you most right now that we can address together?",
    "I hear you're under pressure. That's really tough. Remember, you're capable of handling more than you think. What would help you feel more in control?",
    "Stress is your body's way of telling you something needs attention. That's actually helpful information. What's one small step you could take to reduce the pressure?",
    "You sound stressed, and that's understandable given everything you're dealing with. Let's focus on what you can influence. What's one thing you can let go of today?",
  ],
  confusion: [
    "Feeling confused is actually a sign that you're thinking deeply about something. That's good. Let's try to untangle this together. What's the core issue that's confusing you?",
    "Sometimes clarity comes from talking it out. I'm here to help you work through this confusion. What's making you uncertain right now?",
    "Confusion is okay—it means you're exploring new territory. Let's break this down into smaller, clearer pieces. What's one thing you do understand about the situation?",
    "I understand feeling lost. Let's take a step back and look at this from different angles. What would help you see things more clearly?",
  ],
  neutral: [
    "Thanks for sharing. It sounds like you're in a calm place right now. Is there anything on your mind that you'd like to explore or talk about?",
    "I'm here to listen to whatever's on your heart. What would be helpful to talk about today?",
    "You seem to be in a balanced place. That's great. Is there anything specific you'd like support with, or would you just like to chat?",
    "I'm glad you reached out. Whether you want to dive deep or just have a conversation, I'm here for you. What's on your mind?",
  ],
  love: [
    "That's beautiful. Feelings of love and connection are so powerful. Tell me more about what you're experiencing. What does this love mean to you?",
    "Love is such a precious emotion. I'm glad you're feeling it. What brings out these feelings of love in you?",
    "That's wonderful that you're experiencing love. Whether it's for a person, place, or even yourself, that's something special. What would you like to express about it?",
    "Love is one of the most healing emotions. What aspect of this feeling would you like to explore?",
  ],
  loneliness: [
    "Loneliness is a painful feeling, but I want you to know you're not alone in feeling it. Many people experience this. What's making you feel isolated right now?",
    "Loneliness is telling you that you need connection, and that's a valid need. Even though you might feel alone, you're reaching out, and that's brave. What kind of connection would help?",
    "I hear that you're feeling lonely. That's a difficult emotion, but it's also temporary. What's one person or thing you feel connected to?",
    "Loneliness can feel overwhelming, but remember: seeking support (like you're doing now) is a step toward connection. What would help you feel more connected?",
  ],
  fear: [
    "Fear is a protective emotion, but sometimes it can hold us back. What are you afraid of? Let's explore it together and see if we can address it.",
    "Fear is natural, especially when facing the unknown. But you're braver than you think. What specifically is scaring you right now?",
    "I understand you're afraid. Fear often grows when we face it alone. Talking about it can help. What would make you feel safer?",
    "Fear can feel paralyzing, but remember: you've overcome challenges before. What's one small step you could take to feel more in control?",
  ],
  disgust: [
    "It sounds like something has really bothered or upset you. That's a strong reaction, and it's valid. What's causing this feeling of disgust?",
    "Your disgust is telling you that something doesn't align with your values. That's important information. What specifically is triggering this feeling?",
    "Disgust is a signal that something feels wrong to you. Let's explore what that is so you can understand it better.",
    "I hear that you're feeling repulsed or upset. That's a real emotion. What would help you process this and move forward?",
  ],
};

// Intent-specific supportive templates
const intentResponses: Record<string, string[]> = {
  ask_advice: [
    "I love that you're asking for guidance. Let me share my thoughts, and you can take what resonates with you and leave the rest. Remember, you know yourself best.",
    "Great question. Here's what I'd recommend based on what you've shared, though ultimately the best solution is the one that feels right to you.",
    "You're being proactive by asking for advice—that's wonderful. Let me offer some perspectives to help you think through this.",
    "I'm glad you're asking. Let me provide some ideas that might help, but trust your gut—you have good instincts.",
  ],
  venting: [
    "Thank you for letting it all out. Sometimes we just need to express how we really feel without judgment. I hear you, and your frustration is valid.",
    "I'm here for you to vent. Your feelings are real, and it's healthy to express them. Get it all out if you need to.",
    "Let it out. Venting is therapeutic, and I'm completely here for that. Your feelings matter.",
    "You clearly needed to get this off your chest, and I appreciate you sharing. Your feelings are completely understandable.",
  ],
  seeking_support: [
    "I'm so glad you reached out. You deserve support, and you're doing the right thing by asking for help. I'm here for you.",
    "Seeking support is a sign of strength, not weakness. I'm honored you're opening up to me. How can I best support you right now?",
    "You're brave for reaching out. Let's work through this together. What kind of support would help you most?",
    "Thank you for trusting me with this. You're not alone, and help is available. Let's explore what you need.",
  ],
  general_conversation: [
    "Thanks for sharing that. I'm interested in understanding you better. What else would you like to talk about?",
    "That's interesting. Tell me more about how you're feeling. I'm here to listen and understand.",
    "I appreciate you opening up. What's really important to you about this topic?",
    "That makes sense. I'd love to hear more. What's your biggest concern or hope here?",
  ],
};

// Wellness suggestions based on emotion
const wellnessAdvice: Record<string, string[]> = [
  "Take a 5-minute breathing exercise: breathe in for 4 counts, hold for 4, exhale for 6. This activates your calm nervous system.",
  "Step outside for some fresh air and sunlight. Even 5 minutes can boost your mood and reduce stress.",
  "Try a short 10-minute walk. Movement helps process emotions and releases feel-good chemicals in your brain.",
  "Write in a journal. Getting your thoughts out on paper helps you understand them better and release tension.",
  "Connect with someone you trust. Share what you're feeling with a friend or loved one. You don't have to handle this alone.",
  "Do something kind for yourself—make tea, take a bath, listen to music you love. Self-care is important.",
  "Try a meditation or mindfulness app. Even 3-5 minutes can help calm your mind and center yourself.",
  "Move your body in a way you enjoy—dance, stretch, exercise. Physical activity is powerful for mental health.",
  "Limit caffeine and stay hydrated. What we consume affects our mood and anxiety levels.",
  "Practice gratitude. List 3 things you're grateful for, no matter how small. It shifts your perspective.",
  "Get enough sleep. Your emotional resilience improves dramatically with proper rest.",
  "Reach out to a therapist or counselor. Professional support is valuable and nothing to be ashamed of.",
];

export function getSupportiveResponse(context: ResponseContext): string {
  const { emotion, sentiment, intent, isCrisis } = context;

  if (isCrisis) {
    return "If you're in crisis, please reach out to emergency services or a crisis helpline immediately. Your life matters.";
  }

  // Get emotion-based response
  const emotionOptions =
    emotionResponses[emotion] || emotionResponses["neutral"];
  const emotionResponse =
    emotionOptions[Math.floor(Math.random() * emotionOptions.length)];

  // Get intent-based response
  const intentOptions =
    intentResponses[intent] || intentResponses["general_conversation"];
  const intentResponse =
    intentOptions[Math.floor(Math.random() * intentOptions.length)];

  // Combine responses intelligently
  const combinedResponse = `${emotionResponse}\n\n${intentResponse}`;

  return combinedResponse;
}

export function getWellnessSuggestion(emotion: string): string {
  // More wellness tips for negative emotions
  const emotionTips: Record<string, string[]> = {
    sadness: [
      "Reach out to someone you trust. Connection is healing, and you don't have to feel this alone.",
      "Engage in an activity you enjoy, even if you don't feel like it. Moving through sadness takes small actions.",
      "Be gentle with yourself. Sadness is part of life, and you'll get through this.",
      "Consider talking to a therapist. Professional support can help you process these feelings.",
    ],
    anxiety: [
      "Practice grounding techniques. Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "Progressive muscle relaxation helps calm anxiety. Tense and release each muscle group for relief.",
      "Limit caffeine and get regular exercise. These impact anxiety levels significantly.",
      "Remember: anxiety is temporary, and you've handled difficult feelings before.",
    ],
    stress: [
      "Break your tasks into smaller steps. Big projects feel less overwhelming when divided.",
      "Practice saying 'no' to things that don't serve you. Boundaries protect your peace.",
      "Schedule time for relaxation. Even 30 minutes of self-care can reset your nervous system.",
      "Reach out for help. You don't have to manage everything alone.",
    ],
    anger: [
      "Physical activity is perfect for anger—run, exercise, or punch a pillow. Release the intensity.",
      "Express your feelings creatively. Write, draw, or play music to channel your anger constructively.",
      "Take time to cool down before responding. This prevents saying things you might regret.",
      "Identify what's really bothering you underneath the anger. Often anger masks hurt or fear.",
    ],
    loneliness: [
      "Reach out to someone—text a friend, join a group, or volunteer. Connection heals loneliness.",
      "Be your own best friend. Self-compassion is the foundation of healthy relationships.",
      "Pursue hobbies and interests. This helps you meet like-minded people and feel fulfilled.",
      "Remember: this feeling is temporary, and you're worthy of connection.",
    ],
    fear: [
      "Face your fear gradually. Small steps build courage. You're braver than you think.",
      "Prepare and plan. Often, anxiety decreases when you feel prepared.",
      "Remember past successes. You've overcome challenges before. You can do this too.",
      "Reach out for support. Sharing your fears with someone makes them feel less overwhelming.",
    ],
  };

  const tips = emotionTips[emotion] || wellnessAdvice;
  return tips[Math.floor(Math.random() * tips.length)];
}

export function getEmotionalValidation(emotion: string): string {
  const validations: Record<string, string> = {
    sadness: "Your sadness is valid. It's okay to feel this way.",
    anxiety: "Your anxiety is real, and it's understandable.",
    anger: "Your anger is justified. You have the right to feel upset.",
    joy: "Your happiness is wonderful. Celebrate this feeling!",
    stress: "Your stress is real, and you're handling a lot.",
    confusion: "It's okay to feel confused. This is part of growth.",
    neutral: "You're in a balanced place. That's healthy.",
    love: "Love is beautiful. Treasure this feeling.",
    loneliness: "Loneliness is painful, but you're not truly alone.",
    fear: "Your fear makes sense. Acknowledge it and move forward.",
    disgust: "Your boundaries are valid. You have the right to feel repulsed.",
    surprise: "Surprises can be disorienting. That's completely normal.",
  };

  return validations[emotion] || "Your feelings are valid and important.";
}
