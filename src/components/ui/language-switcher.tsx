"use client";

import { useI18n } from "@/lib/i18n";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";

export function LanguageSwitcher()
{
    const { locale, setLocale, t } = useI18n();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    {t.common.language}: {locale === "en" ? t.common.english : t.common.french}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale("en")}>{t.common.english}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale("fr")}>{t.common.french}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


