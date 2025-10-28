import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  showNav?: boolean;
}

export function Layout({
  children,
  isAuthenticated = false,
  onLogout,
  showNav = true,
}: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Chat", href: "/chat" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Journal", href: "/journal" },
    { label: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) =>
    location.pathname === href
      ? "text-primary border-b-2 border-primary"
      : "text-muted-foreground hover:text-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-wellness-400 to-wellness-600">
              <span className="text-sm font-bold text-white">💙</span>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:inline">
              MindCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          {showNav && isAuthenticated && (
            <nav className="hidden md:flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${isActive(item.href)}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {showNav && isAuthenticated && mobileMenuOpen && (
          <div className="border-t border-border md:hidden bg-card">
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-center py-6 text-sm text-muted-foreground">
        <p>
          MindCare © 2024. Mental health matters.{" "}
          <span className="text-crisis">
            If you're in crisis, call AASRA: +91 9820466726
          </span>
        </p>
      </footer>
    </div>
  );
}
