"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const { user, setUser } = useAuth();
  console.log("user", user);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3002/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <img className="h-9 w-9" src="./favicon.ico" alt="" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              DEVLOG
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#features"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#roadmap"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Roadmap
          </a>
          <a
            href="#tech"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Tech Stack
          </a>
        </nav>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button className="hidden md:inline-flex">
                Dashboard
              </Button>
            </Link>
            {/* <Link onClick={handleLogout} href="/auth"> */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hidden md:inline-flex"
            >
              Logout
            </Button>
            {/* </Link> */}
          </div>
        ) : (
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
