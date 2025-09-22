import { Dictionary } from "../types";

export const fr: Dictionary = {
  common: {
    language: "Langue",
    english: "Anglais",
    french: "Français",
  },
  home: {
    subtitle: "Plateforme moderne de gestion immobilière",
    heroDescription:
      "Optimisez votre activité avec la gestion des biens, la planification des visites, le suivi des prospects et l'amélioration d'images par IA",
    cards: {
      propertiesTitle: "Gestion des biens",
      propertiesDesc:
        "Ajoutez, modifiez et gérez des biens avec des informations détaillées, des photos de qualité et des annonces complètes",
      propertiesCta: "🏘️ Voir les biens",

      visitsTitle: "Planification des visites",
      visitsDesc: "Planifiez et gérez les visites avec un calendrier intuitif",
      visitsCta: "📅 Planifier des visites",

      prospectsTitle: "Suivi des prospects",
      prospectsDesc:
        "Suivez les prospects, gérez les interactions et entretenez la relation",
      prospectsCta: "👥 Gérer les prospects",

      aiTitle: "Amélioration d'images par IA",
      aiDesc: "Améliorez les photos de vos biens grâce à l'IA",
      aiCta: "✨ Améliorer les images",

      contractsTitle: "Génération de contrats",
      contractsDesc:
        "Créez automatiquement des contrats de location et de vente en PDF",
      contractsCta: "📄 Créer des contrats",

      analyticsTitle: "Tableau de bord analytique",
      analyticsDesc:
        "Suivez vos performances avec des analyses et rapports détaillés",
      analyticsCta: "📊 Voir les analyses",
    },
    getStartedTitle: "Commencez dès aujourd'hui",
    getStartedSubtitle: "Choisissez votre chemin vers la réussite immobilière",
    agentsCard: {
      title: "Pour les agents immobiliers",
      badge: "🎯 RECOMMANDÉ",
      description:
        "Solution complète de gestion. Gérez vos annonces, planifiez des visites, suivez vos prospects et concluez efficacement.",
      features: [
        "✅ Gestion des biens",
        "✅ Planification des visites",
        "✅ Suivi des prospects",
        "✅ Amélioration d'images IA",
      ],
      disabledCta: "Commencer",
      cta: "🚀 Commencer à gérer",
    },
    seekersCard: {
      title: "Pour les chercheurs de biens",
      badge: "🏠 PARCOURIR & TROUVER",
      description:
        "Trouvez votre bien idéal parmi notre sélection de propriétés de qualité.",
      features: [
        "🔍 Recherche avancée",
        "📱 Mobile",
        "💡 Filtres intelligents",
        "⭐ Annonces de qualité",
      ],
      cta: "🏘️ Parcourir les biens",
    },
    scheduleCard: {
      title: "Planifier des visites",
      badge: "📅 RÉSERVER",
      description:
        "Réservez des visites avec des agents professionnels et explorez des biens adaptés à vos besoins.",
      features: [
        "🗓️ Planification flexible",
        "👨‍💼 Agents professionnels",
        "📞 Confirmation instantanée",
        "🚗 Accès facile",
      ],
      cta: "📅 Planifier une visite",
    },
  },
  header: {
    properties: "Biens",
    visits: "Visites",
    prospects: "Prospects",
    dashboard: "Tableau de bord",
    roomRedesign: "Re-design de pièce",
    aiShort: "IA",
  },
  properties: {
    loading: "Chargement des biens...",
    premiumBadge: "Biens premium",
    title: "Trouvez la maison de vos rêves",
    subtitle:
      "Parcourez notre sélection exclusive de biens à louer et à vendre",
    searchPlaceholder: "Rechercher par lieu, titre ou caractéristiques...",
    allTypes: "Tous les types",
    forRent: "À louer",
    forSale: "À vendre",
    moreFilters: "Plus de filtres",
    rentBadge: "🏠 À louer",
    saleBadge: "🏡 À vendre",
    available: "✨ Disponible",
    reserved: "⏰ Réservé",
    rooms: "pièces",
    perMonth: "par mois",
    totalPrice: "prix total",
    viewDetails: "Voir le détail",
    bookVisit: "📅 Réserver une visite",
    emptyTitle: "Aucun bien trouvé",
    emptyDescFiltered: "Ajustez vos critères pour trouver plus de biens.",
    emptyDescNoFilter:
      "De nouveaux biens sont ajoutés chaque jour. Revenez bientôt !",
    resetFilters: "🔄 Réinitialiser",
  },
  visits: {
    title: "Visites",
    subtitle: "Gérez le planning de vos visites de biens",
    scheduleVisit: "Planifier une visite",
    filters: {
      all: (count: number) => `Toutes (${count})`,
      scheduled: (count: number) => `Planifiées (${count})`,
      completed: (count: number) => `Terminées (${count})`,
      cancelled: (count: number) => `Annulées (${count})`,
      noShow: (count: number) => `Absents (${count})`,
    },
    loading: "Chargement des visites...",
    statusLabel: "Planifiée :",
    noVisitsTitle: "Aucune visite",
    noVisitsDescAll: "Vous n'avez pas encore de visite planifiée.",
    noVisitsDescStatus: (status: string) =>
      `Aucune visite avec le statut "${status}".`,
    viewProperty: "Voir le bien",
    editVisit: "Modifier la visite",
    markCompleted: "Marquer comme terminée",
    cancelVisit: "Annuler la visite",
  },
  prospects: {
    loading: "Chargement des prospects...",
    title: "Prospects",
    subtitle: "Suivez et gérez vos clients potentiels",
    addProspect: "Ajouter un prospect",
    searchPlaceholder: "Rechercher par nom, email ou téléphone...",
    statusAll: "Tous les statuts",
    statusNew: "Nouveau",
    statusContacted: "Contacté",
    statusInterested: "Intéressé",
    statusClosed: "Clôturé",
    stats: {
      new: "Nouveaux",
      contacted: "Contactés",
      interested: "Intéressés",
      closed: "Clôturés",
    },
    interestedProperties: "Biens intéressants :",
    added: "Ajouté",
    lastContact: "Dernier contact",
    edit: "Modifier",
    contact: "Contacter",
    emptyTitle: "Aucun prospect",
    emptyDescFiltered: "Aucun prospect ne correspond à vos filtres.",
    emptyDescNoFilter: "Vous n'avez pas encore de prospects.",
    emptyCta: "Ajouter votre premier prospect",
  },
  schedule: {
    title: "Planifier une visite",
    subtitle: "Remplissez le formulaire pour créer une nouvelle visite",
    propertyTitle: "Titre du bien",
    propertyAddress: "Adresse du bien",
    prospectName: "Nom du prospect",
    prospectEmail: "Email du prospect",
    prospectPhone: "Téléphone du prospect",
    date: "Date",
    time: "Heure",
    notes: "Notes",
    submit: "Créer la visite",
    success: "Visite planifiée avec succès.",
    error: "Échec de la création de la visite. Veuillez réessayer.",
  },
};
