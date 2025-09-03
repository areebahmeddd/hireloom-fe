"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Github,
  Chrome,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { signUpWithEmail, SignUpData } from "@/lib/auth";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn: () => void;
}

export function SignUpDialog({
  open,
  onOpenChange,
  onSwitchToSignIn,
}: SignUpDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const signUpData: SignUpData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        password: formData.password,
      };

      await signUpWithEmail(signUpData);

      toast.success("Account created successfully!", {
        description: "Welcome to Hireloom. Redirecting to dashboard...",
      });

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);

      // Redirect to dashboard after successful signup
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Failed to create account. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "An account with this email already exists.";
            setErrors({ email: errorMessage });
            break;
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            setErrors({ email: errorMessage });
            break;
          case "auth/weak-password":
            errorMessage =
              "Password is too weak. Please choose a stronger password.";
            setErrors({ password: errorMessage });
            break;
          case "auth/network-request-failed":
            errorMessage =
              "Network error. Please check your connection and try again.";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }

      toast.error("Sign up failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create your account
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" type="button">
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                required
              />
              {errors.name && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                required
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="company"
                type="text"
                placeholder="Enter your company name"
                className={`pl-10 ${errors.company ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={formData.company}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, company: e.target.value }));
                  if (errors.company)
                    setErrors((prev) => ({ ...prev, company: "" }));
                }}
                required
              />
              {errors.company && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.company}
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }));
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="text-xs text-slate-600">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          {/* Switch to Sign In */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              onClick={onSwitchToSignIn}
            >
              Sign in
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
