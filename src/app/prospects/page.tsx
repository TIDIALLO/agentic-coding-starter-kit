"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MessageSquare, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type Prospect = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "contacted" | "interested" | "closed";
  notes: string;
  createdAt: string;
  lastContact?: string;
  interestedProperties?: string[];
};

const mockProspects: Prospect[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    status: "interested",
    notes: "Looking for a 2-3 bedroom apartment in downtown area. Budget around €800,000. Wants modern amenities and parking.",
    createdAt: "2024-01-20T10:00:00Z",
    lastContact: "2024-01-23T14:30:00Z",
    interestedProperties: ["Modern Apartment in City Center", "Downtown Loft"],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1234567891",
    status: "contacted",
    notes: "Family looking for rental house with garden. 2 children, needs to be near schools. Budget €1,200-1,500/month.",
    createdAt: "2024-01-18T09:15:00Z",
    lastContact: "2024-01-19T11:00:00Z",
    interestedProperties: ["Cozy Family House"],
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1234567892",
    status: "new",
    notes: "Interested in luxury properties for investment. High budget, looking for premium locations.",
    createdAt: "2024-01-24T16:45:00Z",
    interestedProperties: ["Luxury Penthouse"],
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+1234567893",
    status: "closed",
    notes: "Successfully closed deal for downtown apartment. Very satisfied with the service.",
    createdAt: "2024-01-10T12:30:00Z",
    lastContact: "2024-01-22T09:00:00Z",
  },
];

export default function ProspectsPage()
{
  const { t } = useI18n();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "interested" | "closed">("all");

  useEffect(() =>
  {
    // Simulate API call
    setTimeout(() =>
    {
      setProspects(mockProspects);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProspects = prospects.filter((prospect) =>
  {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || prospect.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  const getStatusColor = (status: Prospect["status"]) =>
  {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "interested":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) =>
  {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t.prospects.loading}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t.prospects.title}</h1>
            <p className="text-muted-foreground">{t.prospects.subtitle}</p>
          </div>
          <Button asChild>
            <Link href="/prospects/new">
              <Plus className="h-4 w-4 mr-2" />
              {t.prospects.addProspect}
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t.prospects.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "new" | "contacted" | "interested" | "closed")}
            className="px-3 py-2 border border-input rounded-md bg-background text-sm"
          >
            <option value="all">{t.prospects.statusAll}</option>
            <option value="new">{t.prospects.statusNew}</option>
            <option value="contacted">{t.prospects.statusContacted}</option>
            <option value="interested">{t.prospects.statusInterested}</option>
            <option value="closed">{t.prospects.statusClosed}</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{prospects.filter(p => p.status === "new").length}</div>
            <div className="text-sm text-muted-foreground">{t.prospects.stats.new}</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{prospects.filter(p => p.status === "contacted").length}</div>
            <div className="text-sm text-muted-foreground">{t.prospects.stats.contacted}</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{prospects.filter(p => p.status === "interested").length}</div>
            <div className="text-sm text-muted-foreground">{t.prospects.stats.interested}</div>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{prospects.filter(p => p.status === "closed").length}</div>
            <div className="text-sm text-muted-foreground">{t.prospects.stats.closed}</div>
          </div>
        </div>

        {/* Prospects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProspects.map((prospect) => (
            <Card key={prospect.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {prospect.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prospect.status)}`}>
                        {prospect.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{prospect.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{prospect.phone}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm line-clamp-3">{prospect.notes}</p>
                  </div>
                </div>

                {/* Interested Properties */}
                {prospect.interestedProperties && prospect.interestedProperties.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t.prospects.interestedProperties}</p>
                    <div className="flex flex-wrap gap-1">
                      {prospect.interestedProperties.map((property, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>{t.prospects.added}: {formatDate(prospect.createdAt)}</div>
                  {prospect.lastContact && (
                    <div>{t.prospects.lastContact}: {formatDate(prospect.lastContact)}</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t.prospects.edit}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {t.prospects.contact}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProspects.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">{t.prospects.emptyTitle}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? t.prospects.emptyDescFiltered
                : t.prospects.emptyDescNoFilter}
            </p>
            <Button asChild>
              <Link href="/prospects/new">
                <Plus className="h-4 w-4 mr-2" />
                {t.prospects.emptyCta}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}