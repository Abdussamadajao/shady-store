import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PATH_AUTH } from "@/routes/paths";
import { loginSchema, type LoginFormData } from "@/components/auth/authSchemas";
import { Form, RHFPassword, RHFTextField } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  // Auto-scroll to top when navigating to login
  useScrollToTop();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function clearError() {
    setError("");
    setShowAlert(false);
  }

  function addErrorMessage(message: string) {
    setError(message);
    setShowAlert(true);
  }

  async function handleResendVerification() {
    if (!unverifiedEmail) return;
    setIsResending(true);

    try {
      await authClient.sendVerificationEmail(
        {
          email: unverifiedEmail,
          callbackURL: PATH_AUTH.verification,
        },
        {
          onSuccess: () => {
            toast.success("Verification email sent successfully");
            clearError();
            setIsResending(false);
          },
          onError: () => {
            addErrorMessage("Failed to send verification email");
            setIsResending(false);
          },
        }
      );
    } catch (_error) {
      toast.error("Failed to send verification email");
      setIsResending(false);
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setUnverifiedEmail(null);
    clearError();

    await authClient.signIn
      .email(
        { email: data.email, password: data.password },
        {
          onSuccess: (context) => {
            console.log(context);
            setAuth({
              user: context.data.user,
              session: context.data.session,
            });
            toast.success("Login successful!");
            navigate("/");
          },
          onError: (context) => {
            if (context.error.status === 403) {
              setUnverifiedEmail(data.email);
              addErrorMessage(
                "Please verify your email address to be able to login."
              );
              return;
            }

            toast.error(context.error.message);
          },
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Error Alert */}
          {showAlert && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              {unverifiedEmail && (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="mt-2 text-sm text-secondary hover:text-secondary-100 underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend verification email"}
                </Button>
              )}
            </div>
          )}

          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <RHFTextField
              name="email"
              label="Email Address"
              type="email"
              inputProps={{
                placeholder: "Enter your email address",
              }}
            />

            <RHFPassword
              name="password"
              label="Password"
              inputProps={{
                placeholder: "Enter your password",
              }}
            />

            <Button
              loading={isLoading}
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          {/* Links */}
          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link
                to={PATH_AUTH.forgotPassword}
                className="text-sm text-secondary hover:text-secondary-100 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to={PATH_AUTH.signup}
                  className="text-secondary hover:text-secondary-100 font-semibold transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
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

export default Login;
