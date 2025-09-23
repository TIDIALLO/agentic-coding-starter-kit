"use client";

import { useI18n } from "@/lib/i18n";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { Globe, Languages } from "lucide-react";

export function LanguageSwitcher()
{
    const { locale, setLocale, t } = useI18n();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Globe className="h-4 w-4" />
                    {locale === "en" ? "EN" : "FR"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => setLocale("fr")}>
                    🇫🇷 <span className="ml-2">{t.common.french}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("en")}>
                    🇬🇧 <span className="ml-2">{t.common.english}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


