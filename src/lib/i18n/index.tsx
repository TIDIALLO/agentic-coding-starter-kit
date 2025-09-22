"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import type { Dictionary, SupportedLocale } from "./types";

type I18nContextValue = {
    locale: SupportedLocale;
    t: Dictionary;
    setLocale: (locale: SupportedLocale) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const DICTS: Record<SupportedLocale, Dictionary> = { en, fr } as const;
const STORAGE_KEY = "locale";

export function I18nProvider({ children, initialLocale = "en" as SupportedLocale }: { children: React.ReactNode; initialLocale?: SupportedLocale })
{
    const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);

    useEffect(() =>
    {
        const saved = (typeof window !== "undefined" && (localStorage.getItem(STORAGE_KEY) as SupportedLocale | null)) || null;
        if (saved && (saved === "en" || saved === "fr")) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (next: SupportedLocale) =>
    {
        setLocaleState(next);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, next);
            document.documentElement.lang = next;
        }
    };

    const value = useMemo<I18nContextValue>(() => ({
        locale,
        t: DICTS[locale],
        setLocale,
    }), [locale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n()
{
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
}


