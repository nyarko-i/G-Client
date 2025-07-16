"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";

export default function OTPVerificationForm() {
  const router = useRouter();

  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 6) setOtpCode(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6‑digit code");
      return;
    }

    // Convert to number and guard
    const numericToken = Number(otpCode.trim());
    if (Number.isNaN(numericToken)) {
      toast.error("Invalid code format");
      setOtpCode("");
      return;
    }

    setIsLoading(true);
    try {
      // Send only { token: number }
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: numericToken }),
      });

      const payload = (await res.json()) as {
        success: boolean;
        message?: string;
        errors?: { message: string }[];
      };

      if (res.ok && payload.success) {
        toast.success("Account verified successfully");
        router.push("/auth/login");
        return;
      }

      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        payload.errors.forEach((err) => toast.error(err.message));
      } else if (payload.message) {
        toast.error(payload.message);
      } else {
        toast.error("Verification failed");
      }

      setOtpCode("");
    } catch (err) {
      toast.error("Verification error", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
      setOtpCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // resend endpoint typically just needs email
        body: JSON.stringify({
          /*  resend payload  */
        }),
      });

      const payload = (await res.json()) as {
        success: boolean;
        message?: string;
        errors?: { message: string }[];
      };

      if (res.ok && payload.success) {
        toast.success("A new code has been sent to your email");
        setResendTimer(60);
        setOtpCode("");
      } else if (Array.isArray(payload.errors)) {
        payload.errors.forEach((err) => toast.error(err.message));
      } else if (payload.message) {
        toast.error(payload.message);
      } else {
        toast.error("Failed to resend code");
      }
    } catch (err) {
      toast.error("Resend failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setIsResending(false);
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
            style={{ height: "auto", width: "auto" }}
            className="mx-auto mb-2"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-600">
          Enter the 6‑digit code sent to your email
        </p>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label
              htmlFor="otpCode"
              className="text-sm font-medium text-gray-700"
            >
              Code
            </Label>
            <Input
              id="otpCode"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              onChange={handleOtpChange}
              className="h-10 text-center text-lg font-mono tracking-widest bg-white"
              placeholder="000000"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || otpCode.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>

          <div className="text-center text-sm">
            {resendTimer > 0 ? (
              <span className="text-gray-500">
                Resend available in {resendTimer} seconds
              </span>
            ) : (
              <>
                <span className="text-gray-600">Didn`t receive the code? </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-500 p-0 h-auto font-medium"
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
