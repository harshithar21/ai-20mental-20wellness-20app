import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Bell,
  Eye,
  Trash2,
  LogOut,
  Save,
  X,
  Check,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function Settings() {
  const { userProfile, updateUserProfile, clearChatHistory } = useAppContext();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedEmail, setEditedEmail] = useState(userProfile.email);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editedName,
      email: editedEmail,
    });
    setIsEditingProfile(false);
  };

  const handleThemeToggle = () => {
    updateUserProfile({
      theme: userProfile.theme === "light" ? "dark" : "light",
    });
  };

  const handleNotificationsToggle = () => {
    updateUserProfile({
      notificationsEnabled: !userProfile.notificationsEnabled,
    });
  };

  const handlePrivacyChange = (level: "public" | "private" | "friends") => {
    updateUserProfile({
      privacyLevel: level,
    });
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setShowClearHistoryConfirm(false);
  };

  const settingsSections = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Manage your profile information",
      color: "text-blue-600",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control how you receive updates",
      color: "text-yellow-600",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your data and privacy",
      color: "text-green-600",
    },
    {
      icon: Moon,
      title: "Appearance",
      description: "Customize your experience",
      color: "text-purple-600",
    },
  ];

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              ⚙️ Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and privacy settings
            </p>
          </div>

          {/* Profile Section */}
          <Card className="mb-6 p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{userProfile.avatar || "👤"}</div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {userProfile.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userProfile.email}
                  </p>
                  <Badge className="mt-2 bg-primary text-primary-foreground">
                    Active Member
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="h-10"
              >
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Edit Form */}
            {isEditingProfile && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-10"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditingProfile(false)}
                    variant="outline"
                    className="flex-1 h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Settings Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Notifications */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Notifications
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Control how you receive updates and reminders
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Push Notifications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Get alerts about important events
                    </p>
                  </div>
                  <button
                    onClick={handleNotificationsToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      userProfile.notificationsEnabled
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userProfile.notificationsEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Email Digests
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Weekly summary of your wellness
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">
                      Mood Check-ins
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Daily reminders to journal
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <Moon className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Appearance
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Customize how the app looks
              </p>

              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground mb-3">
                  Theme
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      updateUserProfile({ theme: "light" })
                    }
                    className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      userProfile.theme === "light"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    onClick={() =>
                      updateUserProfile({ theme: "dark" })
                    }
                    className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      userProfile.theme === "dark"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="font-medium">Dark</span>
                  </button>
                </div>

                <div className="text-sm font-medium text-foreground mt-6 mb-3">
                  Accessibility
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Large Text</p>
                    <p className="text-xs text-muted-foreground">
                      Increase font size for easier reading
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-muted">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Privacy & Security
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Control your data and privacy settings
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Privacy Level */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Profile Visibility
                  </p>
                  <div className="space-y-2">
                    {[
                      { value: "public" as const, label: "Public", desc: "Anyone can see your profile" },
                      { value: "friends" as const, label: "Friends Only", desc: "Only friends can see" },
                      { value: "private" as const, label: "Private", desc: "Only you can see" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePrivacyChange(option.value)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          userProfile.privacyLevel === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <div>
                            <p className="font-medium text-foreground">
                              {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {option.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">
                    Account Security
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2 h-12">
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-12">
                      <Shield className="h-4 w-4" />
                      Enable Two-Factor Auth
                    </Button>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-800 font-medium">
                        ✅ Your account is secure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Data Management */}
          <Card className="p-6 bg-card border-border mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Data Management
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your data and privacy
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Clear Chat History
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Delete all your chat conversations with MindCare
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowClearHistoryConfirm(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    Download Your Data
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get a copy of all your personal data and wellness records
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-xs text-red-700">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Account Actions
            </h3>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Card>

          {/* Confirmation Dialogs */}
          {showClearHistoryConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="max-w-md w-full p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Clear Chat History?
                </h2>
                <p className="text-muted-foreground mb-6">
                  This will permanently delete all your conversations with
                  MindCare. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleClearHistory}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10"
                  >
                    Clear History
                  </Button>
                  <Button
                    onClick={() => setShowClearHistoryConfirm(false)}
                    variant="outline"
                    className="flex-1 h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="max-w-md w-full p-6">
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Delete Account?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Deleting your account will permanently remove all your data,
                  journal entries, and chat history. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10"
                  >
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
