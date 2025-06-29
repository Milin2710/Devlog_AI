"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import {
  Code,
  Menu,
  Plus,
  LayoutDashboard,
  LogOut,
  Settings,
  Moon,
  Sun,
  Calendar,
  LogOutIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LoadingBar from "react-top-loading-bar";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [progress, setProgress] = useState(0);

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    {
      name: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      name: "New Entry",
      href: "/dashboard/new",
      icon: Plus,
    },
  ];

  useEffect(() => {
    setProgress(20);

    setTimeout(() => {
      setProgress(40);
    }, 100);

    setTimeout(() => {
      setProgress(100);
    }, 400);
  }, [pathname]);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
      <LoadingBar
        color="#0761d1"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="max-w-screen-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <img className="h-9 w-9" src="/favicon.ico" alt="" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              DEVLOG
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Link href="/dashboard">
              <Button className="hidden md:inline-flex">
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hidden md:inline-flex"
            >
              <LogOutIcon className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 hidden md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Link href="/auth" className="hidden md:inline-flex">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-6 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center gap-2">
                  {/* <Code className="h-6 w-6 text-blue-600" /> */}
                  <img className="h-6 w-6" src="/favicon.ico" alt="" />
                  <span className="text-xl font-bold">DEVLOG</span>
                </div>
                {user ? (
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-2 py-2 text-base font-medium rounded-md transition-colors",
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                    <Button
                      onClick={() => {
                        setOpen(false);
                        handleLogout;
                      }}
                      className={cn(
                        "flex items-center gap-3 px-2 py-2 text-base font-medium rounded-md transition-colors hover:bg-slate-800 dark:hover:bg-slate-100"
                      )}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </nav>
                ) : (
                  <nav className="flex flex-col gap-4">
                    <Link
                      href="/auth"
                      className="flex justify-center items-center gap-3 px-2 py-2 text-base font-medium rounded-md transition-colors dark:text-black dark:bg-slate-100 hover:bg-slate-700 text-white bg-slate-800 dark:hover:bg-slate-200 "
                    >
                      <Plus className="h-5 w-5" />
                      <span>Get Started</span>
                    </Link>
                  </nav>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
