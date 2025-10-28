import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-wellness flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-wellness-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist. Let's get you back
            on track.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full bg-primary hover:bg-wellness-600 gap-2 h-11">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-11 gap-2">
            <Link to="/chat">
              <ArrowLeft className="h-4 w-4" />
              Go to Chat
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
