export type SupportedLocale = "en" | "fr";

export type Dictionary = {
  common: {
    language: string;
    english: string;
    french: string;
  };
  home: {
    subtitle: string;
    heroDescription: string;
    cards: {
      propertiesTitle: string;
      propertiesDesc: string;
      propertiesCta: string;

      visitsTitle: string;
      visitsDesc: string;
      visitsCta: string;

      prospectsTitle: string;
      prospectsDesc: string;
      prospectsCta: string;

      aiTitle: string;
      aiDesc: string;
      aiCta: string;

      contractsTitle: string;
      contractsDesc: string;
      contractsCta: string;

      analyticsTitle: string;
      analyticsDesc: string;
      analyticsCta: string;
    };
    getStartedTitle: string;
    getStartedSubtitle: string;
    agentsCard: {
      title: string;
      badge: string;
      description: string;
      features: string[];
      disabledCta: string;
      cta: string;
    };
    seekersCard: {
      title: string;
      badge: string;
      description: string;
      features: string[];
      cta: string;
    };
    scheduleCard: {
      title: string;
      badge: string;
      description: string;
      features: string[];
      cta: string;
    };
  };
  header: {
    properties: string;
    visits: string;
    prospects: string;
    dashboard: string;
    roomRedesign: string;
    aiShort: string;
  };
  properties: {
    loading: string;
    premiumBadge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allTypes: string;
    forRent: string;
    forSale: string;
    moreFilters: string;
    rentBadge: string;
    saleBadge: string;
    available: string;
    reserved: string;
    rooms: string;
    perMonth: string;
    totalPrice: string;
    viewDetails: string;
    bookVisit: string;
    emptyTitle: string;
    emptyDescFiltered: string;
    emptyDescNoFilter: string;
    resetFilters: string;
  };
  visits: {
    title: string;
    subtitle: string;
    scheduleVisit: string;
    filters: {
      all: (count: number) => string;
      scheduled: (count: number) => string;
      completed: (count: number) => string;
      cancelled: (count: number) => string;
      noShow: (count: number) => string;
    };
    loading: string;
    statusLabel: string;
    noVisitsTitle: string;
    noVisitsDescAll: string;
    noVisitsDescStatus: (status: string) => string;
    viewProperty: string;
    editVisit: string;
    markCompleted: string;
    cancelVisit: string;
  };
  prospects: {
    loading: string;
    title: string;
    subtitle: string;
    addProspect: string;
    searchPlaceholder: string;
    statusAll: string;
    statusNew: string;
    statusContacted: string;
    statusInterested: string;
    statusClosed: string;
    stats: {
      new: string;
      contacted: string;
      interested: string;
      closed: string;
    };
    interestedProperties: string;
    added: string;
    lastContact: string;
    edit: string;
    contact: string;
    emptyTitle: string;
    emptyDescFiltered: string;
    emptyDescNoFilter: string;
    emptyCta: string;
  };
  schedule: {
    title: string;
    subtitle: string;
    propertyTitle: string;
    propertyAddress: string;
    prospectName: string;
    prospectEmail: string;
    prospectPhone: string;
    date: string;
    time: string;
    notes: string;
    submit: string;
    success: string;
    error: string;
  };
};
