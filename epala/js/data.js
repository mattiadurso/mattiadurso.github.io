/* Contenuti del sito: categorie, gallerie e stampe dell'hero.
   Ogni immagine: [cartella, file, larghezza, altezza]. */
window.EP_DATA = (function () {
  // Dati EXIF reali, letti dagli originali pubblicati sul sito (solo dove presenti).
  const EXIF = {
    'chi-sono/video-drone': 'DJI Phantom 3 · 4mm · f/2.8 · 1/25s · ISO 136',
    'eventi-aziendali/beantechoscars2022-268': 'Nikon D4S · 190mm · f/2.8 · 1/80s · ISO 5000',
    'eventi-aziendali/beantechoscars2022-299': 'Sony A7 III · 85mm · f/1.8 · 1/80s · ISO 640',
    'eventi-food/carnia-38': 'Sony A7 III · 53mm · f/4 · 1/1250s · ISO 200',
    'eventi-food/carnia-45': 'Sony A7 III · 70mm · f/2.8 · 1/4000s · ISO 200',
    'eventi-food/carnia-5': 'Sony A7 III · 70mm · f/2.8 · 1/640s · ISO 200',
    'eventi-food/carnia-79': 'Sony A7 III · 50mm · f/2.8 · 1/500s · ISO 200',
    'eventi-food/eccellenzeinmalga-06661': 'Sony A7 III · 35mm · f/4.5 · 1/640s · ISO 100',
    'eventi-food/eim22-8283': 'Canon 6D Mark II · 35mm · f/2.5 · 1/2000s · ISO 100',
    'night-life/charlino-432': 'Sony A7 III · 85mm · f/1.8 · 1/80s · ISO 8000',
    'night-life/nickym-05718': 'Sony A7 III · 62mm · f/2.8 · 1/100s · ISO 1600',
    'night-life/nickymsymposium-05413': 'Sony A7 III · 85mm · f/1.8 · 1/60s · ISO 3200',
    'night-life/pla05989': 'Sony A7 III · 28mm · f/2.8 · 1/60s · ISO 2500',
    'eventi-aziendali/beantechoscars2022-255': 'Nikon D4S · 86mm · f/3.2 · 1/250s · ISO 5000',
    'eventi-food/eim22-8215': 'Canon 6D Mark II · 35mm · f/2.8 · 1/100s · ISO 100',
    'eventi-food/eim22-8278': 'Canon 6D Mark II · 35mm · f/2.8 · 1/2000s · ISO 100',
    'eventi-food/eim22-8288': 'Canon 6D Mark II · 35mm · f/2.5 · 1/2000s · ISO 100',
    'eventi-food/carnia-3': 'Sony A7 III · 33mm · f/2.8 · 1/2500s · ISO 200',
    'eventi-food/carnia-4': 'Sony A7 III · 51mm · f/2.8 · 1/6400s · ISO 200',
    'eventi-food/carnia-31': 'Sony A7 III · 52mm · f/2.8 · 1/4000s · ISO 200',
    'eventi-food/carnia-64': 'Sony A7 III · 40mm · f/2.8 · 1/1000s · ISO 200',
    'eventi-food/eccellenzeinmalga-06121': 'Sony A7 III · 35mm · f/4.5 · 1/640s · ISO 100',
    'eventi-food/eccellenzeinmalga-06199': 'Sony A7 III · 35mm · f/3.2 · 1/3200s · ISO 160',
    'eventi-food/eccellenzeinmalga-06554': 'Sony A7 III · 35mm · f/4 · 1/640s · ISO 100',
    'eventi-food/eccellenzeinmalga-06564': 'Sony A7 III · 35mm · f/4 · 1/640s · ISO 100',
    'eventi-food/eccellenzeinmalga-06588': 'Sony A7 III · 35mm · f/4 · 1/800s · ISO 100',
    'night-life/nickym-05571': 'Sony A7 III · 28mm · f/3.2 · 1/100s · ISO 400',
    'night-life/nickym-05730': 'Sony A7 III · 35mm · f/2.8 · 1/80s · ISO 800',
    'night-life/nickymsymposium-05588': 'Sony A7 III · 85mm · f/2.2 · 1/100s · ISO 2000',
    'night-life/pla05907': 'Sony A7 III · 54mm · f/2.8 · 1/100s · ISO 2500',
    'night-life/pla05955': 'Sony A7 III · 42mm · f/2.8 · 1/40s · ISO 8000',
    'night-life/pla06297': 'Sony A7 III · 55mm · f/2.8 · 1/100s · ISO 8000',
    'night-life/charlino-324': 'Sony A7 III · 85mm · f/1.8 · 1/100s · ISO 8000',
  };

  const P = (cat, name, w, h) => ({
    full: `assets/web/${cat}/${name}.webp`,
    thumb: `assets/web/thumbs/${cat}/${name}.webp`,
    exif: EXIF[`${cat}/${name}`] || '',
    w, h,
  });

  const categories = [
    {
      slug: 'wedding', title: 'Wedding', group: 'Matrimoni',
      lede: 'Il giorno più atteso, raccontato con discrezione: dai preparativi all’ultimo ballo.',
      cover: P('wedding', 'wedding-101', 1067, 1600),
      images: [
        P('wedding', 'wedding-101', 1067, 1600), P('wedding', 'wedding-1', 1600, 1067),
        P('wedding', 'wedding-11', 1067, 1600), P('wedding', 'wedding-115', 1067, 1600),
        P('wedding', 'wedding-200', 1600, 1067), P('wedding', 'wedding-206', 1067, 1600),
        P('wedding', 'wedding-134', 1067, 1600), P('wedding', 'wedding-139', 1600, 1067),
        P('wedding', 'wedding-15', 1067, 1600), P('wedding', 'wedding-164', 1067, 1600),
        P('wedding', 'wedding-212', 1067, 1600), P('wedding', 'wedding-209', 1067, 1600),
        P('wedding', 'wedding-109', 1067, 1600), P('wedding', 'wedding-2', 1600, 1067),
        P('wedding', 'wedding-213', 1067, 1600), P('wedding', 'wedding-30', 1067, 1600),
      ],
    },
    {
      slug: 'night-life', title: 'Night Life', group: 'Eventi',
      lede: 'Club, concerti e serate: luce artificiale, movimento, energia.',
      cover: P('night-life', 'nickym-05718', 1067, 1600),
      images: [
        P('night-life', 'nickym-05718', 1067, 1600), P('night-life', 'nickym-05571', 1066, 1600),
        P('night-life', 'ceghedacciosymphony-86', 1600, 1067), P('night-life', 'nickym-05730', 1600, 1067),
        P('night-life', 'pla05989', 1066, 1600), P('night-life', 'nickymsymposium-05588', 1067, 1600),
        P('night-life', 'mrcharlie-121', 1600, 1067), P('night-life', 'pla05907', 1067, 1600),
        P('night-life', 'nickymsymposium-05413', 1067, 1600), P('night-life', 'pla05955', 1067, 1600),
        P('night-life', 'ceghedacciosymphony-60', 1600, 1067), P('night-life', 'pla06297', 1067, 1600),
        P('night-life', 'charlino-432', 1066, 1600), P('night-life', 'charlino-324', 1600, 1067),
        P('night-life', 'mrcharlie-525', 1600, 1067), P('night-life', 'lizzio-40', 1067, 1600),
        P('night-life', 'mrcharlie-154', 1600, 1067), P('night-life', 'mrcharlie-110', 1067, 1600),
      ],
    },
    {
      slug: 'eventi-food', title: 'Eventi food', group: 'Eventi',
      lede: 'Degustazioni, cene in quota e festival: il gusto, le persone, il paesaggio.',
      cover: P('eventi-food', 'carnia-79', 1067, 1600),
      images: [
        P('eventi-food', 'carnia-79', 1067, 1600), P('eventi-food', 'eim22-8215', 1067, 1600),
        P('eventi-food', 'calicidistelle-114', 1600, 1067), P('eventi-food', 'eim22-8278', 1600, 1067),
        P('eventi-food', 'carnia-5', 1067, 1600), P('eventi-food', 'eim22-8288', 1600, 1066),
        P('eventi-food', 'eim22-8283', 1600, 1067), P('eventi-food', 'carnia-3', 1067, 1600),
        P('eventi-food', 'carnia-38', 1067, 1600), P('eventi-food', 'carnia-4', 1067, 1600),
        P('eventi-food', 'calicidistelle-33', 1600, 1067), P('eventi-food', 'carnia-31', 1067, 1600),
        P('eventi-food', 'carnia-45', 1067, 1600), P('eventi-food', 'carnia-64', 1067, 1600),
        P('eventi-food', 'eccellenzeinmalga-88', 1536, 1024), P('eventi-food', 'eccellenzeinmalga-06121', 1067, 1600),
        P('eventi-food', 'eccellenzeinmalga-06661', 1067, 1600), P('eventi-food', 'eccellenzeinmalga-06199', 1066, 1600),
        P('eventi-food', 'carniaeccellenzeinmalga-32', 1024, 1536), P('eventi-food', 'eccellenzeinmalga-06554', 1600, 1067),
        P('eventi-food', 'lanottebiancaeoro-2-10', 1024, 1536), P('eventi-food', 'eccellenzeinmalga-06564', 1600, 1067),
        P('eventi-food', 'eccellenzeinmalga-06588', 1067, 1600),
      ],
    },
    {
      slug: 'eventi-aziendali', title: 'Eventi aziendali', group: 'Eventi',
      lede: 'Convention, premiazioni e serate di gala, con l’occhio di chi racconta un brand.',
      cover: P('eventi-aziendali', 'beantechoscars2022-299', 1067, 1600),
      images: [
        P('eventi-aziendali', 'beantechoscars2022-299', 1067, 1600), P('eventi-aziendali', 'beantechoscars2022-255', 1065, 1600),
        P('eventi-aziendali', 'beantechoscars2022-268', 1600, 1065), P('eventi-aziendali', 'gruppoferri-29', 1066, 1600),
        P('eventi-aziendali', 'beantech-82', 1600, 1067), P('eventi-aziendali', 'pettarini-71', 1067, 1600),
        P('eventi-aziendali', 'pettarini-109', 1600, 1067), P('eventi-aziendali', 'udinese-172', 1600, 1066),
        P('eventi-aziendali', 'udinese-31', 1600, 1067),
      ],
    },
    {
      slug: 'ritratti', title: 'Ritratti', group: 'Shooting',
      lede: 'Luce naturale, spiaggia, studio: ritratti che somigliano a chi li guarda.',
      cover: P('ritratti', 'shootingbibione-08703', 1067, 1600),
      images: [
        P('ritratti', 'shootingbibione-08703', 1067, 1600), P('ritratti', 'img_5011', 1067, 1600),
        P('ritratti', 'shooting-6517', 1067, 1600), P('ritratti', 'img_4967', 1067, 1600),
        P('ritratti', 'pla08695', 1067, 1600), P('ritratti', 'shooting-6816', 1067, 1600),
        P('ritratti', 'shootingbibione-08491', 1067, 1600), P('ritratti', 'shootingbibione-08766', 1067, 1600),
      ],
    },
    {
      slug: 'famiglia', title: 'Famiglia', group: 'Shooting',
      lede: 'Maternità, primi compleanni, fratelli: piccoli momenti che diventano grandi.',
      cover: P('famiglia', 'img_1334', 1024, 1600),
      images: [
        P('famiglia', 'img_1334', 1024, 1600), P('famiglia', 'ueibi-24', 1067, 1600),
        P('famiglia', 'img_7928', 1600, 1067), P('famiglia', 'img_0678', 1067, 1600),
        P('famiglia', 'kevin-42', 1066, 1600), P('famiglia', 'img_1397', 1067, 1600),
        P('famiglia', 'ueibi-36', 1600, 1067), P('famiglia', 'ueibi-32', 1067, 1600),
      ],
    },
    {
      slug: 'interni', title: 'Interni', group: 'Shooting',
      lede: 'Case, B&B e locali: spazi luminosi, puliti, pronti per essere prenotati.',
      cover: P('interni', 'airbnbpassons-23', 1600, 1067),
      images: [
        P('interni', 'airbnbpassons-23', 1600, 1067), P('interni', 'airbnbpassons-1', 1600, 1067),
        P('interni', 'airbnbpassons-11', 1600, 1066), P('interni', 'airbnbpassons-16', 1600, 1067),
        P('interni', 'airbnbpassons-27', 1600, 1067), P('interni', 'airbnbpassons-37', 1600, 1066),
        P('interni', 'airbnbpassons-40', 1600, 1067),
      ],
    },
    {
      slug: 'video', title: 'Video', group: 'Reel & drone',
      lede: 'Reel verticali per i social, riprese con drone e video di eventi.',
      cover: P('reel-drone', 'video-cover', 1600, 900),
      // Reel verticali (YouTube Shorts). Titoli presi da YouTube; "oar" = esiste la miniatura verticale.
      youtube: [
        { id: 'CG3NhrC8km8', title: 'Dinner Room x Levels Event · DeRoomClub', oar: true },
        { id: 'iN6pfxe6FXY', title: 'Kursaal Terrace, Last Dance · Kursaal Club', oar: true },
        { id: 'RFfDy5SWfxE', title: 'Andrea Lizzio · JustMe Milano', oar: true },
        { id: 'ugnWpcuYDX4', title: 'Dinner Room · DeRoomClub', oar: true },
        { id: 'whCmXDCRsn4', title: 'Aperitivo Ai Do Mori · AiDoMoriOsteria', oar: true },
        { id: 'WiMyQBRu6eI', title: 'Roby Scossa · JustMe Milano', oar: false },
        { id: 'ystxST8wXiY', title: 'Rumba · Five Club Udine', oar: false },
      ],
      images: [P('reel-drone', 'video-cover', 1600, 900), P('chi-sono', 'video-drone', 1500, 1124)],
    },
  ];

  return { categories };
})();
