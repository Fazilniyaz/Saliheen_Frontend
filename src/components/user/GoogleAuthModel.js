import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin } from "../../actions/userActions";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { X, Sparkles } from "lucide-react";

export default function GoogleAuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.authState);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
      //   toast.success("Welcome! You're now signed in", {
      //     position: "bottom-center",
      //   });
    }
  }, [isAuthenticated, onClose]);

  if (!isOpen) return null;

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      dispatch(
        googleLogin({
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.picture,
        })
      );
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error("Authentication failed. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const handleGoogleError = () => {
    toast.error("Google authentication cancelled", {
      position: "bottom-center",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <Sparkles className="text-yellow-300" size={48} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3">
            Welcome to Saliheen Perfumes
          </h2>

          {/* Subtitle */}
          <p className="text-gray-200 mb-8 text-lg">
            Sign in with your Google account to continue your luxurious
            fragrance journey
          </p>

          {/* Google Sign In Button */}
          <div className="flex justify-center mb-6">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                theme="filled_blue"
                size="large"
                text="continue_with"
                shape="rectangular"
                logo_alignment="left"
              />
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-center space-x-3 text-gray-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Fast & Secure Authentication</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">No Password Required</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-200">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">
                Instant Access to Your Cart & Orders
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="mt-8 text-xs text-gray-300">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
