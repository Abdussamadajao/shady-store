import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PATH_AUTH } from "@/routes/paths";
import { Form, RHFTextField } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Mail, ArrowLeft, Lock } from "lucide-react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Auto-scroll to top when navigating to forgot password
  useScrollToTop();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    // try {
    //   await authClient.sendResetPasswordEmail(
    //     {
    //       email: data.email,
    //       callbackURL: PATH_AUTH.resetPassword,
    //     },
    //     {
    //       onSuccess: () => {
    //         setIsEmailSent(true);
    //         toast.success("Password reset email sent successfully!");
    //       },
    //       onError: (context) => {
    //         toast.error(context.error.message || "Failed to send reset email");
    //       },
    //     }
    //   );
    // } catch (error) {
    //   toast.error("An error occurred. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-600">
              We've sent you a password reset link
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <strong>{form.getValues("email")}</strong>. Please check your
              email and click the link to reset your password.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => setIsEmailSent(false)}
                variant="outline"
                className="w-full"
              >
                Try another email
              </Button>

              <Link
                to={PATH_AUTH.login}
                className="block w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 text-center"
              >
                Back to login
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
            Forgot password?
          </h1>
          <p className="text-gray-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <RHFTextField
              name="email"
              label="Email Address"
              type="email"
              inputProps={{
                placeholder: "Enter your email address",
                className: "pl-10",
              }}
              labelProps={{
                className: "text-sm font-medium text-gray-700 mb-2",
              }}
              containerProps={{ className: "relative" }}
              icon={
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              }
            />

            <Button
              loading={isLoading}
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Sending..." : "Send reset instructions"}
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

export default ForgotPassword;
