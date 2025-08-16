import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { PATH_AUTH } from "@/routes/paths";
import {
  signupSchema,
  type SignupFormData,
} from "@/components/auth/authSchemas";
import { Form, RHFPassword, RHFTextField } from "@/components/hook-form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";

const SignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-scroll to top when navigating to signup
  useScrollToTop();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: SignupFormData) {
    setIsLoading(true);

    const data = {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    };

    await authClient.signUp
      .email(data, {
        onSuccess: (_context) => {
          toast.success(
            "Sign up successful! Please check your email to verify your account."
          );
          navigate(PATH_AUTH.login);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <RHFTextField
                  name="firstName"
                  label="First Name"
                  inputProps={{
                    placeholder: "Enter your first name",
                  }}
                />
              </div>
              <div className="relative">
                <RHFTextField
                  name="lastName"
                  label="Last Name"
                  inputProps={{
                    placeholder: "Enter your last name",
                  }}
                />
              </div>
            </div>

            <RHFTextField
              name="email"
              label="Email Address"
              type="email"
              inputProps={{
                type: "email",
                placeholder: "Enter your email address",
              }}
            />

            <RHFPassword
              name="password"
              label="Password"
              inputProps={{
                placeholder: "Create a strong password",
              }}
            />

            <RHFPassword
              name="confirmPassword"
              label="Confirm Password"
              inputProps={{
                placeholder: "Confirm your password",
              }}
            />

            <Button
              loading={isLoading}
              type="submit"
              className="w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </Form>

          {/* Links */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={PATH_AUTH.login}
                className="text-secondary hover:text-secondary-100 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
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

export default SignUp;
