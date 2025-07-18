"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@/lib/api/auth";

//  what  API returns
interface LoginSuccessPayload {
  success: true;
  token: string;
  message?: string;
  user?: User;
}

interface LoginErrorPayload {
  success: false;
  errors?: { message: string }[];
  message?: string;
}

type LoginResponse = LoginSuccessPayload | LoginErrorPayload;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Tell TS exactly what shape to expect
      const payload = (await res.json()) as LoginResponse;

      // If it succeeded and we have a token:
      if (res.ok && payload.success) {
        toast.success("Login successful", { description: payload.message });
        localStorage.setItem("token", payload.token);
        if (payload.user) {
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
        await router.replace("/dashboard");
        return;
      }

      // Otherwise, payload.success === false
      if ("errors" in payload && payload.errors && payload.errors.length > 0) {
        payload.errors.forEach((err) => toast.error(err.message));
      } else if (payload.message) {
        toast.error(payload.message);
      } else {
        toast.error("Login failed");
      }
    } catch (err: unknown) {
      // Handle unknown errors safely
      const message = err instanceof Error ? err.message : "Please try again.";
      toast.error("Login error", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-2xl bg-white/90 backdrop-blur-sm border-0">
      <CardHeader className="text-center pb-4">
        <Image
          src="/images/register/logo.png"
          alt="Your Logo"
          width={64}
          height={64}
          style={{ height: "auto", width: "auto" }}
          className="mx-auto mb-2"
        />
        <h1 className="text-xl font-semibold text-gray-900">Admin Login</h1>
        <p className="text-sm text-gray-600">
          Login to manage and access the dashboard effortlessly.
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
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

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-10 bg-white"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-left text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Sign in"}
          </Button>

          {/* Signup Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Don’t have an account? </span>
            <Link
              href="/auth/register"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
