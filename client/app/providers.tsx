"use client";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbarRoutes = ["/demo"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);
  return (
    <AuthProvider>
      {shouldShowNavbar && <Navbar />}
      {!shouldShowNavbar && (
        <>
          <div className="absolute top-4 left-0 z-50 w-full px-4 py-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                DEVLOG
              </span>
            </Link>
          </div>
        </>
      )}
      {children}
    </AuthProvider>
  );
}
