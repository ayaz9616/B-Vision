import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "B-Vision: Smart Review Sentiment Analyzer",
  description: "Easily upload customer reviews and get detailed, feature-based sentiment analysis for smartphones. Gain deep insights to improve your product strategy.",
  keywords: ["Sentiment Analysis", "Smartphone Reviews", "Feature Sentiment", "AI Review Analyzer", "Customer Feedback", "B-Vision", "Review Insights", "Product Improvement"],
  authors: [{ name: "Mohammad Ayaz" }],
  creator: "B-Vision Team",
  openGraph: {
    title: "B-Vision: Smart Review Sentiment Analyzer",
    description: "Upload customer reviews and visualize feature-based sentiment insights for smartphones.",
    url: "https://your-domain.com",
    siteName: "B-Vision",
    images: [
      {
        url: "/logo.png", 
        width: 1200,
        height: 630,
        alt: "B-Vision Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "B-Vision: Smart Review Sentiment Analyzer",
    description: "Visualize feature-based sentiment analysis for smartphone reviews with B-Vision.",
    images: ["/logo.png"],
    creator: "@your_twitter_handle",
  },
  icons: {
    icon: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "Technology",
};

// ✅ fix the themeColor warning:
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
