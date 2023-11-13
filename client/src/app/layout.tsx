import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/components/ReduxProvider";
import { Toaster } from "react-hot-toast";

const ubuntu = Ubuntu({
  weight: ["400"],
  subsets: ["latin"],
  display: "block",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <html lang="en">
        <head>
          <title>PollHub</title>
          <meta name="description" content="Website for polls" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={ubuntu.className}>
          <Toaster />
          <Navbar />
          {children}
        </body>
      </html>
    </ReduxProvider>
  );
}
