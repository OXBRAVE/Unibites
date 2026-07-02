import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Uni Restaurant Cluster",
  description: "Manage and order from your favorite university restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Navbar />
          <main className="container" style={{ minHeight: "80vh", padding: "2rem 1.5rem" }}>
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}
