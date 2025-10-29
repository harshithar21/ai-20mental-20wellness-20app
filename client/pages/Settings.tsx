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
  ChevronRight,
  AlertCircle,
  Download,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function Settings() {
  const { userProfile, updateUserProfile, clearChatHistory } = useAppContext();

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedEmail, setEditedEmail] = useState(userProfile.email);
  const [profileSaved, setProfileSaved] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState({
    push: userProfile.notificationsEnabled,
    email: true,
    moodCheckins: true,
  });

  // Theme State
  const [theme, setTheme] = useState(userProfile.theme);

  // Privacy State
  const [privacy, setPrivacy] = useState(userProfile.privacyLevel);

  // Dialog States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Form States
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    if (editedName.trim() && editedEmail.trim()) {
      updateUserProfile({
        name: editedName,
        email: editedEmail,
      });
      setProfileSaved(true);
      setTimeout(() => {
        setProfileSaved(false);
        setIsEditingProfile(false);
      }, 2000);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    updateUserProfile({ theme: newTheme });
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    if (key === "push") {
      updateUserProfile({ notificationsEnabled: !notifications.push });
    }
  };

  const handlePrivacyChange = (level: "public" | "private" | "friends") => {
    setPrivacy(level);
    updateUserProfile({ privacyLevel: level });
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setShowClearHistoryConfirm(false);
  };

  const handleChangePassword = () => {
    if (
      passwords.new === passwords.confirm &&
      passwords.new.length >= 8 &&
      passwords.current
    ) {
      // In production, this would call an API
      alert("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordChange(false);
    }
  };

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Notifications",
      icon: Bell,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Appearance",
      icon: Moon,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              ⚙️ Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account, preferences, and privacy settings
            </p>
          </div>

          {/* Profile Section */}
          <Card className="mb-8 p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{userProfile.avatar || "👤"}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
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
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="h-11 gap-2"
              >
                {isEditingProfile ? <X className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Edit Profile Form */}
            {isEditingProfile && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-11"
                    placeholder="Your name"
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
                    className="h-11"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  {profileSaved && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="text-sm">Saved!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Notifications */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-6 w-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Notifications
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "push" as const,
                    title: "Push Notifications",
                    desc: "Get alerts about important events",
                  },
                  {
                    key: "email" as const,
                    title: "Email Digests",
                    desc: "Weekly summary of your wellness",
                  },
                  {
                    key: "moodCheckins" as const,
                    title: "Mood Check-ins",
                    desc: "Daily reminders to journal",
                  },
                ].map((notif) => (
                  <div
                    key={notif.key}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notif.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(notif.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[notif.key]
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[notif.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Appearance */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <Moon className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Appearance
                </h3>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground mb-4">
                  Theme
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "light" as const, label: "Light", icon: Sun },
                    { value: "dark" as const, label: "Dark", icon: Moon },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          theme === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{option.label}</span>
                        {theme === option.value && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="p-6 bg-card border-border lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Privacy & Security
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Privacy Level */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    Profile Visibility
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        value: "public" as const,
                        label: "Public",
                        desc: "Anyone can see your profile",
                      },
                      {
                        value: "friends" as const,
                        label: "Friends Only",
                        desc: "Only friends can see",
                      },
                      {
                        value: "private" as const,
                        label: "Private",
                        desc: "Only you can see",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handlePrivacyChange(option.value)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          privacy === option.value
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
                          {privacy === option.value && (
                            <Check className="h-4 w-4 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Security Options */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">
                    Account Security
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => setShowPasswordChange(true)}
                      variant="outline"
                      className="w-full justify-between h-11 group"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Change Password
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-11 group"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Two-Factor Auth
                      </div>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200 mt-3">
                      <p className="text-xs text-green-800 font-medium flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Your account is secure
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
              <Download className="h-5 w-5 text-blue-600" />
              Data Management
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Clear Chat History
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete all conversations
                  </p>
                </div>
                <Button
                  onClick={() => setShowClearHistoryConfirm(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-foreground">
                    Download Your Data
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get a copy of all your personal data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                >
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-xs text-red-700">
                    This action cannot be undone
                  </p>
                </div>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>

          {/* Sign Out */}
          <Card className="p-6 bg-card border-border">
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              variant="outline"
              className="w-full justify-start gap-2 h-11 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Card>
        </div>

        {/* Confirmation Dialogs */}
        {/* Change Password Dialog */}
        {showPasswordChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-md w-full p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Change Password
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        current: e.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        new: e.target.value,
                      }))
                    }
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    At least 8 characters
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        confirm: e.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleChangePassword}
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground h-10"
                  disabled={
                    !passwords.current ||
                    passwords.new.length < 8 ||
                    passwords.new !== passwords.confirm
                  }
                >
                  Change
                </Button>
                <Button
                  onClick={() => setShowPasswordChange(false)}
                  variant="outline"
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Clear History Confirmation */}
        {showClearHistoryConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-md w-full p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Clear Chat History?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will permanently delete all your conversations. This
                    action cannot be undone.
                  </p>
                </div>
              </div>
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

        {/* Delete Account Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-md w-full p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Delete Account?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will permanently delete your account and all data.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
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

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-w-md w-full p-6">
              <h2 className="text-lg font-bold text-foreground mb-2">
                Sign Out?
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                You will be logged out and will need to sign in again to access
                your account.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1 h-10"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground h-10"
                >
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
