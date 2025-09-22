import { Dictionary } from "../types";

export const en: Dictionary = {
  common: {
    language: "Language",
    english: "English",
    french: "French",
  },
  home: {
    subtitle: "Modern Real Estate Management Platform",
    heroDescription:
      "Streamline your real estate business with property management, visit scheduling, prospect tracking, and AI-powered image enhancement",
    cards: {
      propertiesTitle: "Property Management",
      propertiesDesc:
        "Add, edit, and manage properties with detailed information, high-quality photos, and comprehensive listing details",
      propertiesCta: "🏘️ Explore Properties",

      visitsTitle: "Visit Scheduling",
      visitsDesc:
        "Schedule and manage property visits with prospects using an intuitive calendar system",
      visitsCta: "📅 Schedule Visits",

      prospectsTitle: "Prospect Tracking",
      prospectsDesc:
        "Track leads, manage interactions, and nurture relationships with potential clients",
      prospectsCta: "👥 Manage Prospects",

      aiTitle: "AI Image Enhancement",
      aiDesc: "Enhance property photos with cutting-edge AI technology",
      aiCta: "✨ Enhance Images",

      contractsTitle: "Contract Generation",
      contractsDesc:
        "Generate professional rental and sales contracts in PDF format automatically",
      contractsCta: "📄 Create Contracts",

      analyticsTitle: "Analytics Dashboard",
      analyticsDesc:
        "Track performance with detailed analytics, reports, and business insights",
      analyticsCta: "📊 View Analytics",
    },
    getStartedTitle: "Get Started Today",
    getStartedSubtitle: "Choose your path to real estate success",
    agentsCard: {
      title: "For Real Estate Agents",
      badge: "🎯 RECOMMENDED",
      description:
        "Complete property management solution. Handle listings, schedule visits, track prospects, and close deals efficiently.",
      features: [
        "✅ Property Management",
        "✅ Visit Scheduling",
        "✅ Prospect Tracking",
        "✅ AI Image Enhancement",
      ],
      disabledCta: "Get Started",
      cta: "🚀 Start Managing Properties",
    },
    seekersCard: {
      title: "Property Seekers",
      badge: "🏠 BROWSE & FIND",
      description:
        "Discover your dream property from our curated selection of premium real estate listings.",
      features: [
        "🔍 Advanced Search",
        "📱 Mobile Friendly",
        "💡 Smart Filters",
        "⭐ Quality Listings",
      ],
      cta: "🏘️ Browse Properties",
    },
    scheduleCard: {
      title: "Schedule Visits",
      badge: "📅 BOOK TOUR",
      description:
        "Book property visits with professional agents and explore properties that match your needs.",
      features: [
        "🗓️ Flexible Scheduling",
        "👨‍💼 Professional Agents",
        "📞 Instant Confirmation",
        "🚗 Easy Access",
      ],
      cta: "📅 Schedule Visit",
    },
  },
  header: {
    properties: "Properties",
    visits: "Visits",
    prospects: "Prospects",
    dashboard: "Dashboard",
    roomRedesign: "Room Redesign",
    aiShort: "AI",
  },
  properties: {
    loading: "Loading properties...",
    premiumBadge: "Premium Properties",
    title: "Discover Your Dream Home",
    subtitle:
      "Browse our exclusive collection of premium properties for rent and sale",
    searchPlaceholder: "Search by location, title, or features...",
    allTypes: "All Types",
    forRent: "For Rent",
    forSale: "For Sale",
    moreFilters: "More Filters",
    rentBadge: "🏠 For Rent",
    saleBadge: "🏡 For Sale",
    available: "✨ Available",
    reserved: "⏰ Reserved",
    rooms: "rooms",
    perMonth: "per month",
    totalPrice: "total price",
    viewDetails: "View Details",
    bookVisit: "📅 Book Visit",
    emptyTitle: "No properties found",
    emptyDescFiltered:
      "Try adjusting your search criteria to find more properties.",
    emptyDescNoFilter: "We're adding new properties daily. Check back soon!",
    resetFilters: "🔄 Reset Filters",
  },
  visits: {
    title: "Visits",
    subtitle: "Manage your property visit schedule",
    scheduleVisit: "Schedule Visit",
    filters: {
      all: (count: number) => `All (${count})`,
      scheduled: (count: number) => `Scheduled (${count})`,
      completed: (count: number) => `Completed (${count})`,
      cancelled: (count: number) => `Cancelled (${count})`,
      noShow: (count: number) => `No Show (${count})`,
    },
    loading: "Loading visits...",
    statusLabel: "Scheduled:",
    noVisitsTitle: "No visits found",
    noVisitsDescAll: "You don't have any visits scheduled yet.",
    noVisitsDescStatus: (status: string) =>
      `No visits with status "${status}" found.`,
    viewProperty: "View Property",
    editVisit: "Edit Visit",
    markCompleted: "Mark Completed",
    cancelVisit: "Cancel Visit",
  },
  prospects: {
    loading: "Loading prospects...",
    title: "Prospects",
    subtitle: "Track and manage your potential clients",
    addProspect: "Add Prospect",
    searchPlaceholder: "Search prospects by name, email, or phone...",
    statusAll: "All Status",
    statusNew: "New",
    statusContacted: "Contacted",
    statusInterested: "Interested",
    statusClosed: "Closed",
    stats: {
      new: "New",
      contacted: "Contacted",
      interested: "Interested",
      closed: "Closed",
    },
    interestedProperties: "Interested Properties:",
    added: "Added",
    lastContact: "Last contact",
    edit: "Edit",
    contact: "Contact",
    emptyTitle: "No prospects found",
    emptyDescFiltered: "No prospects match your current filters.",
    emptyDescNoFilter: "You don't have any prospects yet.",
    emptyCta: "Add Your First Prospect",
  },
  schedule: {
    title: "Schedule a Visit",
    subtitle: "Fill the form to schedule a new property visit",
    propertyTitle: "Property Title",
    propertyAddress: "Property Address",
    prospectName: "Prospect Name",
    prospectEmail: "Prospect Email",
    prospectPhone: "Prospect Phone",
    date: "Date",
    time: "Time",
    notes: "Notes",
    submit: "Create Visit",
    success: "Visit scheduled successfully.",
    error: "Failed to schedule visit. Please try again.",
  },
};
