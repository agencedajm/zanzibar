// Données du voyage — Zanzibar 2026 (couple, 15 jours)
// Toutes les dates sont au format ISO (YYYY-MM-DD)

const TRIP_INFO = {
  destination: "Zanzibar, Tanzanie",
  origin: "Paris 12e",
  startDate: "2026-09-12",
  endDate: "2026-09-26",
  days: 15,
  nights: 14,
  nightsNote: "13 nuits en hébergement + 1 nuit passée dans l'avion du retour (vol de nuit le J14)",
  travelers: 2,
  budgetPerPerson: 3500,
  budgetCouple: 7000,
  stages: [
    { name: "Stone Town", nights: 3, dates: "12 → 15 sept." },
    { name: "Nungwi / Kendwa", nights: 5, dates: "15 → 20 sept." },
    { name: "Matemwe / Pwani Mchangani", nights: 5, dates: "20 → 25 sept." }
  ],
  whySeptember: "Septembre est le mois le plus sec de l'année à Zanzibar (~24mm de pluie), mer calme, eau claire idéale pour le snorkeling (Mnemba, Safari Blue), 27-30°C, mer à 26-27°C. Moins d'affluence qu'en juillet-août ou décembre, et prix vols/hôtels plus doux qu'en haute saison.",
  flightSearchUrl: "https://www.google.com/travel/flights?q=vols%20Paris%20Zanzibar",
  flightSearchUrlAlt: "https://www.skyscanner.fr/transport/vols/pari/znz/"
};

// Le parcours du voyage, découpé en 5 grandes phases pour la navigation
// (utilisé par le "stepper" en haut de l'onglet Itinéraire)
const JOURNEY = [
  { key: "vol-aller", label: "Vol aller", icon: "plane", days: [1] },
  { key: "stone-town", label: "Stone Town", icon: "building", days: [2, 3], stage: "Stone Town" },
  { key: "nungwi-kendwa", label: "Nungwi & Kendwa", icon: "sun", days: [4, 5, 6, 7, 8], stage: "Nungwi / Kendwa" },
  { key: "matemwe", label: "Matemwe", icon: "wave", days: [9, 10, 11, 12, 13], stage: "Matemwe / Pwani Mchangani" },
  { key: "vol-retour", label: "Vol retour", icon: "plane", days: [14, 15] }
];

const FLIGHTS = [
  {
    airline: "Ethiopian Airlines",
    airport: "CDG",
    stopover: "Addis-Abeba (ADD)",
    duration: "13h30 – 16h",
    price: "550 – 750 €",
    recommended: true,
    pick: "Le choix rapport qualité/prix"
  },
  {
    airline: "Kenya Airways",
    airport: "CDG",
    stopover: "Nairobi (NBO)",
    duration: "14h – 17h",
    price: "600 – 850 €",
    recommended: true,
    pick: "Le choix confort (escale courte)"
  },
  {
    airline: "Turkish Airlines",
    airport: "CDG",
    stopover: "Istanbul (IST)",
    duration: "14h – 17h",
    price: "600 – 800 €",
    recommended: false,
    pick: "Alternative fiable"
  },
  {
    airline: "Qatar Airways",
    airport: "CDG",
    stopover: "Doha (DOH)",
    duration: "15h – 18h",
    price: "650 – 950 €",
    recommended: false,
    pick: "Le choix compagnie 5★"
  }
];

