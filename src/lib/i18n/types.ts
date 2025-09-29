export type SupportedLocale = "en" | "fr";

export type Dictionary = {
  common: {
    language: string;
    english: string;
    french: string;
  };
  imageEnhancement: {
    headerBadge: string;
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadDesc: string;
    dropIdle: string;
    dropActive: string;
    supports: string;
    imageProps: string;
    metaName: string;
    metaSize: string;
    metaDimensions: string;
    metaFormat: string;
    selectRoomType: string;
    roomLabels: Record<string, string>;
    selectDesignTheme: string;
    themeLabels: Record<string, string>;
    controls: {
      newDesign: string;
      changeImage: string;
      intensitySubtle: string;
      intensityBalanced: string;
      intensityBold: string;
      speedFast: string;
      speedBalanced: string;
      speedHQ: string;
      speedUltra: string;
    };
    enhancementTypeTitle: string;
    options: {
      professionalName: string;
      professionalDesc: string;
      brightnessName: string;
      brightnessDesc: string;
      contrastName: string;
      contrastDesc: string;
      colorName: string;
      colorDesc: string;
    };
    enhanceButton: string;
    compareTitle: string;
    compareSubtitle: string;
    processing: string;
    statuses: { original: string; enhanced: string; waiting: string };
    messages: { uploadPrompt: string; waitEnhancedHere: string };
    modal: { preview: string; downloadVideo: string; downloadImage: string };
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
    socialShare: string;
    pricing: string;
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
  social: {
    title: string;
    textLabel: string;
    mediaUrlLabel: string;
    platformsLabel: string;
    scheduleAtLabel: string;
    scheduleCta: string;
    publishNowCta: string;
    cancelCta: string;
    success: string;
    failure: string;
    signInRequired: string;
    connectAccountsHint: string;
    imagesLabel: string;
    addImagesCta: string;
    createVideoCta: string;
    videoPreview: string;
    generateCaptionCta: string;
  };
  roomRedesign: {
    share: string;
    publishDialogTitle: string;
    selectPlatforms: string;
    description: string;
    publishNow: string;
    publishing: string;
    fullscreen: string;
    preview: string;
  };
  payments: {
    title: string;
    subtitle: string;
    packSmall: string;
    packMedium: string;
    packLarge: string;
    buyCredits: string;
  };
  dashboard: {
    badge: string;
    welcome: (name: string) => string;
    subtitle: string;
    actions: {
      addProperty: string;
      enhanceImages: string;
      viewAllProperties: string;
      viewAllVisits: string;
      scheduleVisit: string;
      addProspect: string;
      generateContract: string;
      enhanceImagesAction: string;
      analyticsCta: string;
    };
    stats: {
      totalProperties: string;
      scheduledVisits: string;
      activeProspects: string;
      contractsSigned: string;
    };
    recentProperties: {
      title: string;
      subtitle: string;
      edit: string;
      delete: string;
      saleSample: string;
      rentSample: string;
    };
    upcomingVisits: {
      title: string;
      subtitle: string;
      manage: string;
      visitOne: string;
      visitTwo: string;
    };
    performance: {
      title: string;
      subtitle: string;
      propertiesListed: string;
      visitsCompleted: string;
      contractsSigned: string;
      revenue: string;
    };
  };
};
