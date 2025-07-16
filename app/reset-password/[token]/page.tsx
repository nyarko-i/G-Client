import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import AuthLayout from "@/app/auth/auth-layout";

export const metadata: Metadata = {
  title: "Reset Password — LMS Portal",
  description: "Set your new password",
};

interface PageProps {
  params: { token: string };
}

// mark the page component async so `params` is resolved
export default async function ResetPasswordPage({ params }: PageProps) {
  const { token } = params;

  return (
    <AuthLayout>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
