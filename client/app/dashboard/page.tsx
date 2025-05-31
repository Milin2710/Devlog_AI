"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { JournalEntryCard } from "@/components/journal-entry-card"
import type { JournalEntry } from "@/lib/types"
import { Plus, Search, BookOpen, TrendingUp, Tags } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal")
      if (response.ok) {
        const data = await response.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        const response = await fetch(`/api/journal/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          setEntries(entries.filter((entry) => entry.id !== id))
        }
      } catch (error) {
        console.error("Error deleting entry:", error)
      }
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalEntries = entries.length
  const totalTags = [...new Set(entries.flatMap((entry) => entry.tags))].length
  const thisWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return entryDate >= weekAgo
  }).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Loading your journal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Coding Journal</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">
                Track your learning journey and coding breakthroughs
              </p>
            </div>
            <Link href="/dashboard/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                New Entry
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalEntries}</p>
                <p className="text-slate-600 dark:text-slate-300">Total Entries</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{thisWeekEntries}</p>
                <p className="text-slate-600 dark:text-slate-300">This Week</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <Tags className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalTags}</p>
                <p className="text-slate-600 dark:text-slate-300">Unique Tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search entries, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            {entries.length === 0 ? (
              <div>
                <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Your Coding Journal</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
                  Document your daily learnings, breakthroughs, and coding challenges. Every entry helps you grow as a
                  developer.
                </p>
                <Link href="/dashboard/new">
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Entry
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No entries found</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Try adjusting your search query or create a new entry.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
