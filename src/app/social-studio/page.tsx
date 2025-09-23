"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { Facebook, Instagram, Twitter, Music2, Trash2, Linkedin } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function SocialStudioPage()
{
    const { t } = useI18n();
    const { data: session, isPending } = useSession();
    const [text, setText] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [platforms, setPlatforms] = useState<Record<string, boolean>>({ facebook: true, instagram: false, linkedin: false, x: false, tiktok: false });
    const [scheduledAt, setScheduledAt] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const toggle = (p: string) => setPlatforms((prev) => ({ ...prev, [p]: !prev[p] }));

    const submit = async () =>
    {
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch("/api/social/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    mediaUrl: mediaUrl || undefined,
                    platforms: (Object.keys(platforms) as Array<keyof typeof platforms>).filter((k) => platforms[k]) as any,
                    scheduledAt: scheduledAt || undefined,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed");
            setMessage("✅ Scheduled successfully");
        } catch (e) {
            setMessage("❌ Failed to schedule");
        } finally {
            setSubmitting(false);
        }
    };

    if (isPending) return null;
    if (!session) {
        return (
            <main className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>{t.social.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{t.social.signInRequired}</p>
                        <p className="text-sm text-slate-500">{t.social.connectAccountsHint}</p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>{t.social.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.social.imagesLabel}</label>
                        <div className="flex flex-wrap gap-2">
                            {images.map((src, idx) => (
                                <div key={idx} className="relative h-20 w-20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt="img" className="h-20 w-20 object-cover rounded-md border" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute -top-2 -right-2 bg-white/90 dark:bg-slate-900/90 border rounded-full p-1 shadow hover:bg-red-50"
                                        aria-label="Remove image"
                                        title="Remove"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={() =>
                            {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.multiple = true;
                                input.onchange = async () =>
                                {
                                    const files = Array.from(input.files || []);
                                    const readers = files.map(f => new Promise<string>((resolve) =>
                                    {
                                        const r = new FileReader();
                                        r.onload = () => resolve(String(r.result));
                                        r.readAsDataURL(f);
                                    }));
                                    const dataUrls = await Promise.all(readers);
                                    setImages(prev => [...prev, ...dataUrls]);
                                };
                                input.click();
                            }}>{t.social.addImagesCta}</Button>
                            <Button type="button" variant="outline" className="rounded-xl flex items-center gap-2" onClick={async () =>
                            {
                                if (images.length === 0) return;
                                const url = await generateSlideshowWebMClient(images, { prefer4K: false, secondsPerSlide: 2.2, includeCalmAudio: true });
                                setVideoUrl(url);
                            }}>
                                <Music2 className="h-4 w-4" />
                                {t.social.createVideoCta}
                            </Button>
                        </div>
                        {videoUrl && (
                            <div className="mt-3">
                                <div className="text-sm font-medium mb-1">{t.social.videoPreview}</div>
                                <video className="w-full rounded-lg" src={videoUrl} controls />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.social.textLabel}</label>
                        <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.social.textLabel + "..."} />
                        <div className="mt-2">
                            <Button type="button" variant="outline" className="rounded-xl" onClick={async () =>
                            {
                                try {
                                    const res = await fetch('/api/social/caption', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ context: text, locale: 'fr' }) });
                                    const json = await res.json();
                                    if (res.ok && json.caption) setText(json.caption);
                                } catch { }
                            }}>{t.social.generateCaptionCta}</Button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">{t.social.mediaUrlLabel}</label>
                        <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">{t.social.platformsLabel}</label>
                        <div className="flex flex-wrap gap-2">
                            {(["facebook", "instagram", "linkedin", "x", "tiktok"] as const).map((p) => (
                                <Button key={p} type="button" variant={platforms[p] ? "default" : "outline"} onClick={() => toggle(p)} className="rounded-xl">
                                    {p}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.social.scheduleAtLabel}</label>
                            <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={submit} disabled={submitting || !text.trim()} className="rounded-xl">{t.social.scheduleCta}</Button>
                        <Button onClick={() => submit()} disabled={submitting || !text.trim()} variant="outline" className="rounded-xl">{t.social.publishNowCta}</Button>
                        <Button onClick={() => history.back()} variant="ghost" className="rounded-xl">{t.social.cancelCta}</Button>
                        {message && <span className="text-sm">{message}</span>}
                        <div className="ml-auto flex items-center gap-2">
                            <Facebook className="h-4 w-4 text-blue-600" title="Facebook" />
                            <Instagram className="h-4 w-4 text-pink-600" title="Instagram" />
                            <Linkedin className="h-4 w-4 text-blue-700" title="LinkedIn" />
                            <Twitter className="h-4 w-4 text-sky-500" title="Twitter/X" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

async function generateSlideshowWebMClient(imageDataUrls: string[], opts: { prefer4K?: boolean; secondsPerSlide?: number; includeCalmAudio?: boolean } = {}): Promise<string>
{
    const prefer4K = opts.prefer4K ?? false;
    const secondsPerSlide = opts.secondsPerSlide ?? 2.2;
    const imgs = await Promise.all(imageDataUrls.map(loadImage));
    const maxW = Math.max(...imgs.map(i => i.width));
    const maxH = Math.max(...imgs.map(i => i.height));
    const maxSide = prefer4K ? 2160 : 1080;
    const scale = Math.min(1, maxSide / Math.max(maxW, maxH));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(maxW * scale);
    canvas.height = Math.round(maxH * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    const stream = canvas.captureStream(30);
    const chunks: BlobPart[] = [];
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 220; // low calm tone
    gain.gain.value = opts.includeCalmAudio ? 0.02 : 0; // very soft
    oscillator.connect(gain);
    const dest = audioCtx.createMediaStreamDestination();
    gain.connect(dest);
    oscillator.start();
    const combined = new MediaStream();
    stream.getVideoTracks().forEach(t => combined.addTrack(t));
    dest.stream.getAudioTracks().forEach(t => combined.addTrack(t));
    const recorder = new MediaRecorder(combined, { mimeType: 'video/webm;codecs=vp9,opus' });
    const done = new Promise<Blob>((resolve) =>
    {
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    });
    recorder.start();
    const fps = 30;
    const framesPerSlide = Math.max(1, Math.floor(secondsPerSlide * fps));
    const crossFadeFrames = Math.min(10, Math.floor(framesPerSlide / 5));
    for (let s = 0; s < imgs.length; s += 1) {
        const current = imgs[s];
        const next = imgs[(s + 1) % imgs.length];
        for (let f = 0; f < framesPerSlide; f += 1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const zoom = 1.05 + 0.1 * (f / framesPerSlide);
            const drawW = canvas.width * zoom;
            const drawH = canvas.height * zoom;
            const dx = (canvas.width - drawW) / 2;
            const dy = (canvas.height - drawH) / 2;
            ctx.globalAlpha = 1;
            ctx.drawImage(current, 0, 0, current.width, current.height, dx, dy, drawW, drawH);
            if (f >= framesPerSlide - crossFadeFrames) {
                const t = (f - (framesPerSlide - crossFadeFrames)) / Math.max(1, crossFadeFrames);
                ctx.globalAlpha = t;
                ctx.drawImage(next, 0, 0, next.width, next.height, dx, dy, drawW, drawH);
            }
            await new Promise(r => setTimeout(r, 1000 / fps));
        }
    }
    recorder.stop();
    oscillator.stop();
    const blob = await done;
    return URL.createObjectURL(blob);
}

function loadImage(src: string): Promise<HTMLImageElement>
{
    return new Promise((resolve, reject) =>
    {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = src;
    });
}


