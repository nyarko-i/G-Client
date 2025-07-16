// app/auth/forgot-password/page.tsx
import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import AuthLayout from "../auth-layout";

export const metadata: Metadata = {
  title: "Forgot Password – LMS Portal",
  description: "Recover your password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
