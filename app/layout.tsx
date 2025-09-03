import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { JobsProvider } from "@/lib/jobs-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hireloom - AI Recruiting Platform",
  description:
    "Advanced AI-powered recruiting platform for modern hiring teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <JobsProvider>
            {children}
            <Toaster />
          </JobsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