// 3 profils de choix par étape (façon guide de voyage) : Lonely Planet
// (valeur sûre du guide), Local (adresse plus authentique/abordable),
// Aventure (option plus active/nature). Chaque option a un lien de
// recherche vers un site de réservation.
const ACCOMMODATIONS = [
  {
    stage: "Stone Town",
    nights: 3,
    coords: [-6.1659, 39.1917],
    priceRange: "70 – 100 €/nuit (2 pers., petit-déj inclus)",
    options: [
      {
        profile: "Lonely Planet",
        name: "Zanzibar Palace Hotel",
        description: "Boutique guesthouse historique, décor swahili, très bien noté par les guides",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Zanzibar+Palace+Hotel+Stone+Town"
      },
      {
        profile: "Adresse locale",
        name: "Kholle House",
        description: "Petite maison d'hôtes tenue par une famille locale, ambiance intimiste, prix plus doux",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Kholle+House+Zanzibar"
      },
      {
        profile: "Aventure",
        name: "Beyt al Salaam",
        description: "Vue sur l'océan, toit-terrasse, bon point de départ pour explorer les ruelles à pied",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Beyt+al+Salaam+Zanzibar"
      }
    ]
  },
  {
    stage: "Nungwi / Kendwa",
    nights: 5,
    coords: [-5.7273, 39.2952],
    priceRange: "90 – 130 €/nuit (2 pers., demi-pension)",
    options: [
      {
        profile: "Lonely Planet",
        name: "Nungwi Beach Resort by Turaco",
        description: "Grand classique des guides, plage privée, piscine, bar de plage animé",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Nungwi+Beach+Resort+by+Turaco"
      },
      {
        profile: "Adresse locale",
        name: "Sunrise Kendwa",
        description: "Petit hôtel familial à Kendwa, plus calme que Nungwi, très bon rapport qualité/prix",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Sunrise+Kendwa+Zanzibar"
      },
      {
        profile: "Aventure",
        name: "Canary Kendwa Beach Resort",
        description: "Proche des spots de snorkeling et des sorties bateau, ambiance jeune et active",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Canary+Kendwa+Beach+Resort"
      }
    ]
  },
  {
    stage: "Matemwe / Pwani Mchangani",
    nights: 5,
    coords: [-5.8404, 39.3697],
    priceRange: "100 – 140 €/nuit (2 pers., demi-pension)",
    options: [
      {
        profile: "Lonely Planet",
        name: "Zanzibar White Sand Luxury Villas & Spa",
        description: "Le plus qualitatif des trois, spa, piscine à débordement, très bien noté",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Zanzibar+White+Sand+Luxury+Villas+%26+Spa"
      },
      {
        profile: "Adresse locale",
        name: "Matemwe Beach Village",
        description: "Lodge simple et convivial tenu par des locaux, accès direct à la plage de Matemwe",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Matemwe+Beach+Village"
      },
      {
        profile: "Aventure",
        name: "Options proches de Mnemba",
        description: "Plusieurs lodges bord de plage juste en face de l'atoll de Mnemba, idéal snorkeling au réveil",
        bookingUrl: "https://www.booking.com/searchresults.html?ss=Matemwe+beach+lodge+Mnemba"
      }
    ]
  }
];

// Budget prévisionnel par personne (éditable : "dépensé réel" saisi par l'utilisateur, stocké en local)
const BUDGET_CATEGORIES = [
  { key: "vol", label: "Vol A/R Paris–Zanzibar", planned: 650, detail: "Ethiopian ou Kenya Airways, réservé 4-6 mois à l'avance" },
  { key: "hebergement", label: "Hébergement (13 nuits)", planned: 825, detail: "Moyenne pondérée des 3 étapes, part par personne" },
  { key: "nourriture", label: "Nourriture & boissons", planned: 440, detail: "~28-32€/jour, mix street-food / restos / 2-3 dîners chics" },
  { key: "excursions", label: "Excursions & activités", planned: 225, detail: "Spice tour, Prison Island, Safari Blue, Mnemba, Jozani, pourboires" },
  { key: "transport", label: "Transport local", planned: 110, detail: "Transferts aéroport + inter-zones, taxis, dala-dala" },
  { key: "assurance", label: "Assurance obligatoire Zanzibar", planned: 41, detail: "44$ / adulte, valable 3 mois" },
  { key: "visa", label: "e-Visa Tanzanie", planned: 46, detail: "50$ / pers., à faire 2-3 semaines avant" },
  { key: "divers", label: "Divers / imprévus", planned: 160, detail: "Marge de sécurité ~5% (pharmacie, shopping, pourboires)" }
];
// Total prévisionnel ≈ 2497€/pers — marge de ~1000€ sous le plafond de 3500€/pers
// Le vol A/R (~650€) est déjà compté ici : le "budget/jour" de l'itinéraire ci-dessous
// ne représente QUE les frais sur place (hébergement + repas + activités du jour).

