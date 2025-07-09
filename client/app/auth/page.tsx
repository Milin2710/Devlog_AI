"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Code, Github, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useRouter();

  const loginsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/user",
        {
          withCredentials: true,
        }
      );
      setUser(res.data);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate.push("/");
      }, 1000);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img className="h-8 w-8" src="/favicon.ico" alt="" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              DEVLOG
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Sign in to continue your coding journey
          </p>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <p className="text-red-500 text-center">{error}</p>
          <p className="text-green-500 text-center">{success}</p>
          <Separator className="my-4" />
          <CardContent className="space-y-4">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={loginsubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
            <p className="text-red-500 text-center">{error}</p>
            <p className="text-green-500 text-center">{success}</p>
            <div className="text-center text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>

            <Separator />

            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
              {"Don't have an account? "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="mt-6 border border-slate-200 dark:border-slate-700">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-center">
              What you'll get:
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-600 rounded-full mr-3"></div>
                Personal coding journal with AI insights
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-green-600 rounded-full mr-3"></div>
                Smart tagging and full-text search
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-purple-600 rounded-full mr-3"></div>
                Progress tracking and learning analytics
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-orange-600 rounded-full mr-3"></div>
                Export and CLI integration (coming soon)
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
