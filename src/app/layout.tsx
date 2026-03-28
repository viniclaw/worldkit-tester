import type { Metadata } from "next";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "WorldKit Tester",
  description: "Test all MiniKit commands in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body className="bg-gray-950 text-white min-h-screen">
          {children}
        </body>
      </MiniKitProvider>
    </html>
  );
}