const ITINERARY = [
  {
    day: 1, date: "2026-09-12", location: "Paris → Zanzibar", stage: "Stone Town", phase: "vol-aller",
    morning: "Vol CDG → escale",
    afternoon: "Vol escale → ZNZ, arrivée en soirée",
    evening: "Transfert privé vers Stone Town (~15 min, 12$), installation, dîner léger à l'hôtel",
    meal: "Dîner terrasse rooftop Stone Town (poisson grillé)",
    mealAlt: "Alternative viande : brochettes de poulet grillé (chicken skewers), présentes sur presque toutes les cartes",
    budget: 35,
    budgetNote: "Transferts + dîner uniquement — le vol A/R est compté séparément dans l'onglet Budget (~650€/pers)"
  },
  {
    day: 2, date: "2026-09-13", location: "Stone Town", stage: "Stone Town", phase: "stone-town",
    morning: "Visite guidée à pied du vieux Stone Town (maisons swahilies, portes sculptées, ancien marché aux esclaves)",
    afternoon: "Marché de Darajani, balade au front de mer, Forodhani Gardens",
    evening: "Dîner street-food à Forodhani Gardens",
    meal: "Street food Forodhani (brochettes, Zanzibar pizza, jus de canne à sucre)",
    mealAlt: "Les brochettes de bœuf/poulet et la Zanzibar pizza à la viande hachée sont disponibles à tous les stands",
    budget: 70
  },
  {
    day: 3, date: "2026-09-14", location: "Stone Town", stage: "Stone Town", phase: "stone-town",
    morning: "Maison des Merveilles / Palais du Sultan (Beit-al-Sahel), Old Fort",
    afternoon: "Farniente/piscine hôtel, shopping artisanal (bois, textiles)",
    evening: "Dîner gastronomique swahili chez Lukmaan ou Emerson Spice rooftop",
    meal: "Cuisine swahili raffinée (curry de poisson, riz pilau)",
    mealAlt: "Demander le mchuzi wa kuku (curry de poulet) ou wa nyama (curry de bœuf/chèvre) — aussi typiques que la version poisson",
    budget: 75
  },
  {
    day: 4, date: "2026-09-15", location: "Stone Town → Nungwi", stage: "Nungwi / Kendwa", phase: "nungwi-kendwa",
    morning: "Spice Tour (plantation d'épices, dégustation)",
    afternoon: "Route vers Nungwi (1h, transfert privé ~35$/couple), installation resort",
    evening: "Dîner bord de plage, coucher de soleil sur l'océan",
    meal: "Poisson du jour grillé, cocktail au bar de plage",
    mealAlt: "Brochettes de poulet grillé ou burger bœuf, présents sur la plupart des cartes des restaurants de plage",
    budget: 80
  },
  {
    day: 5, date: "2026-09-16", location: "Nungwi", stage: "Nungwi / Kendwa", phase: "nungwi-kendwa",
    morning: "Grasse matinée, plage, snorkeling libre depuis la plage",
    afternoon: "Visite du chantier naval traditionnel de dhows + phare de Ras Nungwi",
    evening: "Bar de plage, sunset",
    meal: "Fruits de mer / pizza plage",
    mealAlt: "Pizza margherita ou pizza poulet — toujours au menu à côté des versions fruits de mer",
    budget: 65
  },
  {
    day: 6, date: "2026-09-17", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa", phase: "nungwi-kendwa",
    morning: "Excursion Prison Island (bateau, tortues géantes, snorkeling), demi-journée",
    afternoon: "Farniente Kendwa Beach (marche ou taxi 10 min)",
    evening: "Dîner bord de mer à Kendwa",
    meal: "Grillades de poisson + coco",
    mealAlt: "Grillades mixtes poulet/bœuf + accompagnement coco, courantes dans les mêmes restaurants",
    budget: 90
  },
  {
    day: 7, date: "2026-09-18", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa", phase: "nungwi-kendwa",
    morning: "Journée farniente complète, baignade, marche sur la plage",
    afternoon: "Massage/spa en option, sieste",
    evening: "Sunset party de plage (fréquent à Kendwa)",
    meal: "Cocktail + tapas de plage",
    mealAlt: "Les tapas de plage incluent quasi systématiquement des brochettes de poulet/bœuf",
    budget: 75
  },
  {
    day: 8, date: "2026-09-19", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa", phase: "nungwi-kendwa",
    morning: "Safari Blue (excursion bateau dhow, journée complète)",
    afternoon: "Mangroves, sandbank, snorkeling, BBQ fruits de mer/homard — départ groupé depuis Fumba, transfert inclus",
    evening: "Retour tranquille, dîner léger",
    meal: "Buffet fruits de mer inclus dans Safari Blue",
    mealAlt: "Le buffet Safari Blue inclut aussi poulet grillé, riz et fruits — signaler la préférence \"pas de poisson/fruits de mer\" à la réservation",
    budget: 95
  },
  {
    day: 9, date: "2026-09-20", location: "Nungwi → Matemwe", stage: "Matemwe / Pwani Mchangani", phase: "matemwe",
    morning: "Matinée farniente / derniers achats à Nungwi",
    afternoon: "Transfert vers Matemwe (45 min, ~30$/couple), installation",
    evening: "Dîner sur la plage, calme absolu",
    meal: "Cuisine locale (pilau, samossas maison)",
    mealAlt: "Le pilau est très souvent servi avec du poulet ou du bœuf par défaut — bon choix sans rien demander de spécial",
    budget: 75
  },
  {
    day: 10, date: "2026-09-21", location: "Matemwe", stage: "Matemwe / Pwani Mchangani", phase: "matemwe",
    morning: "Excursion snorkeling Mnemba Island (bateau, masques/tuba fournis, arrêt banc de sable)",
    afternoon: "Retour en fin d'après-midi, repos",
    evening: "Dîner face à l'océan",
    meal: "Poisson/curry de crevettes",
    mealAlt: "Curry de poulet (mchuzi wa kuku), disponible dans la plupart des restaurants de lodge",
    budget: 90
  },
  {
    day: 11, date: "2026-09-22", location: "Matemwe / Jozani", stage: "Matemwe / Pwani Mchangani", phase: "matemwe",
    morning: "Jozani Forest (singes colobes rouges, mangrove), excursion demi-journée",
    afternoon: "Farniente plage",
    evening: "Dîner décontracté",
    meal: "Plat local (mchuzi wa samaki)",
    mealAlt: "Remplacer par mchuzi wa nyama (bœuf) ou wa kuku (poulet) — présents sur toutes les cartes locales",
    budget: 70
  },
  {
    day: 12, date: "2026-09-23", location: "Matemwe", stage: "Matemwe / Pwani Mchangani", phase: "matemwe",
    morning: "Journée farniente totale : plage, lecture, baignade",
    afternoon: "Balade à pied le long de la plage à marée basse (villages de pêcheurs voisins)",
    evening: "Dîner romantique au restaurant de l'hôtel",
    meal: "Menu dégustation fruits de mer",
    mealAlt: "Demander le \"menu terre\" : brochettes mixtes de viande, quasi toujours proposées en alternative au menu mer",
    budget: 80
  },
  {
    day: 13, date: "2026-09-24", location: "Matemwe", stage: "Matemwe / Pwani Mchangani", phase: "matemwe",
    morning: "Option sortie dauphins à Kizimkazi (transfert ~1h30) ou farniente",
    afternoon: "Plage / bar",
    evening: "Dernier coucher de soleil, dîner de fête",
    meal: "Barbecue de poisson + vin/bière locale",
    mealAlt: "Barbecue mixte poulet/bœuf disponible en parallèle du poisson dans la plupart des lodges",
    budget: 85
  },
  {
    day: 14, date: "2026-09-25", location: "Matemwe → Aéroport", stage: "Matemwe / Pwani Mchangani", phase: "vol-retour",
    morning: "Matinée plage tranquille, checkout en douceur",
    afternoon: "Transfert vers aéroport ZNZ (arrêt shopping possible à Stone Town selon horaire de vol)",
    evening: "Vol retour (souvent nocturne)",
    meal: "Déjeuner léger + snack aéroport",
    mealAlt: "Sandwichs/snacks viande disponibles aux boutiques de l'aéroport",
    budget: 55
  },
  {
    day: 15, date: "2026-09-26", location: "Vol retour → Paris", stage: "Matemwe / Pwani Mchangani", phase: "vol-retour",
    morning: "Vol escale",
    afternoon: "Arrivée Paris en journée/soirée",
    evening: "—",
    meal: "Repas à bord",
    mealAlt: "Choix \"repas viande\" généralement sélectionnable lors de la réservation ou de l'enregistrement en ligne",
    budget: 0
  }
];

