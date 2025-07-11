import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";

// Page-specific metadata for the registration page
export const metadata: Metadata = {
  title: "Admin Login - LMS Portal",
  description: "Login as Admin",
};

/**
 * login page component with background
 */
export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  );
}
