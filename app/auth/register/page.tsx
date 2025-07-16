import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";
import AuthLayout from "../auth-layout";

// Page-specific metadata for the registration page
export const metadata: Metadata = {
  title: "Admin Registration - LMS Portal",
  description: "Register as an LMS administrator",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