const PRACTICAL_INFO = [
  {
    title: "Visa",
    icon: "passport",
    content: "e-Visa obligatoire depuis janvier 2025 (plus de visa à l'arrivée). Demande sur visa.immigration.go.tz — coût 50$/pers (entrée simple tourisme), délai 4-6 jours ouvrés. À demander 2-3 semaines avant le départ. Documents requis : passeport valide 6 mois, photo d'identité, scan passeport, copie du billet d'avion."
  },
  {
    title: "Assurance obligatoire Zanzibar",
    icon: "shield",
    content: "Depuis le 1er octobre 2024, obligatoire pour tout visiteur entrant à Zanzibar. 44$/adulte, valable 3 mois, couvre frais médicaux d'urgence jusqu'à 50 000$, évacuation et bagages. À acheter en ligne sur visitzanzibar.go.tz avant le départ (reçu + QR code demandés à l'immigration)."
  },
  {
    title: "Assurance voyage complémentaire",
    icon: "plane",
    content: "En plus de l'assurance obligatoire, prendre une assurance voyage complète (Chapka, Europ Assistance, carte bancaire premium) pour annulation, rapatriement complet, vol de bagages, activités nautiques (snorkeling/plongée)."
  },
  {
    title: "Santé & vaccins",
    icon: "cross",
    content: "Aucun vaccin obligatoire pour un séjour touristique standard, sauf fièvre jaune si transit par pays à risque (à vérifier selon compagnie/escale). Recommandés : DTP à jour, hépatites A/B, typhoïde. Traitement antipaludéen fortement recommandé (zone de paludisme, risque faible à modéré) — consulter un médecin 4-6 semaines avant le départ. Prévoir répulsifs anti-moustiques ; moustiquaire généralement fournie."
  },
  {
    title: "Monnaie",
    icon: "coin",
    content: "Shilling tanzanien (TZS). Dollars US (billets récents, non froissés, post-2009) largement acceptés pour hôtels/excursions/entrées, mais prévoir des TZS en liquide pour marchés, petits restos, dala-dala, pourboires. Distributeurs disponibles à Stone Town et zones touristiques — prévenir sa banque avant le départ."
  },
  {
    title: "Décalage horaire",
    icon: "clock",
    content: "Zanzibar est à UTC+3, soit +2h par rapport à la France en septembre (heure d'été française UTC+2). Peu de jetlag à gérer."
  },
  {
    title: "Connexion internet / eSIM",
    icon: "wifi",
    content: "eSIM à installer avant le départ (Airalo, Holafly, eSIM Tanzania) pour ~15-25€/15 jours. Sinon SIM locale Vodacom, Airtel ou Tigo à l'arrivée. Bon réseau 4G en zones touristiques, plus irrégulier en villages reculés."
  },
  {
    title: "Prises électriques",
    icon: "plug",
    content: "Type G (prises britanniques à 3 broches carrées), 230V/50Hz. Prévoir un adaptateur universel (identique Royaume-Uni/Kenya)."
  },
  {
    title: "Code vestimentaire",
    icon: "shirt",
    content: "Zanzibar est à majorité musulmane, conservatrice à Stone Town et dans les villages : épaules et genoux couverts recommandés hors plage/hôtels, prévoir un paréo/châle léger. Sur les plages des resorts, tenue balnéaire classique acceptée ; monokini/topless non approprié même en plage publique. Tenue plus couvrante pour visiter les mosquées."
  },
  {
    title: "Sécurité",
    icon: "lock",
    content: "Destination globalement sûre pour les touristes. Vigilance sur les vols à la tire dans les marchés très touristiques (Forodhani, Darajani), éviter les ruelles isolées de Stone Town de nuit, négocier les prix des taxis/excursions à l'avance, se méfier des rabatteurs insistants (« papasi »)."
  },
  {
    title: "Numéros d'urgence",
    icon: "phone",
    content: "Police : 112 ou 999 — Ambulance : 114 — Zanzibar Tourist Police (présente à Stone Town et zones balnéaires) — Ambassade de France à Dar es Salaam (compétente pour Zanzibar), à noter avant le départ."
  },
  {
    title: "Applications utiles",
    icon: "app",
    content: "Maps.me ou Google Maps hors-ligne (télécharger la carte de Zanzibar avant le départ) — M-Pesa/Tigo Pesa/Airtel Money (paiement mobile local) — XE Currency (taux de change) — Airalo/Holafly (eSIM)."
  },
  {
    title: "Marées",
    icon: "wave",
    content: "Les marées influencent fortement les excursions bateau et le snorkeling (lagons qui se vident à marée basse à Matemwe/Jozani). Vérifier le calendrier des marées local à l'arrivée (hôtels ou appli Tide Times Tanzania) : privilégier marée haute ou mi-marée montante pour le snorkeling/Safari Blue/Mnemba."
  }
];

