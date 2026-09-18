import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Crewmate — The creators behind your next great story",
    template: "%s · Crewmate",
  },
  description:
    "Crewmate is a community of content creators. Discover talent, explore their work, and send a project request to brands' next favourite creators.",
  keywords: [
    "content creators",
    "UGC",
    "creator marketplace",
    "reels",
    "video production",
    "photography",
    "brand content",
  ],
  openGraph: {
    type: "website",
    siteName: "Crewmate",
    title: "Crewmate — The creators behind your next great story",
    description:
      "A community of content creators for brands and clients. Discover, choose, request, create.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Crewmate — creator community & talent platform",
    description: "Discover creators, explore their work, and start a project.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Apply saved theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
