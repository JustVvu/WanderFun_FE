"use client"

import { AppSidebar } from "./components/AppSidebar";
import { usePathname } from 'next/navigation';
import "./theme/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const noSidebarRoutes = ['/login'];

  const showSidebar = !noSidebarRoutes.includes(pathname);


  return (
    <html lang="en">
      <body className="flex flex-row font-Poppins bg-white2">
        {
          showSidebar &&
          <div className="w-fit shadow-2xl bg-white">
            <AppSidebar />
          </div>
        }
        <div className="flex-auto h-fit min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
