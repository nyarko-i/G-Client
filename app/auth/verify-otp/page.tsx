import type { Metadata } from "next";
import OTPVerificationForm from "@/components/auth/otp-verification-form";
import AuthLayout from "../auth-layout";

// Page metadata for OTP verification
export const metadata: Metadata = {
  title: "Verify OTP - LMS Portal",
  description: "Verify your one-time password",
};

export default function VerifyOTPPage() {
  return (
    <AuthLayout>
      <OTPVerificationForm />
    </AuthLayout>
  );
}
