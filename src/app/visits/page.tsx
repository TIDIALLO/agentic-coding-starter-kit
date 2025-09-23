"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, User, Phone, Mail, Plus } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type Visit = {
  id: string;
  propertyTitle: string;
  propertyAddress: string;
  prospectName: string;
  prospectEmail: string;
  prospectPhone: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
};

const mockVisits: Visit[] = [];

export default function VisitsPage()
{
  const { t } = useI18n();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "scheduled" | "completed" | "cancelled" | "no_show">("all");

  useEffect(() =>
  {
    const load = () =>
    {
      try {
        const raw = typeof window !== 'undefined' ? window.localStorage.getItem('scheduled_visits') : null;
        const list: Visit[] = raw ? JSON.parse(raw) : [];
        setVisits(Array.isArray(list) ? list : []);
      } catch {
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    const onStorage = (e: StorageEvent) =>
    {
      if (e.key === 'scheduled_visits') load();
    };
    if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage); };
  }, []);

  const filteredVisits = visits.filter((visit) =>
  {
    return statusFilter === "all" || visit.status === statusFilter;
  });

  const getStatusVariant = (status: Visit["status"]) =>
  {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "no_show":
        return "outline";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) =>
  {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const setAndPersist = (next: Visit[]) =>
  {
    setVisits(next);
    try { if (typeof window !== 'undefined') window.localStorage.setItem('scheduled_visits', JSON.stringify(next)); } catch { }
  };

  const updateStatus = (id: string, status: Visit["status"]) =>
  {
    const next = visits.map(v => v.id === id ? { ...v, status } : v);
    setAndPersist(next);
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t.visits.loading}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t.visits.title}</h1>
            <p className="text-muted-foreground">{t.visits.subtitle}</p>
          </div>
          <Button asChild>
            <Link href="/visits/new">
              <Plus className="h-4 w-4 mr-2" />
              {t.visits.scheduleVisit}
            </Link>
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            {t.visits.filters.all(visits.length)}
          </Button>
          <Button
            variant={statusFilter === "scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("scheduled")}
          >
            {t.visits.filters.scheduled(visits.filter(v => v.status === "scheduled").length)}
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
          >
            {t.visits.filters.completed(visits.filter(v => v.status === "completed").length)}
          </Button>
          <Button
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("cancelled")}
          >
            {t.visits.filters.cancelled(visits.filter(v => v.status === "cancelled").length)}
          </Button>
          <Button
            variant={statusFilter === "no_show" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("no_show")}
          >
            {t.visits.filters.noShow(visits.filter(v => v.status === "no_show").length)}
          </Button>
        </div>

        {/* Visits List */}
        <div className="space-y-4">
          {filteredVisits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{visit.propertyTitle}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {visit.propertyAddress}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(visit.status)}>
                    {visit.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{t.visits.statusLabel}</span>
                  <span>{formatDate(visit.scheduledDate)}</span>
                </div>

                {/* Prospect Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{visit.prospectName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{visit.prospectEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{visit.prospectPhone}</span>
                  </div>
                </div>

                {/* Notes */}
                {visit.notes && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-200 rounded-r-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm">
                      <span className="font-medium">Notes: </span>
                      {visit.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    {t.visits.editVisit}
                  </Button>
                  {visit.status === "scheduled" && (
                    <>
                      <Button variant="outline" size="sm">
                        {t.visits.markCompleted}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t.visits.cancelVisit}
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/properties/${visit.id}`}>
                      {t.visits.viewProperty}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVisits.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">{t.visits.noVisitsTitle}</h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? t.visits.noVisitsDescAll
                : t.visits.noVisitsDescStatus(statusFilter)}
            </p>
            <Button asChild>
              <Link href="/visits/new">
                <Plus className="h-4 w-4 mr-2" />
                {t.visits.scheduleVisit}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}