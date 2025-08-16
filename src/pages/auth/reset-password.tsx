import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PATH_AUTH } from "@/routes/paths";
import { Form, RHFPassword } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Auto-scroll to top when navigating to reset password
  useScrollToTop();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    // if (!token) {
    //   toast.error("Invalid reset token");
    //   return;
    // }
    // setIsLoading(true);
    // try {
    //   await authClient.resetPassword(
    //     {
    //       token,
    //       password: data.password,
    //     },
    //     {
    //       onSuccess: () => {
    //         setIsSuccess(true);
    //         toast.success("Password reset successfully!");
    //       },
    //       onError: (context) => {
    //         toast.error(context.error.message || "Failed to reset password");
    //       },
    //     }
    //   );
    // } catch (error) {
    //   toast.error("An error occurred. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invalid reset link
            </h1>
            <p className="text-gray-600">
              This password reset link is invalid or has expired
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <p className="text-gray-600 mb-6">
              Please request a new password reset link from the login page.
            </p>

            <Link
              to={PATH_AUTH.forgotPassword}
              className="block w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 text-center"
            >
              Request new reset link
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Password reset successful!
            </h1>
            <p className="text-gray-600">Your password has been updated</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <p className="text-gray-600 mb-6">
              You can now sign in with your new password.
            </p>

            <Link
              to={PATH_AUTH.login}
              className="block w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 text-center"
            >
              Sign in now
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset your password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <RHFPassword
              name="password"
              label="New Password"
              inputProps={{
                placeholder: "Enter your new password",
                className: "pl-10",
              }}
              labelProps={{
                className: "text-sm font-medium text-gray-700 mb-2",
              }}
              containerProps={{ className: "relative" }}
              icon={
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              }
            />

            <RHFPassword
              name="confirmPassword"
              label="Confirm New Password"
              inputProps={{
                placeholder: "Confirm your new password",
                className: "pl-10",
              }}
              labelProps={{
                className: "text-sm font-medium text-gray-700 mb-2",
              }}
              containerProps={{ className: "relative" }}
              icon={
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              }
            />

            <Button
              loading={isLoading}
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>

          {/* Links */}
          <div className="mt-8 text-center">
            <Link
              to={PATH_AUTH.login}
              className="text-sm text-secondary hover:text-secondary-100 font-medium transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
