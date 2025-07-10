import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

// Page-specific metadata for the registration page
export const metadata: Metadata = {
  title: "Admin Registration - LMS Portal",
  description: "Register as an LMS administrator",
};

/**
 * Registration page component with background image
 * Renders the admin registration form overlaid on the background image
 */
export default function RegisterPage() {
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
        <RegisterForm />
      </div>
    </div>
  );
}
