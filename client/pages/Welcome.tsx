import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Shield,
  Sparkles,
  TrendingUp,
  BookOpen,
  CheckCircle,
  MessageCircle,
  Heart,
  Zap,
} from "lucide-react";

export default function Welcome() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Emotions",
      description:
        "Advanced AI detects your emotions, sentiments, and emotional state with compassion and accuracy.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Crisis detection and immediate support with helpline resources when you need them most.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description:
        "Visualize your wellness journey with detailed mood analytics and emotional trends.",
    },
    {
      icon: BookOpen,
      title: "Guided Journaling",
      description:
        "Reflect on your day with AI-powered prompts and gamified streak tracking.",
    },
    {
      icon: Sparkles,
      title: "Personalized Tips",
      description:
        "Get wellness recommendations tailored to your unique emotional patterns and needs.",
    },
    {
      icon: MessageCircle,
      title: "Always Available",
      description:
        "24/7 AI companion that listens, understands, and provides supportive responses anytime.",
    },
  ];

  const benefits = [
    "Talk freely without judgment",
    "24/7 availability",
    "Completely private and secure",
    "Understand your emotions better",
    "Build healthy habits",
    "Access emergency resources",
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "User since 2024",
      quote:
        "MindCare helped me understand my anxiety better. The daily tips are actionable and supportive.",
      avatar: "👩‍🦰",
    },
    {
      name: "James K.",
      role: "Active user",
      quote:
        "Finally found an app that feels like talking to a real person who cares. Highly recommend!",
      avatar: "👨",
    },
    {
      name: "Priya S.",
      role: "Daily journaler",
      quote:
        "The journaling feature combined with mood tracking is powerful for self-discovery.",
      avatar: "👩",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-wellness-400 to-primary shadow-md">
              <span className="text-base font-bold text-white">💙</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-wellness-600 bg-clip-text text-transparent">
              MindCare
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="font-semibold">
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-wellness-600 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-28 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">
                  ✨ Your Mental Wellness Companion
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
                Take Care of Your Mind
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                Get personalized emotional support, understand your feelings,
                and build a healthier mind with our advanced AI-powered wellness
                assistant.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 font-semibold text-base h-13 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/signup">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-semibold text-base h-13 border-2 hover:bg-primary/5"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="space-y-3 pt-6 border-t border-border/50">
              {benefits.slice(0, 3).map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-wellness-100">
                    <CheckCircle className="h-4 w-4 text-wellness-600" />
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-wellness-100/50 to-primary/10 rounded-3xl blur-3xl opacity-60"></div>
            <div className="relative z-10 space-y-6 w-full px-4">
              {/* Floating cards animation */}
              <div className="space-y-4">
                {[
                  { emoji: "😌", label: "Calm", delay: 0 },
                  { emoji: "😊", label: "Happy", delay: 0.2 },
                  { emoji: "🎯", label: "Focused", delay: 0.4 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-lg border border-wellness-200 backdrop-blur animate-float"
                    style={{
                      animationDelay: `${item.delay}s`,
                      maxWidth: "280px",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="font-semibold text-foreground">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card py-16 sm:py-24 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed to support your emotional journey
              every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, intuitive, and designed with your wellness in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              icon: "🚀",
              title: "Create Your Account",
              description:
                "Sign up securely with Google or email. Your privacy and data security are paramount.",
            },
            {
              step: "2",
              icon: "💬",
              title: "Chat with MindCare",
              description:
                "Share your thoughts and feelings naturally. Our AI analyzes your emotions and provides personalized support.",
            },
            {
              step: "3",
              icon: "📈",
              title: "Track & Grow",
              description:
                "View your wellness dashboard, journal entries, and emotional trends. Watch yourself grow.",
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              {i < 2 && (
                <div className="hidden md:block absolute top-24 -right-4 w-8 border-t-2 border-primary/30"></div>
              )}
              <div className="text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl font-bold text-primary mx-auto border-4 border-primary/20">
                  {item.icon}
                </div>
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold mb-4">
                  Step {item.step}
                </span>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-16 sm:py-24 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Loved by Users
            </h2>
            <p className="text-lg text-muted-foreground">
              Real people sharing their real experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{testimonial.avatar}</span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic leading-relaxed mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-wellness-600 text-primary-foreground py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl sm:text-5xl font-bold">
            Start Your Wellness Journey Today
          </h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands who are taking control of their mental health with
            MindCare. Your first step toward a healthier mind starts now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 gap-2 font-semibold text-base h-13 shadow-lg"
            >
              <Link to="/signup">
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-primary-foreground hover:bg-white/10 font-semibold text-base h-13"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card text-center py-10 text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="mb-3 font-medium">
            MindCare © 2024. Your mental health matters.
          </p>
          <p className="text-red-600 font-bold mb-4">
            🆘 In crisis? AASRA Helpline: +91 9820466726 (24/7)
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact Us
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Blog
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
