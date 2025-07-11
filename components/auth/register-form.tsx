"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const { firstName, lastName, email, password, confirmPassword, phone } =
      formData;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields.",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Validation Error", {
        description: "Passwords do not match.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          contact: formData.phone,
        }),
      });

      const payload = (await res.json()) as {
        success: boolean;
        message?: string;
        errors?: { message: string }[];
      };

      // 1) Success → go to OTP
      if (res.ok && payload.success) {
        toast.success("Registration Successful", {
          description: payload.message || "Check your email for verification.",
        });
        localStorage.setItem("email", formData.email);
        setTimeout(() => router.push("/auth/verify-otp"), 100);
        return;
      }

      // Helper to detect "already exists"
      const isAlreadyExists = (msg: string) =>
        msg.toLowerCase().includes("already exist");

      // 2) Errors array
      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        payload.errors.forEach((err) => toast.error(err.message));

        // if one of them is "User already exists", redirect after toast
        if (payload.errors.some((err) => isAlreadyExists(err.message))) {
          setTimeout(() => router.push("/auth/login"), 1500);
        }
        return;
      }

      // 3) Single message
      if (payload.message) {
        toast.error(payload.message);
        if (isAlreadyExists(payload.message)) {
          setTimeout(() => router.push("/auth/login"), 1500);
        }
        return;
      }

      // 4) Fallback
      toast.error("Registration failed");
    } catch (err) {
      toast.error("Registration Failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/register/logo.png"
            alt="Your Logo"
            width={64}
            height={64}
            style={{ height: "auto" }}
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Admin Sign up</h1>
        <p className="text-sm text-gray-600">
          Create your Account to Manage and Access the Dashboard Effortlessly
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-1">
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="pl-10 h-10 bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label htmlFor="lastName">Last name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="pl-10 h-10 bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-10 bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 h-10 bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-10 bg-white"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-10 bg-white"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
