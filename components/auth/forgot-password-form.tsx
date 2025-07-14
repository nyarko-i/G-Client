"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { forgotPassword } from "@/lib/api/auth";
import Image from "next/image";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
      toast.success("Please check your email for password reset instructions");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-sm mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-green-600">
            Check Your Email
          </h1>
          <p className="text-sm text-gray-600">
            We&apos;ve sent password reset instructions to your email address
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-6 space-y-4">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              If an account with email <strong>{email}</strong> exists, you will
              receive password reset instructions.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full h-10"
            >
              Try Different Email
            </Button>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-2xl bg-white/95 backdrop-blur-sm border-0">
      <CardHeader className="text-center pb-4">
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
        <h1 className="text-xl font-semibold text-gray-900">
          Admin Reset Password
        </h1>
        <p className="text-sm text-gray-600">
          Enter your email address to reset your password
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-10 bg-white"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset password"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Back to </span>
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
