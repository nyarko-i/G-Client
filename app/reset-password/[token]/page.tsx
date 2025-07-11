// app/reset-password/[token]/page.tsx
import Image from "next/image";
import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/reset-password-form";

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
    <div className="relative min-h-screen flex items-center justify-center">
      <Image
        src="/images/auth/bg.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <main className="relative z-10 w-full max-w-md p-4">
        <ResetPasswordForm token={token} />
      </main>
    </div>
  );
}
