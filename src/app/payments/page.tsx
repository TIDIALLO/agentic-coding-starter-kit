"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

type Pack = {
    label: string;
    amount: number; // smallest unit e.g., XOF
    credits: number;
};

const PACKS: Pack[] = [
    { label: "small", amount: 2000, credits: 20 },
    { label: "medium", amount: 5000, credits: 60 },
    { label: "large", amount: 10000, credits: 140 },
];

export default function PaymentsPage()
{
    const { t } = useI18n();
    const { data: session } = useSession();
    const [loading, setLoading] = useState<string | null>(null);
    const pubKey = process.env.NEXT_PUBLIC_BICTORYS_PUBLIC_KEY;

    const createCharge = async (pack: Pack) =>
    {
        try {
            setLoading(pack.label);
            const res = await fetch("/api/payments/charge", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ amount: pack.amount, currency: "XOF", creditsToGrant: pack.credits, description: `Pack ${pack.label}` }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Payment failed");

            // Depending on provider response, redirect if a payment URL is provided
            const redirectUrl = json?.provider?.data?.authorization_url || json?.provider?.authorization_url || json?.provider?.checkout_url;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                alert("Paiement initié. Suivez les instructions envoyées par le fournisseur.");
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Erreur de paiement";
            alert(msg);
        } finally {
            setLoading(null);
        }
    };

    if (!session?.user) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-2">{t.payments.title}</h1>
                <p className="text-slate-500 mb-6">{t.payments.subtitle}</p>
                <p className="text-sm">Veuillez vous connecter pour acheter des crédits.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Hero */}
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                    {t.payments.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-3">
                    {t.payments.subtitle}
                </p>
            </div>

            {/* Pricing grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PACKS.map((p, idx) => (
                    <div
                        key={p.label}
                        className={`rounded-3xl overflow-hidden border shadow-lg backdrop-blur bg-white/70 dark:bg-slate-900/70 ${idx === 2 ? "ring-2 ring-fuchsia-500" : ""
                            }`}
                    >
                        <div className="px-6 pt-5">
                            <div className="inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/60 border">
                                {p.label === "small" && t.payments.packSmall}
                                {p.label === "medium" && t.payments.packMedium}
                                {p.label === "large" && t.payments.packLarge}
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <div className="text-4xl font-extrabold">{p.amount.toLocaleString()} XOF</div>
                                <div className="text-sm text-slate-500">/ {p.credits} crédits</div>
                            </div>
                        </div>
                        <div className="px-6 mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                            <div>• Amélioration d&apos;images IA</div>
                            <div>• Mini‑vidéos prêtes pour réseaux</div>
                            <div>• Publication multi‑plateformes</div>
                        </div>
                        <div className="p-6 mt-2">
                            <Button
                                className="w-full h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700"
                                disabled={loading === p.label}
                                onClick={() => createCharge(p)}
                            >
                                {loading === p.label ? "…" : t.payments.buyCredits}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                {pubKey ? "Paiement sécurisé activé" : "Attention: clé publique Bictorys manquante"}
            </div>
        </div>
    );
}


