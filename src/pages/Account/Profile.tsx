import { useState } from "react";
import { User, MapPin, Edit, Save, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/hook-form";
import { RHFTextField, RHFTextArea } from "@/components/hook-form";
import { useUser } from "@/api/hooks";
import {
  profileSchema,
  type ProfileFormData,
} from "@/pages/Account/profileSchemas";
import { toast } from "sonner";
import React from "react";
import { authClient } from "@/lib/auth-client";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const profile = session?.user;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
      image: profile?.avatar || "",
      email: profile?.email || "",
    },
  });

  // Update form values when profile data changes
  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        image: profile.avatar || "",
        email: profile.email || "",
      });
    }
  }, [profile, form]);

  // const handleSave = async (data: ProfileFormData) => {
  //   try {
  //     await mutations.updateProfileAsync(data);
  //     toast.success("Profile updated successfully!");
  //     setIsEditing(false);
  //   } catch (error) {
  //     toast.error("Failed to update profile. Please try again.");
  //     console.error("Profile update error:", error);
  //   }
  // };
  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="bg-secondary hover:bg-secondary-100"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Form */}
      <Form form={form} onSubmit={onSubmit}>
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
                <RHFTextField
                  name="firstName"
                  label="First Name"
                  disabled={!isEditing}
                  inputProps={{
                    placeholder: "Enter your first name",
                  }}
                />
                <RHFTextField
                  name="lastName"
                  label="Last Name"
                  disabled={!isEditing}
                  inputProps={{
                    placeholder: "Enter your last name",
                  }}
                />
              </div>
              <RHFTextField
                name="email"
                label="Email Address"
                disabled={true}
                inputProps={{
                  type: "email",
                  value: profile?.email || "",
                  className: "bg-gray-50 cursor-not-allowed",
                }}
              />
              <RHFTextField
                name="phone"
                label="Phone Number"
                disabled={!isEditing}
                inputProps={{
                  type: "tel",
                  placeholder: "+1 (555) 123-4567",
                }}
              />
            </CardContent>
          </Card>

          {/* Account Status
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email Verified</span>
                  <span
                    className={`text-sm font-medium ${
                      profile?.emailVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profile?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone Verified</span>
                  <span
                    className={`text-sm font-medium ${
                      profile?.phoneVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profile?.phoneVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Two-Factor Auth</span>
                  <span
                    className={`text-sm font-medium ${
                      profile?.twoFactorEnabled
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span
                    className={`text-sm font-medium ${
                      profile?.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profile?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card> */}
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

        {/* Form Actions */}
        {/* {isEditing && (
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary-100"
            >
              {mutations.isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        )} */}
      </Form>
    </div>
  );
};

export default Profile;