const CHECKLIST = [
  {
    group: "Documents",
    icon: "passport",
    items: [
      "Passeport valide au moins 6 mois après la date de retour",
      "e-Visa Tanzanie imprimé + copie numérique",
      "Attestation d'assurance obligatoire Zanzibar (44$/pers) avec QR code",
      "Attestation d'assurance voyage complémentaire",
      "Billets d'avion imprimés + réservations hôtels",
      "Copies scannées de tous les documents (cloud + photos des passeports)",
      "Permis de conduire international (si location de véhicule)"
    ]
  },
  {
    group: "Santé",
    icon: "cross",
    items: [
      "Consultation médecin / centre de vaccination internationale (4-6 semaines avant)",
      "Traitement antipaludéen prescrit et acheté",
      "Vaccins à jour (DTP, hépatites A/B, fièvre jaune si besoin)",
      "Trousse à pharmacie (antipaludéen, anti-diarrhéique, réhydratation orale, antalgiques, pansements, désinfectant, anti-moustique DEET 30-50%, crème solaire 50+, after-sun)",
      "Vérifier couverture carte bancaire/mutuelle pour frais médicaux à l'étranger"
    ]
  },
  {
    group: "Argent",
    icon: "coin",
    items: [
      "Prévenir la banque du voyage",
      "Prévoir des dollars US en liquide (billets récents, non froissés)",
      "Carte bancaire internationale sans frais à l'étranger (Revolut/Wise)",
      "Petite réserve de cash TZS ou USD pour marchés/pourboires/dala-dala"
    ]
  },
  {
    group: "Valise / vêtements",
    icon: "bag",
    items: [
      "Vêtements légers et couvrants pour Stone Town et villages",
      "Maillots de bain + paréo/sarong",
      "Masque, tuba, éventuellement palmes personnelles",
      "Chaussures d'eau (coraux/oursins à marée basse)",
      "Chapeau/casquette, lunettes de soleil, k-way léger",
      "Sandales de marche + une paire fermée pour excursions",
      "Sac étanche léger pour les excursions bateau"
    ]
  },
  {
    group: "Électronique",
    icon: "plug",
    items: [
      "Adaptateur prise type G",
      "Batterie externe",
      "eSIM ou SIM locale prévue",
      "Appareil photo/GoPro étanche pour le snorkeling",
      "Chargeurs + câbles + copie de sauvegarde des documents sur le téléphone"
    ]
  }
];

