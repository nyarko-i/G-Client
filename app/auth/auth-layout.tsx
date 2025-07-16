import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: "Authentication",
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center relative "
      style={{
        backgroundImage: "url('/images/auth/bg2.png')",
        backgroundSize: "cover",
        backgroundPosition: "",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "1rem",
      }}
    >
      {/* Dark overlay for all auth pages */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  );
}
