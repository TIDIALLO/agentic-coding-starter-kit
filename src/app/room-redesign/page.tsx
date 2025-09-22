"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Camera, Loader2, Sparkles, LayoutGrid, Download, Image as ImageIcon } from "lucide-react";

type RoomType =
    | "living_room"
    | "bedroom"
    | "kitchen"
    | "bathroom"
    | "dining_room"
    | "office"
    | "outdoor"
    | "other";

type DesignTheme =
    | "modern"
    | "minimalist"
    | "industrial"
    | "scandinavian"
    | "traditional"
    | "bohemian"
    | "rustic"
    | "coastal"
    | "vintage"
    | "luxury";

const themeOptions: { id: DesignTheme; label: string }[] = [
    { id: "modern", label: "Modern" },
    { id: "minimalist", label: "Minimalist" },
    { id: "industrial", label: "Industrial" },
    { id: "scandinavian", label: "Scandinavian" },
    { id: "traditional", label: "Traditional" },
    { id: "bohemian", label: "Bohemian" },
    { id: "rustic", label: "Rustic" },
    { id: "coastal", label: "Coastal" },
    { id: "vintage", label: "Vintage" },
    { id: "luxury", label: "Luxury" },
];

export default function RoomRedesignPage()
{
    const [roomType, setRoomType] = useState<RoomType>("living_room");
    const [selectedThemes, setSelectedThemes] = useState<DesignTheme[]>(["modern"]);
    const [variantSeed, setVariantSeed] = useState<number>(Math.floor(Math.random() * 1e6));
    const [intensity, setIntensity] = useState<"subtle" | "balanced" | "bold">("balanced");
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<Record<DesignTheme, string | { error: string }>>({});
    const [activeTheme, setActiveTheme] = useState<DesignTheme | null>(null);
    const [cooldown, setCooldown] = useState<number>(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const [showDownloadToast, setShowDownloadToast] = useState(false);
    const [showRedesignToast, setShowRedesignToast] = useState(false);
    useEffect(() =>
    {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    // Keep active theme in sync with selection
    useEffect(() =>
    {
        if (selectedThemes.length === 0) {
            setActiveTheme(null);
        } else if (!activeTheme || !selectedThemes.includes(activeTheme)) {
            setActiveTheme(selectedThemes[0]);
        }
    }, [selectedThemes, activeTheme]);

    // Fallback: simple themed preview using Canvas when API quota is exceeded
    const generateFallbackPreview = useCallback(async (src: string, theme: DesignTheme): Promise<string> =>
    {
        const img = await new Promise<HTMLImageElement>((resolve, reject) =>
        {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject as any;
            i.src = src;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return src;

        const filterByTheme: Record<DesignTheme, string> = {
            modern: "saturate(1.1) contrast(1.05)",
            minimalist: "grayscale(0.3) saturate(0.9) brightness(1.05)",
            industrial: "grayscale(0.6) contrast(1.15)",
            scandinavian: "saturate(0.95) brightness(1.08) hue-rotate(-10deg)",
            traditional: "saturate(1.05) brightness(1.02) hue-rotate(10deg)",
            bohemian: "saturate(1.35) hue-rotate(20deg)",
            rustic: "sepia(0.4) saturate(1.05)",
            coastal: "saturate(1.05) brightness(1.06) hue-rotate(-20deg)",
            vintage: "sepia(0.6) contrast(1.05)",
            luxury: "saturate(1.15) contrast(1.12)",
        };

        // @ts-expect-error - CanvasRenderingContext2D.filter exists in modern browsers
        ctx.filter = filterByTheme[theme] || "none";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Subtle vignette for polish
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            Math.min(canvas.width, canvas.height) / 4,
            canvas.width / 2,
            canvas.height / 2,
            Math.max(canvas.width, canvas.height) / 1.2
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.12)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas.toDataURL("image/jpeg", 0.9);
    }, []);

    const onDrop = useCallback((accepted: File[]) =>
    {
        const file = accepted[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) =>
        {
            const dataUrl = e.target?.result as string;
            setOriginalImage(dataUrl);
            setMimeType(file.type || "image/jpeg");
            setResults({});
            setFileName(file.name || null);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        maxFiles: 1,
        noClick: false,
        noKeyboard: true,
    });

    const canGenerate = useMemo(() => !!originalImage && selectedThemes.length > 0, [originalImage, selectedThemes]);

    const triggerRedesign = async () =>
    {
        if (!originalImage || !mimeType) return;
        setIsProcessing(true);
        setResults({});
        const base64 = originalImage.split(",")[1];
        const themesToGenerate = activeTheme ? [activeTheme] : selectedThemes.slice(0, 1);
        const res = await fetch("/api/redesign-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                imageData: base64,
                mimeType,
                roomType,
                themes: themesToGenerate,
                variantSeed,
                intensity,
            }),
        });
        let data: any = {};
        try {
            data = await res.json();
        } catch (e) {
            // If server returned non-JSON error, surface a generic error per theme
            const map: Record<DesignTheme, { error: string }> = {} as any;
            selectedThemes.forEach((t) => (map[t] = { error: "Server error: invalid response" }));
            setResults(map);
            setIsProcessing(false);
            return;
        }
        if (!res.ok) {
            const map: Record<DesignTheme, { error: string }> = {} as any;
            if (Array.isArray(data.results)) {
                (data.results || []).forEach((r: any) =>
                {
                    if (!r.success) map[r.theme as DesignTheme] = { error: r.error || "Failed" };
                });
            } else {
                themesToGenerate.forEach((t) => (map[t] = { error: data.error || "Failed" }));
            }
            setResults(map);
            if (typeof data.retryAfter === "number" && data.retryAfter > 0) {
                setCooldown(Math.ceil(data.retryAfter));
            }

            // Fallback previews if quota/rate limit blocks real generation
            if (data.errorType === "quota_exceeded" || data.errorType === "rate_limit") {
                const fallbackMap: Record<DesignTheme, string | { error: string }> = {} as any;
                for (const t of themesToGenerate) {
                    fallbackMap[t] = await generateFallbackPreview(originalImage, t);
                }
                setResults(fallbackMap);
            }
        } else {
            const map: Record<DesignTheme, string | { error: string }> = {} as any;
            (data.results || []).forEach((r: any) =>
            {
                if (r.success) map[r.theme as DesignTheme] = `data:${r.mimeType};base64,${r.enhancedImageData}`;
                else map[r.theme as DesignTheme] = { error: r.error || "Failed" };
            });
            setResults(map);
            // Success feedback toast
            setShowRedesignToast(true);
            setTimeout(() => setShowRedesignToast(false), 2500);
        }
        setIsProcessing(false);
    };

    const toggleTheme = (t: DesignTheme) =>
    {
        setResults({});
        setSelectedThemes((prev) =>
        {
            const has = prev.includes(t);
            if (has) return prev.filter((x) => x !== t);
            if (prev.length >= 4) return prev; // limit
            return [...prev, t];
        });
    };

    const downloadAll = () =>
    {
        Object.entries(results).forEach(([theme, value]) =>
        {
            if (typeof value === "string") {
                const a = document.createElement("a");
                a.href = value;
                a.download = `redesign_${theme}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center space-y-6 mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200/50 dark:border-blue-800/50">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Room Redesign (no payment)</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 dark:from-blue-100 dark:via-purple-100 dark:to-indigo-100 bg-clip-text text-transparent">
                        Redesign your room in seconds
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">Upload a photo, pick up to 4 themes, and generate multiple designs inspired by RoomGPT.</p>
                </div>
                {/* Removed steps block per request */}
                {cooldown > 0 && (
                    <div className="mb-6 mx-auto max-w-3xl rounded-xl border bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-3 text-sm">
                        Quota temporairement atteint. Réessaie dans ~{cooldown}s ou réduis le nombre de thèmes.
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-1 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl">
                        <CardHeader>
                            <CardTitle>Upload Room Image</CardTitle>
                            <CardDescription>Drop a room image or browse</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20" : "border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                            >
                                <input {...getInputProps()} />
                                {!originalImage ? (
                                    <div className="space-y-3">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center">
                                            <Camera className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">JPG, PNG, WebP</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={originalImage} alt="Selected" className="w-full h-full object-cover" />
                                        </div>
                                        {fileName && (
                                            <div className="text-xs text-slate-500 truncate">{fileName}</div>
                                        )}
                                        <div>
                                            <Button variant="outline" className="rounded-xl" type="button" onClick={open}>Change Image</Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {originalImage && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold">Room Type</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between rounded-xl">
                                                    <span className="truncate">
                                                        {{
                                                            living_room: "Living Room",
                                                            bedroom: "Bedroom",
                                                            kitchen: "Kitchen",
                                                            bathroom: "Bathroom",
                                                            dining_room: "Dining Room",
                                                            office: "Home Office",
                                                            outdoor: "Outdoor",
                                                            other: "Other",
                                                        }[roomType]}
                                                    </span>
                                                    <span className="opacity-70">▼</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                <DropdownMenuLabel>Room Type</DropdownMenuLabel>
                                                <DropdownMenuRadioGroup value={roomType} onValueChange={(v) => setRoomType(v as RoomType)}>
                                                    {([
                                                        ["living_room", "Living Room"],
                                                        ["bedroom", "Bedroom"],
                                                        ["kitchen", "Kitchen"],
                                                        ["bathroom", "Bathroom"],
                                                        ["dining_room", "Dining Room"],
                                                        ["office", "Home Office"],
                                                        ["outdoor", "Outdoor"],
                                                        ["other", "Other"],
                                                    ] as [RoomType, string][]).map(([value, label]) => (
                                                        <DropdownMenuRadioItem key={value} value={value}>
                                                            {label}
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold">Select Design Theme</h3>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between rounded-xl">
                                                    <span className="truncate">{activeTheme || "Choose design theme"}</span>
                                                    <span className="opacity-70">▼</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-full">
                                                <DropdownMenuLabel>Design Theme</DropdownMenuLabel>
                                                {themeOptions.map((t) => (
                                                    <DropdownMenuItem key={t.id} onClick={() =>
                                                    {
                                                        if (!selectedThemes.includes(t.id)) toggleTheme(t.id);
                                                        setActiveTheme(t.id);
                                                    }}>
                                                        {t.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <div className="text-xs text-slate-500">Active: {activeTheme || "—"}</div>
                                    </div>

                                    {/* Intensity buttons removed per request */}

                                    {/* Custom prompt removed per request */}

                                    <div className="flex justify-end">
                                        <Button disabled={!canGenerate || isProcessing || cooldown > 0} onClick={triggerRedesign} className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-70">
                                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            <span className="ml-2">{cooldown > 0 ? `Wait ${cooldown}s` : "Generate Design (1 credit)"}</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl rounded-3xl">
                        <CardHeader>
                            <CardTitle>Generated Design</CardTitle>
                            <CardDescription>Your redesigned room will appear here</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!originalImage ? (
                                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl flex items-center justify-center">
                                            <ImageIcon className="h-12 w-12 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upload an image to get started</h3>
                                            <p className="text-slate-600 dark:text-slate-400">Your redesigned variations will appear here</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                                        {activeTheme ? (
                                            typeof results[activeTheme] === "string" ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={results[activeTheme] as string} alt={activeTheme} className="w-full h-full object-cover" />
                                            ) : isProcessing ? (
                                                <div className="text-center space-y-4">
                                                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Generating {activeTheme} design...</p>
                                                </div>
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 justify-end">
                                        <Button
                                            variant="outline"
                                            className="rounded-xl px-4"
                                            onClick={() =>
                                            {
                                                const src = (activeTheme && typeof results[activeTheme] === "string") ? (results[activeTheme] as string) : (originalImage as string);
                                                const a = document.createElement("a");
                                                a.href = src;
                                                a.download = activeTheme ? `redesign_${activeTheme}.jpg` : `room.jpg`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                setShowDownloadToast(true);
                                                setTimeout(() => setShowDownloadToast(false), 2500);
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2" /> Download
                                        </Button>
                                        <Button
                                            className="rounded-xl"
                                            disabled={!canGenerate || isProcessing || cooldown > 0}
                                            onClick={async () =>
                                            {
                                                setVariantSeed(Math.floor(Math.random() * 1e6));
                                                await triggerRedesign();
                                            }}
                                        >
                                            New Design
                                        </Button>
                                    </div>

                                    {showDownloadToast && (
                                        <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-200 px-3 py-2 text-sm">
                                            Image downloaded successfully!
                                        </div>
                                    )}
                                    {showRedesignToast && (
                                        <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-200 px-3 py-2 text-sm">
                                            Room redesigned successfully!
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}


