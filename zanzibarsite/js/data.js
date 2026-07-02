// Données du voyage — Zanzibar 2026 (couple, 15 jours)
// Toutes les dates sont au format ISO (YYYY-MM-DD)

const TRIP_INFO = {
  destination: "Zanzibar, Tanzanie",
  origin: "Paris 12e",
  startDate: "2026-09-12",
  endDate: "2026-09-26",
  days: 15,
  nights: 14,
  travelers: 2,
  budgetPerPerson: 3500,
  budgetCouple: 7000,
  stages: [
    { name: "Stone Town", nights: 3, dates: "12 → 15 sept." },
    { name: "Nungwi / Kendwa", nights: 5, dates: "15 → 20 sept." },
    { name: "Matemwe / Pwani Mchangani", nights: 5, dates: "20 → 25 sept." }
  ],
  whySeptember: "Septembre est le mois le plus sec de l'année à Zanzibar (~24mm de pluie), mer calme, eau claire idéale pour le snorkeling (Mnemba, Safari Blue), 27-30°C, mer à 26-27°C. Moins d'affluence qu'en juillet-août ou décembre, et prix vols/hôtels plus doux qu'en haute saison."
};

const FLIGHTS = [
  {
    airline: "Ethiopian Airlines",
    airport: "CDG",
    stopover: "Addis-Abeba (ADD)",
    duration: "13h30 – 16h",
    price: "550 – 750 €",
    recommended: true
  },
  {
    airline: "Kenya Airways",
    airport: "CDG",
    stopover: "Nairobi (NBO)",
    duration: "14h – 17h",
    price: "600 – 850 €",
    recommended: true
  },
  {
    airline: "Turkish Airlines",
    airport: "CDG",
    stopover: "Istanbul (IST)",
    duration: "14h – 17h",
    price: "600 – 800 €",
    recommended: false
  },
  {
    airline: "Qatar Airways",
    airport: "CDG",
    stopover: "Doha (DOH)",
    duration: "15h – 18h",
    price: "650 – 950 €",
    recommended: false
  }
];

const ACCOMMODATIONS = [
  {
    stage: "Stone Town",
    nights: 3,
    type: "Boutique guesthouse 3-4★, charme swahili",
    examples: "Zanzibar Palace Hotel, Beyt al Salaam, Kholle House",
    priceRange: "70 – 100 €/nuit (2 pers., petit-déj inclus)"
  },
  {
    stage: "Nungwi / Kendwa",
    nights: 5,
    type: "Resort bord de plage 3-4★, ambiance conviviale, piscine, bar de plage",
    examples: "Nungwi Beach Resort by Turaco, Sunrise Kendwa, Canary Kendwa Beach Resort",
    priceRange: "90 – 130 €/nuit (2 pers., demi-pension)"
  },
  {
    stage: "Matemwe / Pwani Mchangani",
    nights: 5,
    type: "Boutique resort/lodge 4★, calme, proche Mnemba",
    examples: "Matemwe Beach Village, Zanzibar White Sand Luxury Villas & Spa",
    priceRange: "100 – 140 €/nuit (2 pers., demi-pension)"
  }
];

// Budget prévisionnel par personne (éditable : "dépensé réel" saisi par l'utilisateur, stocké en local)
const BUDGET_CATEGORIES = [
  { key: "vol", label: "Vol A/R Paris–Zanzibar", planned: 650, detail: "Ethiopian ou Kenya Airways, réservé 4-6 mois à l'avance" },
  { key: "hebergement", label: "Hébergement (14 nuits)", planned: 825, detail: "Moyenne pondérée des 3 étapes, part par personne" },
  { key: "nourriture", label: "Nourriture & boissons", planned: 440, detail: "~28-32€/jour, mix street-food / restos / 2-3 dîners chics" },
  { key: "excursions", label: "Excursions & activités", planned: 225, detail: "Spice tour, Prison Island, Safari Blue, Mnemba, Jozani, pourboires" },
  { key: "transport", label: "Transport local", planned: 110, detail: "Transferts aéroport + inter-zones, taxis, dala-dala" },
  { key: "assurance", label: "Assurance obligatoire Zanzibar", planned: 41, detail: "44$ / adulte, valable 3 mois" },
  { key: "visa", label: "e-Visa Tanzanie", planned: 46, detail: "50$ / pers., à faire 2-3 semaines avant" },
  { key: "divers", label: "Divers / imprévus", planned: 160, detail: "Marge de sécurité ~5% (pharmacie, shopping, pourboires)" }
];
// Total prévisionnel ≈ 2497€/pers — marge de ~1000€ sous le plafond de 3500€/pers

