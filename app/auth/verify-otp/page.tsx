import type { Metadata } from "next";
import OTPVerificationForm from "@/components/auth/otp-verification-form";

// Page metadata for OTP verification
export const metadata: Metadata = {
  title: "Verify OTP - LMS Portal",
  description: "Verify your one-time password",
};

/**
 * OTP verification page component with background image
 * Handles the verification of one-time passwords sent to users
 */
export default function VerifyOTPPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/images/auth/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "1rem",
      }}
    >
      {/* Dark overlay for better card visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md px-4">
        <OTPVerificationForm />
      </div>
    </div>
  );
}
