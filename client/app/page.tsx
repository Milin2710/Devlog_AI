"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  Tags,
  Brain,
  Code,
  TrendingUp,
  Zap,
  BookOpen,
  Target,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user, setUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Zap className="h-4 w-4 mr-2" />
            {user
              ? "Welcome Back to Your Coding Journal"
              : "Your Personal Coding Journal with AI Superpowers"}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            {user ? "Keep Building," : "Track Every"}
            <span className="text-blue-600 block">
              {user ? "Keep Growing" : "Coding Breakthrough"}
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            {user
              ? "Your personal coding journey is one entry away. Log today’s lessons, track your errors, and reflect on your breakthroughs — all enhanced by AI."
              : "A personal web app to capture your daily coding learnings, errors,and victories. Searchable, taggable, and enhanced by AI to accelerate your growth."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="text-lg px-8 py-3">
                {user ? (
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                ) : (
                  <BookOpen className="h-5 w-5 mr-2" />
                )}
                {user ? "Go to Journals" : "Start Your Journey"}
              </Button>
            </Link>
            <Link href={user ? "/dashboard/new" : "/demo"}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                {user ? (
                  <Plus className="h-5 w-5 mr-2" />
                ) : (
                  <BookOpen className="h-5 w-5 mr-2" />
                )}
                {user ? "New Entry" : "View Demo"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Built for developers who want to stay sharp while mastering DSA
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Calendar className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Daily Entries</CardTitle>
                <CardDescription>
                  Log your coding learnings, errors, and breakthroughs with
                  timestamps
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Tags className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Smart Tagging</CardTitle>
                <CardDescription>
                  Organize entries by topics, languages, and concepts for easy
                  retrieval
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Search className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Full-Text Search</CardTitle>
                <CardDescription>
                  Find any entry instantly with powerful search across all your
                  logs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Brain className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>AI Summaries</CardTitle>
                <CardDescription>
                  Get AI-powered insights and summaries of your learning
                  patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Visualize your coding journey with streaks and learning
                  analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Target className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>Blog Draft Generator</CardTitle>
                <CardDescription>
                  Transform your journal entries into ready-to-edit blog post
                  drafts with AI assistance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Pro-Level Tech Stack
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Modern, scalable technologies for a production-ready application
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Next.js</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      App Router
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Utility-first styling
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">shadcn/ui</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Clean components
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">NestJS</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Modular & scalable
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Type ORM</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Type-safe database
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">PostgreSQL</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Reliable data storage
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">
                  AI Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Gemini API</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Smart summaries
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Vercel</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Frontend deployment
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Render</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Backend & DB hosting
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Redis</Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Caching & jobs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {user
              ? "Log today's coding journey"
              : "Start Your Coding Journey Today"}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Built for YOU. Improves dev + DSA retention. Showcases full-stack +
            AI skills.
          </p>
          <Link href={user ? "/dashboard/new" : "/auth"}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              {user ? "Create Your Journal" : "Get Started Free"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">DEVLOG</span>
          </div>
          <p className="text-slate-400 mb-4">
            One project, lifelong benefit. Your personal coding companion.
          </p>
          <p className="text-sm text-slate-500">
            © 2025 DEVLOG. Built with passion for developers.
          </p>
        </div>
      </footer>
    </div>
  );
}
