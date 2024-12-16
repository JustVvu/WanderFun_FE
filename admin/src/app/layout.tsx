"use client"

import Providers from "./providers";
import "./theme/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className="font-Poppins bg-white2">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
