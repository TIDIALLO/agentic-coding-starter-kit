"use client";

import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { Building2, Sparkles, Camera, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./ui/language-switcher";

export function SiteHeader()
{
  const { t } = useI18n();
  return (
    <header className="border-b border-white/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link
            href="/"
            className="flex items-center gap-3 text-primary hover:text-primary/80 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-2xl font-bold">
              ImmoBoost
            </span>
          </Link>
        </h1>

        <nav className="hidden lg:flex items-center gap-2">
          <Link
            href="/properties"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
          >
            🏘️ {t.header.properties}
          </Link>
          <Link
            href="/visits"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-300"
          >
            📅 {t.header.visits}
          </Link>
          <Link
            href="/prospects"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-300"
          >
            👥 {t.header.prospects}
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-300"
          >
            📊 {t.header.dashboard}
          </Link>
          <Link
            href="/room-redesign"
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ml-2"
          >
            <Camera className="h-4 w-4" />
            ✨ {t.header.roomRedesign}
          </Link>
          <Link
            href="/social-studio"
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 rounded-xl transition-all duration-300 flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            {t.header.socialShare}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Link
            href="/image-enhancement"
            className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 mr-4"
          >
            <Sparkles className="h-3 w-3" />
            {t.header.aiShort}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <UserProfile />
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
