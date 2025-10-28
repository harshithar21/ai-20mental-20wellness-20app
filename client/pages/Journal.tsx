import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Journal() {
  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 p-12 bg-gradient-wellness rounded-2xl border border-wellness-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              📝 Journal & Reflections
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Coming soon! Write daily reflections and track your wellness journey.
            </p>
            <div className="space-y-4 text-left bg-white rounded-xl p-6 border border-wellness-200">
              <p className="font-semibold text-foreground">This page will include:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Daily journal entries</li>
                <li>✓ Mood rating system</li>
                <li>✓ Streak gamification</li>
                <li>✓ Reflection prompts</li>
              </ul>
            </div>
          </div>
          <Button asChild className="bg-primary hover:bg-wellness-600 gap-2">
            <Link to="/chat">
              Continue Chatting <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
