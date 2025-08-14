import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    address: "123 Main Street",
    city: "Lagos",
    state: "Lagos",
    zipCode: "100001",
    bio: "Passionate shopper and food enthusiast. Love exploring new products and sharing experiences.",
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and preferences</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-secondary hover:bg-secondary-100">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-secondary hover:bg-secondary-100">
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

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-secondary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={editForm.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={editForm.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-secondary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                />
              ) : (
                <p className="text-gray-900 font-medium">{profile.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={editForm.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <Input
                    id="state"
                    value={editForm.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.state}</p>
                )}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                {isEditing ? (
                  <Input
                    id="zipCode"
                    value={editForm.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.zipCode}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editForm.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">24</div>
              <div className="text-sm text-gray-600">Orders Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">18</div>
              <div className="text-sm text-gray-600">Reviews Written</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">12</div>
              <div className="text-sm text-gray-600">Months Member</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
