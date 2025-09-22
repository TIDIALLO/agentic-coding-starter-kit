"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BedDouble, Maximize, Euro, Filter, Search, Heart, Eye, Camera, Sparkles } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type Property = {
  id: string;
  title: string;
  description: string;
  price: string;
  address: string;
  type: "rent" | "sale";
  surfaceArea: number;
  rooms: number;
  status: "available" | "reserved" | "sold" | "rented";
  images?: { url: string; isPrimary: boolean }[];
};

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern Apartment in City Center",
    description: "Beautiful 2-bedroom apartment with modern amenities and great city views.",
    price: "850000",
    address: "123 Main Street, Downtown",
    type: "sale",
    surfaceArea: 85,
    rooms: 2,
    status: "available",
    images: [
      {
        url:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "2",
    title: "Cozy Family House",
    description: "Spacious family house with garden, perfect for families with children.",
    price: "1200",
    address: "456 Oak Avenue, Suburbs",
    type: "rent",
    surfaceArea: 120,
    rooms: 4,
    status: "available",
    images: [
      {
        url:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "3",
    title: "Luxury Penthouse",
    description: "Stunning penthouse with panoramic city views and premium finishes.",
    price: "2500000",
    address: "789 Sky Tower, Financial District",
    type: "sale",
    surfaceArea: 200,
    rooms: 3,
    status: "available",
    images: [
      {
        url:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  }
];

export default function PropertiesPage()
{
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "rent" | "sale">("all");

  useEffect(() =>
  {
    // Simulate API call
    setTimeout(() =>
    {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProperties = properties.filter((property) =>
  {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatPrice = (price: string, type: "rent" | "sale") =>
  {
    const numPrice = parseInt(price);
    if (type === "rent") {
      return `€${numPrice.toLocaleString()}/${t.properties.perMonth}`;
    }
    return `€${numPrice.toLocaleString()}`;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading properties...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 dark:border-blue-800/50">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.properties.premiumBadge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              {t.properties.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t.properties.subtitle}
            </p>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.properties.searchPlaceholder}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as "all" | "rent" | "sale")}
                  className="px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="all">{t.properties.allTypes}</option>
                  <option value="rent">{t.properties.forRent}</option>
                  <option value="sale">{t.properties.forSale}</option>
                </select>
                <Button variant="outline" size="lg" className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:border-blue-300 transition-all">
                  <Filter className="h-4 w-4 mr-2" />
                  {t.properties.moreFilters}
                </Button>
              </div>
            </div>
          </div>

          {/* Modern Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="group overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl">
                {/* Image Section with Overlay Effects */}
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
                  {property.images?.[0]?.url && (
                    <Image
                      src={property.images[0].url}
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="text-center space-y-2">
                      <Camera className="h-12 w-12 mx-auto text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">Premium Property</span>
                    </div>
                  </div>

                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 z-20">
                    <Badge
                      className={`${property.type === "rent"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                        } text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1 text-xs font-semibold`}
                    >
                      {property.type === "rent" ? "🏠 For Rent" : "🏡 For Sale"}
                    </Badge>
                  </div>

                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-slate-700 border-0 rounded-full w-9 h-9 p-0 shadow-lg">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-slate-700 border-0 rounded-full w-9 h-9 p-0 shadow-lg">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <Badge
                    variant="outline"
                    className={`absolute bottom-4 right-4 z-20 ${property.status === "available"
                      ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                      : "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                      } backdrop-blur-sm font-semibold`}
                  >
                    {property.status === "available" ? "✨ Available" : "⏰ Reserved"}
                  </Badge>
                </div>

                <CardHeader className="space-y-3 pb-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed">
                      {property.description}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium line-clamp-1">{property.address}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  {/* Property Features */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                      <BedDouble className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{property.rooms} {t.properties.rooms}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                      <Maximize className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{property.surfaceArea}m²</span>
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                      <Euro className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {formatPrice(property.price, property.type)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {property.type === "rent" ? t.properties.perMonth : t.properties.totalPrice}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="gap-3 pt-0">
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-11 font-semibold"
                  >
                    <Link href={`/properties/${property.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t.properties.viewDetails}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 rounded-xl h-11 font-semibold transition-all duration-300"
                  >
                    <Link href={`/visits/new?propertyId=${property.id}`}>
                      {t.properties.bookVisit}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl flex items-center justify-center">
                  <Search className="h-12 w-12 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.properties.emptyTitle}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {searchTerm || typeFilter !== "all"
                      ? t.properties.emptyDescFiltered
                      : t.properties.emptyDescNoFilter}
                  </p>
                </div>
                <Button
                  onClick={() =>
                  {
                    setSearchTerm("");
                    setTypeFilter("all");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg rounded-xl px-8"
                >
                  {t.properties.resetFilters}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}