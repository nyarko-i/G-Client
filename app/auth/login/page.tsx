// app/auth/login/page.tsx
import LoginForm from "@/components/auth/login-form";
import type { Metadata } from "next";
import AuthLayout from "../auth-layout";

export const metadata: Metadata = {
  title: "Admin Login - LMS Portal",
  description: "Login as Admin",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
