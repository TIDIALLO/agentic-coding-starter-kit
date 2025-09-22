"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Building2, Calendar, Users, FileText, TrendingUp, Plus, Sparkles, Edit3, Trash2, Settings, Camera } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Protected Page</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access the dashboard
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-6 py-8">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 dark:border-blue-800/50">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Agent Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Welcome back, {session.user.name}! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Here&apos;s what&apos;s happening with your real estate business today
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-6"
            >
              <Link href="/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 rounded-xl px-6 transition-all duration-300"
            >
              <Link href="/image-enhancement">
                <Camera className="h-4 w-4 mr-2" />
                Enhance Images
              </Link>
            </Button>
          </div>
        </div>

        {/* Beautiful Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Properties</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building2 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-blue-100">+2 from last month 📈</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Scheduled Visits</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-emerald-100">This week 🗓️</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Active Prospects</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-purple-100">+5 new this week ✨</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Contracts Signed</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-orange-100">This month 🎉</p>
            </CardContent>
          </Card>
        </div>

        {/* Modern Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Recent Properties - Enhanced */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Recent Properties</CardTitle>
                  <CardDescription>Your latest listings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Modern Apartment Downtown</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">€850,000 • For Sale 🏡</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1 text-xs">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 text-xs">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Family House with Garden</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">€1,200/month • For Rent 🏠</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3 py-1 text-xs">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 text-xs">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300 rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/properties">
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Properties
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Visits - Enhanced */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Upcoming Visits</CardTitle>
                  <CardDescription>Scheduled appointments</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl border border-purple-100/50 dark:border-purple-800/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Modern Apartment Visit</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Tomorrow at 2:00 PM • John Doe 👨</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-3 py-1 text-xs">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl border border-orange-100/50 dark:border-orange-800/30 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Family House Visit</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Friday at 10:00 AM • Jane Smith 👩</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 py-1 text-xs">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-gradient-to-r from-slate-50 to-emerald-50 hover:from-emerald-50 hover:to-green-50 border-emerald-200 hover:border-emerald-300 rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/visits">
                  <Calendar className="h-4 w-4 mr-2" />
                  View All Visits
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions - Enhanced */}
          <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                  <CardDescription>Frequently used actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/properties/new">
                  <Building2 className="h-5 w-5 mr-3" />
                  🏡 Add New Property
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/visits/new">
                  <Calendar className="h-5 w-5 mr-3" />
                  📅 Schedule Visit
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/prospects/new">
                  <Users className="h-5 w-5 mr-3" />
                  👥 Add Prospect
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/contracts/new">
                  <FileText className="h-5 w-5 mr-3" />
                  📄 Generate Contract
                </Link>
              </Button>

              <Button
                className="w-full justify-start bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-0 shadow-lg rounded-2xl h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/image-enhancement">
                  <Camera className="h-5 w-5 mr-3" />
                  ✨ Enhance Images
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview - Enhanced Full Width */}
        <Card className="mt-8 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">This Month&apos;s Performance Dashboard</CardTitle>
                <CardDescription>Your key business metrics and achievements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl text-center hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Properties Listed 🏘️</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl text-center hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-emerald-600">18</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Visits Completed ✅</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-2xl text-center hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Contracts Signed 📋</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl text-center hover:shadow-md transition-all">
                <div className="text-2xl font-bold text-orange-600">€12,500</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Revenue Generated 💰</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-lg rounded-2xl px-8 h-12 font-semibold transition-all duration-300"
                asChild
              >
                <Link href="/analytics">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  📊 View Detailed Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
