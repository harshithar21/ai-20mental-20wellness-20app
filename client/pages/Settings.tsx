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
  FileJson,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export default function Settings() {
  const { userProfile, updateUserProfile, clearChatHistory, journalEntries, chatMessages, moodEntries } = useAppContext();

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedEmail, setEditedEmail] = useState(userProfile.email);
  const [profileSaved, setProfileSaved] = useState(false);
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatar || "👤");

  const avatarOptions = ["👤", "��", "👩", "👨‍🦱", "👩‍🦱", "🧑", "😊", "🙂"];

  // Notification States
  const [notifications, setNotifications] = useState({
    push: userProfile.notificationsEnabled,
    email: true,
    moodCheckins: true,
    insights: true,
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
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        avatar: selectedAvatar,
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

  const handleDownloadData = async () => {
    setDownloadLoading(true);
    try {
      // Prepare all user data
      const userData = {
        profile: userProfile,
        moodEntries: moodEntries,
        journalEntries: journalEntries,
        chatHistory: chatMessages,
        exportDate: new Date().toISOString(),
        exportVersion: "1.0",
      };

      // Create JSON string with pretty formatting
      const jsonString = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindcare-data-${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      setTimeout(() => {
        alert("✅ Your data has been downloaded successfully!");
        setDownloadLoading(false);
      }, 500);
    } catch (error) {
      console.error("Download error:", error);
      alert("❌ Failed to download data. Please try again.");
      setDownloadLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setShowClearHistoryConfirm(false);
    alert("✅ Chat history cleared successfully!");
  };

  const handleChangePassword = () => {
    if (
      passwords.new === passwords.confirm &&
      passwords.new.length >= 8 &&
      passwords.current
    ) {
      // In production, this would call a secure API endpoint with encrypted password
      updateUserProfile({});
      alert("✅ Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordChange(false);
    }
  };

  const handleLogout = () => {
    // In production, this would clear auth tokens and redirect to login
    alert("��� You have been logged out. Redirecting to login...");
    setShowLogoutConfirm(false);
    // window.location.href = '/login'; // Uncomment in production
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      // In production, this would call a secure API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("🗑️ Account deletion initiated. Redirecting to homepage...");
      setShowDeleteConfirm(false);
      setDeleteLoading(false);
      // window.location.href = '/'; // Uncomment in production
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete account. Please try again.");
      setDeleteLoading(false);
    }
  };

  const totalDataSize = (
    JSON.stringify({ moodEntries, journalEntries, chatMessages }).length / 1024
  ).toFixed(2);

  return (
    <Layout isAuthenticated={true} showNav={true}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              ⚙️ Settings
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account, preferences, and privacy settings
            </p>
          </div>

          {/* Profile Section */}
          <Card className="mb-8 p-8 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="text-7xl p-4 bg-primary/10 rounded-2xl">{selectedAvatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {userProfile.name}
                  </h2>
                  <p className="text-muted-foreground mb-3">{userProfile.email}</p>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    ✨ Active Member
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`h-11 gap-2 ${
                  isEditingProfile
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-primary hover:bg-wellness-600"
                }`}
              >
                {isEditingProfile ? <X className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {isEditingProfile ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {/* Edit Profile Form */}
            {isEditingProfile && (
              <div className="space-y-6 pt-8 border-t border-border">
                {/* Avatar Selection */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-4 block">
                    Choose Avatar
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`text-4xl p-3 rounded-lg transition-all ${
                          selectedAvatar === avatar
                            ? "bg-primary/20 ring-2 ring-primary scale-110"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-11 text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="h-11 text-base"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground gap-2 h-11 text-base font-semibold"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  {profileSaved && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold px-4">
                      <Check className="h-5 w-5" />
                      <span>Saved!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Notifications */}
            <Card className="p-6 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "push" as const,
                    title: "Push Notifications",
                    desc: "Get alerts about important events",
                    icon: "🔔",
                  },
                  {
                    key: "email" as const,
                    title: "Email Digests",
                    desc: "Weekly summary of your wellness",
                    icon: "📧",
                  },
                  {
                    key: "moodCheckins" as const,
                    title: "Mood Check-ins",
                    desc: "Daily reminders to journal",
                    icon: "💭",
                  },
                  {
                    key: "insights" as const,
                    title: "Wellness Insights",
                    desc: "Personalized tips and recommendations",
                    icon: "💡",
                  },
                ].map((notif) => (
                  <div
                    key={notif.key}
                    className="flex items-center justify-between p-4 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{notif.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{notif.title}</p>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(notif.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[notif.key] ? "bg-primary" : "bg-muted border border-border"
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
            <Card className="p-6 bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Moon className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
              </div>

              <div className="space-y-4">
                <div className="text-sm font-semibold text-foreground mb-4">Theme</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "light" as const, label: "Light Mode", icon: Sun },
                    { value: "dark" as const, label: "Dark Mode", icon: Moon },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all font-medium ${
                          theme === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm">{option.label}</span>
                        {theme === option.value && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Privacy & Security */}
          <Card className="p-6 bg-card border-border/50 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Privacy Level */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-4">Profile Visibility</p>
                <div className="space-y-2">
                  {[
                    {
                      value: "public" as const,
                      label: "🌐 Public",
                      desc: "Anyone can see your profile",
                    },
                    {
                      value: "friends" as const,
                      label: "👥 Friends Only",
                      desc: "Only friends can see",
                    },
                    {
                      value: "private" as const,
                      label: "🔒 Private",
                      desc: "Only you can see",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePrivacyChange(option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        privacy === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {option.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {option.desc}
                          </p>
                        </div>
                        {privacy === option.value && (
                          <Check className="h-4 w-4 ml-auto text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Options */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-4">Account Security</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowPasswordChange(true)}
                    variant="outline"
                    className="w-full justify-between h-12 group hover:bg-primary/5 border-border/50"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 mt-4">
                    <p className="text-xs text-green-800 font-semibold flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Your account is secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="p-6 bg-card border-border/50 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileJson className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
                <p className="text-xs text-muted-foreground">Total data: ~{totalDataSize} KB</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-5 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors">
                <div>
                  <p className="font-semibold text-foreground">Download Your Data</p>
                  <p className="text-xs text-muted-foreground">
                    Get a JSON copy of all your personal data
                  </p>
                </div>
                <Button
                  onClick={handleDownloadData}
                  disabled={downloadLoading}
                  className="h-10 gap-2 bg-primary hover:bg-wellness-600"
                >
                  {downloadLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-5 bg-muted/40 rounded-xl hover:bg-muted/60 transition-colors">
                <div>
                  <p className="font-semibold text-foreground">Clear Chat History</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete all conversations
                  </p>
                </div>
                <Button
                  onClick={() => setShowClearHistoryConfirm(true)}
                  variant="outline"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 h-10"
                >
                  Clear
                </Button>
              </div>

              <div className="flex items-center justify-between p-5 bg-red-50 rounded-xl border border-red-200">
                <div>
                  <p className="font-semibold text-red-900">Delete Account</p>
                  <p className="text-xs text-red-700">
                    This action cannot be undone
                  </p>
                </div>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-10"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>

          {/* Sign Out */}
          <Card className="p-6 bg-card border-border/50 shadow-sm">
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              variant="outline"
              className="w-full justify-start gap-2 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 font-semibold"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </Card>
        </div>

        {/* Confirmation Dialogs */}

        {/* Change Password Dialog */}
        {showPasswordChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="max-w-md w-full p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Change Password
              </h2>
              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
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
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
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
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    At least 8 characters required
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
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
                    className="h-11"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleChangePassword}
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground h-11 font-semibold"
                  disabled={
                    !passwords.current ||
                    passwords.new.length < 8 ||
                    passwords.new !== passwords.confirm
                  }
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => setShowPasswordChange(false)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Clear History Confirmation */}
        {showClearHistoryConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="max-w-md w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Clear Chat History?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will permanently delete all your conversations. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleClearHistory}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white h-11 font-semibold"
                >
                  Clear History
                </Button>
                <Button
                  onClick={() => setShowClearHistoryConfirm(false)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Delete Account Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="max-w-md w-full p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Delete Account?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-11 font-semibold"
                >
                  {deleteLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Logout Confirmation */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="max-w-md w-full p-8">
              <h2 className="text-xl font-bold text-foreground mb-3">Sign Out?</h2>
              <p className="text-muted-foreground mb-8">
                You will be logged out and will need to sign in again to access your account.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1 h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  className="flex-1 bg-primary hover:bg-wellness-600 text-primary-foreground h-11 font-semibold"
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