// Activités & excursions, triables par zone, avec CTA de comparaison/réservation
const ACTIVITIES = [
  {
    name: "Spice Tour",
    zone: "Stone Town",
    icon: "wave",
    description: "Visite d'une plantation d'épices, dégustation, explications sur girofle/vanille/poivre. Demi-journée.",
    duration: "~3h",
    price: "15 – 25 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=zanzibar+spice+tour"
  },
  {
    name: "Visite guidée de Stone Town",
    zone: "Stone Town",
    icon: "building",
    description: "Vieille ville swahilie classée UNESCO, marché de Darajani, ancien marché aux esclaves.",
    duration: "~3h",
    price: "20 – 30 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=stone+town+walking+tour"
  },
  {
    name: "Prison Island (Changuu)",
    zone: "Nungwi / Kendwa",
    icon: "wave",
    description: "Bateau depuis Stone Town, tortues géantes centenaires, snorkeling léger sur le trajet.",
    duration: "Demi-journée",
    price: "35 – 50 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=prison+island+zanzibar"
  },
  {
    name: "Safari Blue",
    zone: "Nungwi / Kendwa",
    icon: "wave",
    description: "Excursion bateau dhow journée complète : mangroves, banc de sable, snorkeling, BBQ fruits de mer/homard (option viande sur demande).",
    duration: "Journée complète",
    price: "70 – 85 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=safari+blue+zanzibar"
  },
  {
    name: "Snorkeling Mnemba Island",
    zone: "Matemwe / Pwani Mchangani",
    icon: "wave",
    description: "Le meilleur spot de snorkeling de Zanzibar, eaux cristallines, tortues et poissons tropicaux.",
    duration: "Demi-journée",
    price: "55 – 70 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=mnemba+island+snorkeling"
  },
  {
    name: "Jozani Forest",
    zone: "Matemwe / Pwani Mchangani",
    icon: "building",
    description: "Seule forêt protégée de Zanzibar : singes colobes rouges endémiques, mangrove sur ponton en bois.",
    duration: "~2h30",
    price: "20 – 30 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=jozani+forest+zanzibar"
  },
  {
    name: "Sortie dauphins à Kizimkazi",
    zone: "Matemwe / Pwani Mchangani",
    icon: "wave",
    description: "Observation (et parfois baignade encadrée) avec les dauphins au large de Kizimkazi, au sud de l'île.",
    duration: "Demi-journée",
    price: "35 – 45 €/pers",
    ctaUrl: "https://www.getyourguide.com/s/?q=kizimkazi+dolphin+tour"
  }
];

// Coordonnées géographiques réelles (lat, lng) pour la carte interactive
const MAP_POINTS = [
  { name: "Aéroport de Zanzibar (ZNZ)", coords: [-6.2220, 39.2249], type: "airport" },
  { name: "Stone Town (3 nuits)", coords: [-6.1659, 39.1917], type: "stage" },
  { name: "Nungwi / Kendwa (5 nuits)", coords: [-5.7273, 39.2952], type: "stage" },
  { name: "Matemwe / Pwani Mchangani (5 nuits)", coords: [-5.8404, 39.3697], type: "stage" },
  { name: "Mnemba Island (snorkeling)", coords: [-5.8167, 39.3833], type: "activity" },
  { name: "Jozani Forest", coords: [-6.2685, 39.4008], type: "activity" },
  { name: "Prison Island (Changuu)", coords: [-6.1233, 39.1667], type: "activity" },
  { name: "Kizimkazi (dauphins)", coords: [-6.4667, 39.3667], type: "activity" }
];
