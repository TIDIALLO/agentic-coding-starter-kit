"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

export default function NewVisitPage()
{
    const { t } = useI18n();
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function onSubmit(formData: FormData)
    {
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await fetch("/api/visits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyTitle: formData.get("propertyTitle"),
                    propertyAddress: formData.get("propertyAddress"),
                    prospectName: formData.get("prospectName"),
                    prospectEmail: formData.get("prospectEmail"),
                    prospectPhone: formData.get("prospectPhone"),
                    date: formData.get("date"),
                    time: formData.get("time"),
                    notes: formData.get("notes"),
                }),
            });
            if (!res.ok) throw new Error("Request failed");
            setMessage(t.schedule.success);
        } catch (e) {
            setMessage(t.schedule.error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t.schedule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        action={async (fd) =>
                        {
                            await onSubmit(fd);
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.schedule.propertyTitle}</label>
                            <Input name="propertyTitle" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.schedule.propertyAddress}</label>
                            <Input name="propertyAddress" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.schedule.prospectName}</label>
                                <Input name="prospectName" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.schedule.prospectEmail}</label>
                                <Input name="prospectEmail" type="email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.schedule.prospectPhone}</label>
                                <Input name="prospectPhone" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.schedule.date}</label>
                                <Input name="date" type="date" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">{t.schedule.time}</label>
                                <Input name="time" type="time" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">{t.schedule.notes}</label>
                            <Textarea name="notes" rows={4} />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={submitting}>{t.schedule.submit}</Button>
                            {message && <span className="text-sm">{message}</span>}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}


