"use client";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "../context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