const ITINERARY = [
  {
    day: 1, date: "2026-09-12", location: "Paris → Zanzibar", stage: "Stone Town",
    morning: "Vol CDG → escale",
    afternoon: "Vol escale → ZNZ, arrivée en soirée",
    evening: "Transfert privé vers Stone Town (~15 min, 12$), installation, dîner léger à l'hôtel",
    meal: "Dîner terrasse rooftop Stone Town (poisson grillé)",
    budget: 35
  },
  {
    day: 2, date: "2026-09-13", location: "Stone Town", stage: "Stone Town",
    morning: "Visite guidée à pied du vieux Stone Town (maisons swahilies, portes sculptées, ancien marché aux esclaves)",
    afternoon: "Marché de Darajani, balade au front de mer, Forodhani Gardens",
    evening: "Dîner street-food à Forodhani Gardens",
    meal: "Street food Forodhani (brochettes, Zanzibar pizza, jus de canne à sucre)",
    budget: 70
  },
  {
    day: 3, date: "2026-09-14", location: "Stone Town", stage: "Stone Town",
    morning: "Maison des Merveilles / Palais du Sultan (Beit-al-Sahel), Old Fort",
    afternoon: "Farniente/piscine hôtel, shopping artisanal (bois, textiles)",
    evening: "Dîner gastronomique swahili chez Lukmaan ou Emerson Spice rooftop",
    meal: "Cuisine swahili raffinée (curry de poisson, riz pilau)",
    budget: 75
  },
  {
    day: 4, date: "2026-09-15", location: "Stone Town → Nungwi", stage: "Nungwi / Kendwa",
    morning: "Spice Tour (plantation d'épices, dégustation)",
    afternoon: "Route vers Nungwi (1h, transfert privé ~35$/couple), installation resort",
    evening: "Dîner bord de plage, coucher de soleil sur l'océan",
    meal: "Poisson du jour grillé, cocktail au bar de plage",
    budget: 80
  },
  {
    day: 5, date: "2026-09-16", location: "Nungwi", stage: "Nungwi / Kendwa",
    morning: "Grasse matinée, plage, snorkeling libre depuis la plage",
    afternoon: "Visite du chantier naval traditionnel de dhows + phare de Ras Nungwi",
    evening: "Bar de plage, sunset",
    meal: "Fruits de mer / pizza plage",
    budget: 65
  },
  {
    day: 6, date: "2026-09-17", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa",
    morning: "Excursion Prison Island (bateau, tortues géantes, snorkeling), demi-journée",
    afternoon: "Farniente Kendwa Beach (marche ou taxi 10 min)",
    evening: "Dîner bord de mer à Kendwa",
    meal: "Grillades de poisson + coco",
    budget: 90
  },
  {
    day: 7, date: "2026-09-18", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa",
    morning: "Journée farniente complète, baignade, marche sur la plage",
    afternoon: "Massage/spa en option, sieste",
    evening: "Sunset party de plage (fréquent à Kendwa)",
    meal: "Cocktail + tapas de plage",
    budget: 75
  },
  {
    day: 8, date: "2026-09-19", location: "Nungwi / Kendwa", stage: "Nungwi / Kendwa",
    morning: "Safari Blue (excursion bateau dhow, journée complète)",
    afternoon: "Mangroves, sandbank, snorkeling, BBQ fruits de mer/homard — départ groupé depuis Fumba, transfert inclus",
    evening: "Retour tranquille, dîner léger",
    meal: "Buffet fruits de mer inclus dans Safari Blue",
    budget: 95
  },
  {
    day: 9, date: "2026-09-20", location: "Nungwi → Matemwe", stage: "Matemwe / Pwani Mchangani",
    morning: "Matinée farniente / derniers achats à Nungwi",
    afternoon: "Transfert vers Matemwe (45 min, ~30$/couple), installation",
    evening: "Dîner sur la plage, calme absolu",
    meal: "Cuisine locale (pilau, samossas maison)",
    budget: 75
  },
  {
    day: 10, date: "2026-09-21", location: "Matemwe", stage: "Matemwe / Pwani Mchangani",
    morning: "Excursion snorkeling Mnemba Island (bateau, masques/tuba fournis, arrêt banc de sable)",
    afternoon: "Retour en fin d'après-midi, repos",
    evening: "Dîner face à l'océan",
    meal: "Poisson/curry de crevettes",
    budget: 90
  },
  {
    day: 11, date: "2026-09-22", location: "Matemwe / Jozani", stage: "Matemwe / Pwani Mchangani",
    morning: "Jozani Forest (singes colobes rouges, mangrove), excursion demi-journée",
    afternoon: "Farniente plage",
    evening: "Dîner décontracté",
    meal: "Plat local (mchuzi wa samaki)",
    budget: 70
  },
  {
    day: 12, date: "2026-09-23", location: "Matemwe", stage: "Matemwe / Pwani Mchangani",
    morning: "Journée farniente totale : plage, lecture, baignade",
    afternoon: "Balade à pied le long de la plage à marée basse (villages de pêcheurs voisins)",
    evening: "Dîner romantique au restaurant de l'hôtel",
    meal: "Menu dégustation fruits de mer",
    budget: 80
  },
  {
    day: 13, date: "2026-09-24", location: "Matemwe", stage: "Matemwe / Pwani Mchangani",
    morning: "Option sortie dauphins à Kizimkazi (transfert ~1h30) ou farniente",
    afternoon: "Plage / bar",
    evening: "Dernier coucher de soleil, dîner de fête",
    meal: "Barbecue de poisson + vin/bière locale",
    budget: 85
  },
  {
    day: 14, date: "2026-09-25", location: "Matemwe → Aéroport", stage: "Matemwe / Pwani Mchangani",
    morning: "Matinée plage tranquille, checkout en douceur",
    afternoon: "Transfert vers aéroport ZNZ (arrêt shopping possible à Stone Town selon horaire de vol)",
    evening: "Vol retour (souvent nocturne)",
    meal: "Déjeuner léger + snack aéroport",
    budget: 55
  },
  {
    day: 15, date: "2026-09-26", location: "Vol retour → Paris", stage: "Matemwe / Pwani Mchangani",
    morning: "Vol escale",
    afternoon: "Arrivée Paris en journée/soirée",
    evening: "—",
    meal: "Repas à bord",
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

const MAP_POINTS = [
  { name: "Aéroport de Zanzibar (ZNZ)", x: 46, y: 62, type: "airport" },
  { name: "Stone Town (3 nuits)", x: 44, y: 60, type: "stage" },
  { name: "Nungwi / Kendwa (5 nuits)", x: 40, y: 8, type: "stage" },
  { name: "Matemwe / Pwani Mchangani (5 nuits)", x: 68, y: 22, type: "stage" },
  { name: "Mnemba Island (snorkeling)", x: 82, y: 18, type: "activity" },
  { name: "Jozani Forest", x: 58, y: 68, type: "activity" },
  { name: "Prison Island", x: 36, y: 55, type: "activity" },
  { name: "Kizimkazi (dauphins)", x: 38, y: 96, type: "activity" }
];
