import { useState } from "react";
import { Settings, Bell, Shield, Palette, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
      orderUpdates: true,
      promotions: false,
      newsletter: true,
    },
    privacy: {
      profileVisibility: "public",
      orderHistory: "private",
      reviews: "public",
      locationSharing: false,
    },
    preferences: {
      language: "en",
      currency: "NGN",
      timezone: "Africa/Lagos",
      theme: "light",
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      sessionTimeout: "24h",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editSettings, setEditSettings] = useState(settings);

  const handleSave = () => {
    setSettings(editSettings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditSettings(settings);
    setIsEditing(false);
  };

  const handleSettingChange = (category: string, key: string, value: any) => {
    setEditSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and security settings
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-secondary hover:bg-secondary-100"
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Settings
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-secondary hover:bg-secondary-100"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-secondary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Email Notifications
                </Label>
                <p className="text-xs text-gray-600">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={editSettings.notifications.email}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", "email", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Push Notifications
                </Label>
                <p className="text-xs text-gray-600">
                  Receive push notifications
                </p>
              </div>
              <Switch
                checked={editSettings.notifications.push}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", "push", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">SMS Notifications</Label>
                <p className="text-xs text-gray-600">Receive updates via SMS</p>
              </div>
              <Switch
                checked={editSettings.notifications.sms}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", "sms", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Order Updates</Label>
                <p className="text-xs text-gray-600">
                  Get notified about order status
                </p>
              </div>
              <Switch
                checked={editSettings.notifications.orderUpdates}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", "orderUpdates", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Promotions</Label>
                <p className="text-xs text-gray-600">
                  Receive promotional offers
                </p>
              </div>
              <Switch
                checked={editSettings.notifications.promotions}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", "promotions", checked)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Profile Visibility</Label>
              <Select
                value={editSettings.privacy.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("privacy", "profileVisibility", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Order History</Label>
              <Select
                value={editSettings.privacy.orderHistory}
                onValueChange={(value) =>
                  handleSettingChange("privacy", "orderHistory", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Reviews</Label>
              <Select
                value={editSettings.privacy.reviews}
                onValueChange={(value) =>
                  handleSettingChange("privacy", "reviews", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Location Sharing</Label>
                <p className="text-xs text-gray-600">
                  Share your location for better delivery
                </p>
              </div>
              <Switch
                checked={editSettings.privacy.locationSharing}
                onCheckedChange={(checked) =>
                  handleSettingChange("privacy", "locationSharing", checked)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-secondary" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Language</Label>
              <Select
                value={editSettings.preferences.language}
                onValueChange={(value) =>
                  handleSettingChange("preferences", "language", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Currency</Label>
              <Select
                value={editSettings.preferences.currency}
                onValueChange={(value) =>
                  handleSettingChange("preferences", "currency", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Timezone</Label>
              <Select
                value={editSettings.preferences.timezone}
                onValueChange={(value) =>
                  handleSettingChange("preferences", "timezone", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Lagos">
                    Africa/Lagos (GMT+1)
                  </SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">
                    America/New_York (GMT-5)
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Europe/London (GMT+0)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <Select
                value={editSettings.preferences.theme}
                onValueChange={(value) =>
                  handleSettingChange("preferences", "theme", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-xs text-gray-600">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                checked={editSettings.security.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleSettingChange("security", "twoFactorAuth", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Login Notifications
                </Label>
                <p className="text-xs text-gray-600">
                  Get notified of new logins
                </p>
              </div>
              <Switch
                checked={editSettings.security.loginNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("security", "loginNotifications", checked)
                }
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Session Timeout</Label>
              <Select
                value={editSettings.security.sessionTimeout}
                onValueChange={(value) =>
                  handleSettingChange("security", "sessionTimeout", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="6h">6 Hours</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Change Password
            </Button>
            <Button
              variant="outline"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
