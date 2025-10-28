import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, Sparkles, TrendingUp, BookOpen, CheckCircle } from "lucide-react";

export default function Welcome() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Emotions",
      description:
        "Advanced AI detects your emotions, sentiments, and emotional state with compassion.",
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
        "Visualize your wellness journey with detailed mood analytics and trends.",
    },
    {
      icon: BookOpen,
      title: "Journaling",
      description:
        "Reflect on your day with guided journaling and gamified streak tracking.",
    },
    {
      icon: Sparkles,
      title: "Personalized Tips",
      description:
        "Get wellness recommendations tailored to your emotional patterns.",
    },
    {
      icon: CheckCircle,
      title: "Evidence-Based",
      description:
        "Built on psychological principles and modern AI technology.",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-wellness-400 to-wellness-600">
              <span className="text-sm font-bold text-white">💙</span>
            </div>
            <span className="text-xl font-bold text-foreground">MindCare</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-wellness-600">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Your AI Mental Wellness Companion
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-md">
                Get personalized emotional support, understand your feelings, and build a healthier mind with our advanced AI-powered wellness assistant.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-wellness-600 text-primary-foreground gap-2"
              >
                <Link to="/signup">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="space-y-3 pt-4">
              {benefits.slice(0, 3).map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-wellness-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right illustration */}
          <div className="relative h-96 sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-wellness-100 to-wellness-50 rounded-3xl opacity-50"></div>
            <div className="relative z-10 space-y-6">
              {/* Floating cards animation */}
              <div className="space-y-4">
                {["Happy", "Calm", "Focused"].map((emotion, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-md-wellness border border-wellness-200 animate-float"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-wellness-500"></div>
                      <span className="font-semibold text-foreground">
                        {emotion}
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
      <section className="bg-gradient-wellness py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed to support your emotional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm-wellness border border-wellness-200 hover:shadow-md-wellness transition-shadow"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-wellness-100">
                    <Icon className="h-6 w-6 text-wellness-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Create Your Account",
              description:
                "Sign up securely with Google or email. Your data is always encrypted.",
            },
            {
              step: "2",
              title: "Chat with MindCare",
              description:
                "Share your thoughts and feelings. Our AI analyzes emotions and provides support.",
            },
            {
              step: "3",
              title: "Track & Grow",
              description:
                "View your wellness dashboard, journal entries, and emotional trends over time.",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wellness-100 text-2xl font-bold text-wellness-600 mx-auto">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl font-bold">
            Start Your Wellness Journey Today
          </h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands who are taking control of their mental health with MindCare.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-gray-100 gap-2"
          >
            <Link to="/signup">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-center py-8 text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="mb-2">
            MindCare © 2024. Mental health matters. If you're in crisis, please reach out.
          </p>
          <p className="text-crisis font-semibold">
            Emergency: AASRA Helpline +91 9820466726
          </p>
        </div>
      </footer>
    </div>
  );
}
