import { useCallback, useState } from "react";
import {
  User,
  MapPin,
  Edit,
  Save,
  X,
  Loader2,
  Settings,
  Package,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/hook-form";
import { RHFTextField, RHFTextArea } from "@/components/hook-form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  profileSchema,
  type ProfileFormData,
} from "@/pages/Account/profileSchemas";

import React from "react";
import { authClient } from "@/lib/auth-client";
import { removeEmptyValues } from "@/utils";
import { toast } from "sonner";
import AddressManagement from "@/components/account/AddressManagement";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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

  const onSubmit = useCallback(async (data: ProfileFormData) => {
    setIsLoading(true);
    const { email, ...payloadWithoutEmail } = data;
    const payload = removeEmptyValues(payloadWithoutEmail);

    await authClient.updateUser(
      {
        ...payload,
        image: data.image || undefined,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      },
      {
        onSuccess: () => {
          toast.success("User details updated successfully");
          setIsLoading(false);
        },
        onError: (context) => {
          toast.error(context.error.message);
          setIsLoading(false);
        },
      }
    );
    setIsLoading(false);
  }, []);

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
            Manage your personal information, addresses, and preferences
          </p>
        </div>
      </div>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Addresses
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="text-gray-600 mt-1">
                Update your personal details and contact information
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

          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder: "+243 80 1234 5670",
                    }}
                  />
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button
                      loading={isLoading}
                      type="submit"
                      disabled={isLoading}
                      className="bg-secondary hover:bg-secondary-100"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Form>
        </TabsContent>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-6">
          <AddressManagement />
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Overview
            </h2>
            <p className="text-gray-600 mb-6">
              Get a quick overview of your account status and activity
            </p>
          </div>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-secondary" />
                Account Status
              </CardTitle>
            </CardHeader>
            {/* <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Email Verified
                    </span>
                    <Badge
                      variant={profile?.emailVerified ? "default" : "secondary"}
                      className={
                        profile?.emailVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {profile?.emailVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Phone Verified
                    </span>
                    <Badge
                      variant={profile?.phoneVerified ? "default" : "secondary"}
                      className={
                        profile?.phoneVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {profile?.phoneVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Two-Factor Auth
                    </span>
                    <Badge
                      variant={
                        profile?.twoFactorEnabled ? "default" : "secondary"
                      }
                      className={
                        profile?.twoFactorEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {profile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Account Status
                    </span>
                    <Badge
                      variant={profile?.isActive ? "default" : "secondary"}
                      className={
                        profile?.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {profile?.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Account Statistics */}
            {/* <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Account Statistics
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        24
                      </div>
                      <div className="text-sm text-gray-600">Orders Placed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        18
                      </div>
                      <div className="text-sm text-gray-600">
                        Reviews Written
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                        12
                      </div>
                      <div className="text-sm text-gray-600">Months Member</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent> */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
