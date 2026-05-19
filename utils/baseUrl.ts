/**
 * Utility to get the base URL of the application.
 * It checks for common environment variables used in different hosting environments.
 */
export function getBaseUrl(): string {
  // Use NEXTAUTH_URL if available (standard for NextAuth projects)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Use NEXT_PUBLIC_APP_URL if defined (common custom variable)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Fallback to VERCEL_URL if on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Final fallback to localhost for development
  return "http://localhost:3000";
}
