import { redirect } from "next/navigation";

/**
 * Root page component that redirects to login
 * This ensures users always start at the authentication flow
 */
export default function HomePage() {
  // Redirect to login page as the entry point for authentication
  redirect("/auth/login");
}
