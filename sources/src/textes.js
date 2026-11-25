// Textes de la carte en trois langues. La langue est choisie à la compilation (VITE_LANGUE = fr, es ou it).
export const LANGUES = {
  fr: {
    titre: 'Traités signés par l’Australie avec des États insulaires du Pacifique, depuis 2023',
    chapo: 'Selon l’engagement pris par le pays partenaire en matière de défense et de coopération de sécurité avec des pays tiers',
    source: 'Sources : Lowy Institute, ministère australien des Affaires étrangères · Carte : Le Grand Continent',
    cle: ['Alliance de défense mutuelle', 'Accord de Canberra requis pour tout partenariat de sécurité avec un pays tiers', 'Consultation préalable de Canberra avant tout engagement d’un pays tiers dans la sécurité ou les infrastructures sensibles'],
    carte: 'Carte du Pacifique Sud-Ouest montrant les six États insulaires qui ont signé un traité de sécurité avec l’Australie depuis 2023 : Tuvalu, Nauru, la Papouasie-Nouvelle-Guinée, le Vanuatu, les Fidji et les Îles Salomon.',
    pays: { AUS: 'Australie', IDN: 'Indonésie', NCL: 'Nouvelle-Calédonie', NZL: 'Nouvelle-Zélande' },
    mers: [['Mer', 'de Corail'], ['Océan', 'Pacifique'], ['Mer', 'de Tasman']],
    canberra: 'Canberra',
    notes: {
      PNG: ['Papouasie-|Nouvelle-Guinée', 'Traité Pukpuk', 'octobre 2025'],
      NRU: ['Nauru', 'Traité Nauru-Australie', 'décembre 2024'],
      TUV: ['Tuvalu', 'Union Falepili', 'novembre 2023'],
      SLB: ['Îles Salomon', 'Traité Australie-Îles Salomon', '25 novembre 2026'],
      VUT: ['Vanuatu', 'Accord Nakamal', 'juin 2026'],
      FJI: ['Fidji', 'Alliance Ocean of Peace', 'juillet 2026']
    },
    km: 'km'
  },
  es: {
    titre: 'Tratados firmados por Australia con Estados insulares del Pacífico, desde 2023',
    chapo: 'Según el compromiso asumido por el país socio en materia de defensa y de cooperación de seguridad con terceros países',
    source: 'Fuentes: Lowy Institute, Ministerio de Asuntos Exteriores de Australia · Mapa: El Grand Continent',
    cle: ['Alianza de defensa mutua', 'Acuerdo de Canberra necesario para cualquier asociación de seguridad con un tercer país', 'Consulta previa a Canberra antes de cualquier participación de un tercer país en la seguridad o las infraestructuras sensibles'],
    carte: 'Mapa del Pacífico suroccidental que muestra los seis Estados insulares que han firmado un tratado de seguridad con Australia desde 2023: Tuvalu, Nauru, Papúa Nueva Guinea, Vanuatu, Fiyi y las Islas Salomón.',
    pays: { AUS: 'Australia', IDN: 'Indonesia', NCL: 'Nueva Caledonia', NZL: 'Nueva Zelanda' },
    mers: [['Mar', 'del Coral'], ['Océano', 'Pacífico'], ['Mar', 'de Tasmania']],
    canberra: 'Canberra',
    notes: {
      PNG: ['Papúa |Nueva Guinea', 'Tratado Pukpuk', 'octubre de 2025'],
      NRU: ['Nauru', 'Tratado Nauru-Australia', 'diciembre de 2024'],
      TUV: ['Tuvalu', 'Unión Falepili', 'noviembre de 2023'],
      SLB: ['Islas Salomón', 'Tratado Australia-Islas Salomón', '25 de noviembre de 2026'],
      VUT: ['Vanuatu', 'Acuerdo Nakamal', 'junio de 2026'],
      FJI: ['Fiyi', 'Alianza Ocean of Peace', 'julio de 2026']
    },
    km: 'km'
  },
  it: {
    titre: 'Trattati firmati dall’Australia con Stati insulari del Pacifico, dal 2023',
    chapo: 'Secondo l’impegno assunto dal paese partner in materia di difesa e di cooperazione di sicurezza con paesi terzi',
    source: 'Fonti: Lowy Institute, ministero degli Esteri australiano · Mappa: Il Grand Continent',
    cle: ['Alleanza di difesa reciproca', 'Assenso di Canberra necessario per ogni partenariato di sicurezza con un paese terzo', 'Consultazione preventiva di Canberra prima di ogni coinvolgimento di un paese terzo nella sicurezza o nelle infrastrutture sensibili'],
    carte: 'Mappa del Pacifico sud-occidentale che mostra i sei Stati insulari che hanno firmato un trattato di sicurezza con l’Australia dal 2023: Tuvalu, Nauru, Papua Nuova Guinea, Vanuatu, Figi e Isole Salomone.',
    pays: { AUS: 'Australia', IDN: 'Indonesia', NCL: 'Nuova Caledonia', NZL: 'Nuova Zelanda' },
    mers: [['Mar', 'dei Coralli'], ['Oceano', 'Pacifico'], ['Mar', 'di Tasman']],
    canberra: 'Canberra',
    notes: {
      PNG: ['Papua |Nuova Guinea', 'Trattato Pukpuk', 'ottobre 2025'],
      NRU: ['Nauru', 'Trattato Nauru-Australia', 'dicembre 2024'],
      TUV: ['Tuvalu', 'Unione Falepili', 'novembre 2023'],
      SLB: ['Isole Salomone', 'Trattato Australia-Isole Salomone', '25 novembre 2026'],
      VUT: ['Vanuatu', 'Accordo Nakamal', 'giugno 2026'],
      FJI: ['Figi', 'Alleanza Ocean of Peace', 'luglio 2026']
    },
    km: 'km'
  }
};
export const LANGUE = (import.meta.env.VITE_LANGUE || 'fr');
export const T = LANGUES[LANGUE];
