// components/auth/reset-password-form.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { resetPassword } from "@/lib/api/auth";
import Image from "next/image";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If somehow this rendered without token, bounce back
  useEffect(() => {
    if (!token) {
      toast.error("Reset link invalid or expired");
      router.replace("/auth/forgot-password");
    }
  }, [token, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const { password, confirmPassword } = formData;
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setIsLoading(true);
    try {
      await resetPassword({ token, password: formData.password });
      setIsSuccess(true);
      toast.success("Password updated! You can now log in.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Reset failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-green-600">
            Password Reset Complete
          </CardTitle>
          <CardDescription className="text-center">
            Your password has been updated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <CheckCircle className="mx-auto w-12 h-12 text-green-600" />
            <p>You may now sign in with your new password.</p>
          </div>
          <Button onClick={() => router.push("/auth/login")} className="w-full">
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className=" rounded flex items-center justify-center">
            <Image
              src="/images/register/logo.png"
              alt="Your Logo"
              width={70}
              height={70}
              style={{ height: "auto" }}
              className="mx-auto mb-2"
            />
          </div>
        </div>
        <CardTitle className="text-center">Admin Reset Password</CardTitle>
        <CardDescription className="text-center">
          Create new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((s) => !s)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword((s) => !s)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full  bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>

          <p className="text-center text-sm">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              <span className="text-gray-800 ">Back to login page, </span>
              login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
