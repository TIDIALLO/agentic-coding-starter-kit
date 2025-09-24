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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">{t.payments.title}</h1>
            <p className="text-slate-500 mb-6">{t.payments.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {PACKS.map((p) => (
                    <div key={p.label} className="rounded-xl border p-4">
                        <div className="text-lg font-medium mb-1">
                            {p.label === "small" && t.payments.packSmall}
                            {p.label === "medium" && t.payments.packMedium}
                            {p.label === "large" && t.payments.packLarge}
                        </div>
                        <div className="text-3xl font-semibold mb-2">{p.amount} XOF</div>
                        <div className="text-sm text-slate-500 mb-4">{p.credits} crédits</div>
                        <Button className="w-full rounded-xl" disabled={loading === p.label} onClick={() => createCharge(p)}>
                            {loading === p.label ? "..." : t.payments.buyCredits}
                        </Button>
                    </div>
                ))}
            </div>
            {pubKey ? (
                <p className="text-xs text-slate-500 mt-4">Clé publique chargée</p>
            ) : (
                <p className="text-xs text-amber-600 mt-4">Attention: clé publique Bictorys manquante</p>
            )}
        </div>
    );
}


