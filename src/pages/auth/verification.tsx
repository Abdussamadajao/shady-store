import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PATH_AUTH } from "@/routes/paths";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Verification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setLoading(false);
    toast.error("Verification token is missing");
      return;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function handleVerification() {
      if (!token) return;

      try {
        await authClient.verifyEmail(
            {
                query: { token },
            },
            {
                onSuccess: () => {
              toast.success("Email verified successfully!");
              setStatus("success");
                    setLoading(false);
              // Navigate after a short delay to show success state
              setTimeout(() => navigate(PATH_AUTH.login), 2000);
                },
                onError: (ctx) => {
              toast.error(ctx.error.message || "Verification failed");
              setStatus("error");
                    setLoading(false);
              // Navigate after a short delay to show error state
              setTimeout(() => navigate(PATH_AUTH.login), 3000);
                },
            }
        );
      } catch (error) {
        toast.error("An unexpected error occurred");
        setStatus("error");
        setLoading(false);
        setTimeout(() => navigate(PATH_AUTH.login), 3000);
      }
    }

    handleVerification();
  }, [token, navigate]);

  if (loading && status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verifying Email
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
              <span className="text-lg text-gray-700">Verifying...</span>
            </div>
            <p className="text-gray-600">
              This process usually takes just a few seconds. Please don't close
              this page.
            </p>
          </div>

          {/* <div className="text-center mt-6">
            <Link
              to={PATH_AUTH.login}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div> */}
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600">
              Your email has been successfully verified
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                Congratulations! Your email is now verified.
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              You can now sign in to your account and access all features.
            </p>

            <div className="space-y-3">
              <Link
                to={PATH_AUTH.login}
                className="block w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Sign In Now
              </Link>

              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium text-base transition-all duration-200"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              We couldn't verify your email address
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 text-lg font-medium">
                The verification link is invalid or has expired.
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              This can happen if the link was copied incorrectly or if it has
              expired. Please request a new verification email.
            </p>

            <div className="space-y-3">
              <Link
                to={PATH_AUTH.login}
                className="block w-full bg-secondary hover:bg-secondary-100 text-white py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Back to Login
              </Link>

              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium text-base transition-all duration-200"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
