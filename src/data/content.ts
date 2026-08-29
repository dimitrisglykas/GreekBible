import type { PassageRef } from "@/lib/bible";

export interface Topic {
  slug: string;
  emoji: string;
  title: string;
  intro: string;
  passages: PassageRef[];
}

/** TopicPassage relations live here, separate from any UI component. */
export const TOPICS: Topic[] = [
  {
    slug: "agapi",
    emoji: "❤️",
    title: "Αγάπη",
    intro:
      "Η Βίβλος δεν μιλάει για την αγάπη σαν συναίσθημα που έρχεται και φεύγει, αλλά σαν κάτι που δίνεται.",
    passages: [
      { book: "korinthious-a", chapter: 13, from: 1, to: 8 },
      { book: "ioannis", chapter: 15, from: 9, to: 17 },
      { book: "ioannou-a", chapter: 4, from: 7, to: 19 },
      { book: "romaious", chapter: 8, from: 35, to: 39 },
    ],
  },
  {
    slug: "thlipsi",
    emoji: "😔",
    title: "Θλίψη",
    intro: "Η λύπη δεν είναι έλλειψη πίστης. Η Γραφή αφήνει χώρο για δάκρυα και για παρηγοριά.",
    passages: [
      { book: "psalmoi", chapter: 34, from: 15, to: 19 },
      { book: "psalmoi", chapter: 147, from: 1, to: 6 },
      { book: "matthaios", chapter: 5, from: 1, to: 12 },
      { book: "apokalypsi", chapter: 21, from: 1, to: 5 },
    ],
  },
  {
    slug: "agchos",
    emoji: "😰",
    title: "Άγχος",
    intro: "Όταν το μυαλό δεν σταματά, η Βίβλος προτείνει κάτι απλό: πες τα στον Θεό.",
    passages: [
      { book: "filippisious", chapter: 4, from: 4, to: 9 },
      { book: "matthaios", chapter: 6, from: 25, to: 34 },
      { book: "petrou-a", chapter: 5, from: 6, to: 11 },
      { book: "psalmoi", chapter: 55, from: 16, to: 22 },
    ],
  },
  {
    slug: "fovos",
    emoji: "😨",
    title: "Φόβος",
    intro: "Η φράση «μη φοβάσαι» επαναλαμβάνεται ξανά και ξανά στη Γραφή. Δες γιατί.",
    passages: [
      { book: "isaias", chapter: 41, from: 8, to: 13 },
      { book: "psalmoi", chapter: 23 },
      { book: "iisous-navi", chapter: 1, from: 6, to: 9 },
      { book: "timotheon-b", chapter: 1, from: 7, to: 10 },
    ],
  },
  {
    slug: "elpida",
    emoji: "🌱",
    title: "Ελπίδα",
    intro: "Η ελπίδα της Βίβλου δεν είναι ευχή. Είναι εμπιστοσύνη σε Κάποιον.",
    passages: [
      { book: "romaious", chapter: 15, from: 4, to: 13 },
      { book: "ieremias", chapter: 29, from: 11, to: 14 },
      { book: "thrinoi", chapter: 3, from: 21, to: 26 },
      { book: "petrou-a", chapter: 1, from: 3, to: 9 },
    ],
  },
  {
    slug: "prosefchi",
    emoji: "🙏",
    title: "Προσευχή",
    intro: "Πώς μιλάς στον Θεό; Ο Ιησούς έδωσε ένα πολύ απλό παράδειγμα.",
    passages: [
      { book: "matthaios", chapter: 6, from: 5, to: 15 },
      { book: "loukas", chapter: 11, from: 1, to: 13 },
      { book: "psalmoi", chapter: 62, from: 5, to: 8 },
      { book: "iakovos", chapter: 5, from: 13, to: 16 },
    ],
  },
  {
    slug: "sygchoresi",
    emoji: "🤍",
    title: "Συγχώρεση",
    intro: "Για όσους δυσκολεύονται να συγχωρήσουν — και για όσους δυσκολεύονται να πιστέψουν ότι συγχωρέθηκαν.",
    passages: [
      { book: "loukas", chapter: 15, from: 11, to: 24 },
      { book: "matthaios", chapter: 18, from: 21, to: 35 },
      { book: "psalmoi", chapter: 103, from: 8, to: 14 },
      { book: "ioannou-a", chapter: 1, from: 5, to: 9 },
    ],
  },
  {
    slug: "eirini",
    emoji: "🕊️",
    title: "Ειρήνη",
    intro: "Μια ηρεμία που δεν εξαρτάται από το πόσο ήσυχη είναι η ζωή σου.",
    passages: [
      { book: "ioannis", chapter: 14, from: 25, to: 31 },
      { book: "isaias", chapter: 26, from: 1, to: 4 },
      { book: "psalmoi", chapter: 4, from: 4, to: 8 },
      { book: "kolossaeis", chapter: 3, from: 12, to: 17 },
    ],
  },
  {
    slug: "dynami",
    emoji: "💪",
    title: "Δύναμη",
    intro: "Όταν δεν αντέχεις άλλο, η Γραφή δεν σου λέει «προσπάθησε περισσότερο».",
    passages: [
      { book: "isaias", chapter: 40, from: 27, to: 31 },
      { book: "filippisious", chapter: 4, from: 10, to: 13 },
      { book: "korinthious-b", chapter: 12, from: 7, to: 10 },
      { book: "psalmoi", chapter: 46, from: 1, to: 7 },
    ],
  },
  {
    slug: "amfivolia",
    emoji: "❓",
    title: "Αμφιβολία",
    intro: "Οι ερωτήσεις δεν είναι εχθρός της πίστης. Η Βίβλος είναι γεμάτη ανθρώπους που ρώτησαν.",
    passages: [
      { book: "ioannis", chapter: 20, from: 24, to: 31 },
      { book: "markos", chapter: 9, from: 14, to: 27 },
      { book: "psalmoi", chapter: 13 },
      { book: "ioudas", chapter: 1, from: 20, to: 23 },
    ],
  },
  {
    slug: "skopos",
    emoji: "🌎",
    title: "Σκοπός",
    intro: "«Γιατί υπάρχω;» — μια από τις πιο ανθρώπινες ερωτήσεις.",
    passages: [
      { book: "efesious", chapter: 2, from: 4, to: 10 },
      { book: "psalmoi", chapter: 139, from: 13, to: 18 },
      { book: "matthaios", chapter: 22, from: 34, to: 40 },
      { book: "ekklisiastis", chapter: 3, from: 1, to: 14 },
    ],
  },
  {
    slug: "scheseis",
    emoji: "👥",
    title: "Σχέσεις",
    intro: "Φιλίες, οικογένεια, συγκρούσεις — η Γραφή μιλάει πιο πρακτικά απ' όσο νομίζεις.",
    passages: [
      { book: "paroimies", chapter: 17, from: 9, to: 17 },
      { book: "romaious", chapter: 12, from: 9, to: 21 },
      { book: "efesious", chapter: 4, from: 25, to: 32 },
      { book: "ekklisiastis", chapter: 4, from: 9, to: 12 },
    ],
  },
  {
    slug: "pisti",
    emoji: "✨",
    title: "Πίστη",
    intro: "Τι σημαίνει τελικά «πιστεύω»; Δεν είναι να κλείνεις τα μάτια.",
    passages: [
      { book: "evraious", chapter: 11, from: 1, to: 12 },
      { book: "ioannis", chapter: 3, from: 14, to: 21 },
      { book: "iakovos", chapter: 2, from: 14, to: 20 },
      { book: "romaious", chapter: 10, from: 8, to: 13 },
    ],
  },
  {
    slug: "kathodigisi",
    emoji: "🧭",
    title: "Καθοδήγηση",
    intro: "Όταν πρέπει να πάρεις μια απόφαση και δεν ξέρεις τι είναι σωστό.",
    passages: [
      { book: "paroimies", chapter: 3, from: 1, to: 12 },
      { book: "psalmoi", chapter: 32, from: 6, to: 11 },
      { book: "psalmoi", chapter: 119, from: 97, to: 112 },
      { book: "iakovos", chapter: 1, from: 2, to: 8 },
    ],
  },
];

export interface JesusSection {
  slug: string;
  title: string;
  question: string;
  body: string[];
  passages: PassageRef[];
}

export const JESUS_SECTIONS: JesusSection[] = [
  {
    slug: "poios-einai",
    title: "Ποιος είναι ο Ιησούς;",
    question: "Ένας δάσκαλος; Ένας προφήτης; Κάτι παραπάνω;",
    body: [
      "Ο Ιησούς από τη Ναζαρέτ έζησε πριν από περίπου δύο χιλιάδες χρόνια στην περιοχή της σημερινής Παλαιστίνης και του Ισραήλ. Οι πρώτοι που τον γνώρισαν τον περιέγραψαν με έναν τρόπο που τότε ακουγόταν σοκαριστικός: είπαν ότι μέσα από αυτόν ο ίδιος ο Θεός ήρθε κοντά στους ανθρώπους.",
      "Τα Ευαγγέλια — τέσσερα βιβλία της Καινής Διαθήκης — είναι οι βασικές αφηγήσεις για τη ζωή του. Δεν είναι θεωρητικά κείμενα· είναι κυρίως ιστορίες: συναντήσεις, συζητήσεις, γεύματα, θεραπείες.",
    ],
    passages: [
      { book: "ioannis", chapter: 1, from: 1, to: 18 },
      { book: "kolossaeis", chapter: 1, from: 15, to: 20 },
    ],
  },
  {
    slug: "i-zoi-tou",
    title: "Η ζωή Του",
    question: "Πώς έζησε στην πραγματικότητα;",
    body: [
      "Γεννήθηκε φτωχός, δούλεψε ως ξυλουργός και ξεκίνησε να διδάσκει γύρω στα τριάντα του. Περπάτησε από χωριό σε χωριό, χωρίς σπίτι και χωρίς εξουσία, και επέλεξε για φίλους του ψαράδες, εφοριακούς και ανθρώπους που οι άλλοι απέφευγαν.",
    ],
    passages: [
      { book: "loukas", chapter: 2, from: 1, to: 20 },
      { book: "loukas", chapter: 4, from: 14, to: 30 },
    ],
  },
  {
    slug: "ta-logia-tou",
    title: "Τα λόγια Του",
    question: "Τι δίδαξε;",
    body: [
      "Η πιο γνωστή ομιλία του, η «Επί του Όρους Ομιλία», αναποδογυρίζει τα πάντα: μακάριοι οι φτωχοί, οι πενθούντες, οι ειρηνοποιοί. Μιλάει για την καρδιά περισσότερο από τους κανόνες.",
    ],
    passages: [
      { book: "matthaios", chapter: 5, from: 1, to: 16 },
      { book: "matthaios", chapter: 7, from: 7, to: 14 },
    ],
  },
  {
    slug: "oi-paravoles-tou",
    title: "Οι παραβολές Του",
    question: "Γιατί έλεγε ιστορίες;",
    body: [
      "Οι παραβολές είναι μικρές ιστορίες από την καθημερινή ζωή — ένα χαμένο πρόβατο, ένας πατέρας που περιμένει, ένας ξένος που σταματά να βοηθήσει. Είναι απλές στην επιφάνεια και ανοίγουν σιγά σιγά.",
    ],
    passages: [
      { book: "loukas", chapter: 15, from: 1, to: 32 },
      { book: "loukas", chapter: 10, from: 25, to: 37 },
    ],
  },
  {
    slug: "ta-thavmata-tou",
    title: "Τα θαύματά Του",
    question: "Τι σήμαιναν;",
    body: [
      "Στα Ευαγγέλια τα θαύματα δεν είναι εντυπωσιασμός. Είναι σημάδια: κάθε φορά που κάποιος θεραπεύεται ή χορταίνει, φαίνεται πώς θα ήταν ο κόσμος αν ο Θεός βασίλευε πραγματικά σε αυτόν.",
    ],
    passages: [
      { book: "markos", chapter: 2, from: 1, to: 12 },
      { book: "ioannis", chapter: 6, from: 1, to: 15 },
    ],
  },
  {
    slug: "o-stavros",
    title: "Ο Σταυρός",
    question: "Γιατί πέθανε;",
    body: [
      "Ο Ιησούς εκτελέστηκε δημόσια, με τον πιο σκληρό τρόπο της εποχής. Οι χριστιανοί πιστεύουν ότι δεν ήταν απλώς μια αδικία που συνέβη, αλλά μια αγάπη που επιλέχθηκε: πήρε πάνω του ό,τι μας χωρίζει από τον Θεό.",
    ],
    passages: [
      { book: "ioannis", chapter: 19, from: 16, to: 30 },
      { book: "isaias", chapter: 53, from: 1, to: 12 },
    ],
  },
  {
    slug: "i-anastasi",
    title: "Η Ανάσταση",
    question: "Τι άλλαξε την τρίτη μέρα;",
    body: [
      "Οι μαθητές του είχαν διαλυθεί. Λίγες μέρες μετά ισχυρίζονταν ότι τον είδαν ζωντανό — και το είπαν με κόστος τη ζωή τους. Η Ανάσταση είναι ο λόγος που υπάρχει χριστιανισμός.",
    ],
    passages: [
      { book: "loukas", chapter: 24, from: 1, to: 35 },
      { book: "korinthious-a", chapter: 15, from: 3, to: 22 },
    ],
  },
  {
    slug: "giati-simera",
    title: "Γιατί έχει σημασία ο Ιησούς σήμερα;",
    question: "Τι σχέση έχει με τη ζωή μου τώρα;",
    body: [
      "Επειδή οι ερωτήσεις που άγγιξε — ποιος είμαι, τι αξίζω, τι κάνω με τις ενοχές μου, τι γίνεται μετά τον θάνατο — δεν άλλαξαν. Δεν χρειάζεται να έχεις αποφασίσει τίποτα για να διαβάσεις τα λόγια του.",
    ],
    passages: [
      { book: "matthaios", chapter: 11, from: 25, to: 30 },
      { book: "ioannis", chapter: 10, from: 7, to: 18 },
    ],
  },
];

export interface PlanDay {
  day: number;
  title: string;
  minutes: number;
  passages: PassageRef[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  subtitle: string;
  days: PlanDay[];
}

const p = (book: string, chapter: number, from?: number, to?: number): PassageRef => ({
  book,
  chapter,
  ...(from === undefined ? {} : { from }),
  ...(to === undefined ? {} : { to }),
});

function buildPlan(
  id: string,
  title: string,
  subtitle: string,
  entries: [string, PassageRef[], number?][],
): ReadingPlan {
  return {
    id,
    title,
    subtitle,
    days: entries.map(([dayTitle, passages, minutes], i) => ({
      day: i + 1,
      title: dayTitle,
      minutes: minutes ?? 5,
      passages,
    })),
  };
}

export const PLANS: ReadingPlan[] = [
  buildPlan(
    "gnorise-ton-iisou-30",
    "Γνώρισε τον Ιησού σε 30 ημέρες",
    "Μια ήρεμη διαδρομή μέσα από τα Ευαγγέλια, από την αρχή μέχρι την Ανάσταση.",
    [
      ["Η αρχή των πάντων", [p("ioannis", 1, 1, 18)]],
      ["Η γέννηση", [p("loukas", 2, 1, 20)]],
      ["Το πρώτο κάλεσμα", [p("markos", 1, 14, 34)]],
      ["Οι μακαρισμοί", [p("matthaios", 5, 1, 16)]],
      ["Καρδιά, όχι κανόνες", [p("matthaios", 5, 17, 30)]],
      ["Αγάπα και τον εχθρό σου", [p("matthaios", 5, 38, 48)]],
      ["Πώς να προσεύχεσαι", [p("matthaios", 6, 5, 18)]],
      ["Μην αγχώνεσαι", [p("matthaios", 6, 25, 34)]],
      ["Ζήτα και θα σου δοθεί", [p("matthaios", 7, 7, 20)]],
      ["Το πρώτο θαύμα", [p("ioannis", 2, 1, 11)]],
      ["Νύχτα με τον Νικόδημο", [p("ioannis", 3, 1, 21)]],
      ["Η γυναίκα στο πηγάδι", [p("ioannis", 4, 1, 26)]],
      ["Ο παράλυτος", [p("markos", 2, 1, 12)]],
      ["Ο σπορέας", [p("markos", 4, 1, 20)]],
      ["Η καταιγίδα", [p("markos", 4, 35, 41)]],
      ["Χορταίνει τους πέντε χιλιάδες", [p("ioannis", 6, 1, 15)]],
      ["Εγώ είμαι ο άρτος", [p("ioannis", 6, 32, 40)]],
      ["Ο καλός Σαμαρείτης", [p("loukas", 10, 25, 37)]],
      ["Μάρθα και Μαρία", [p("loukas", 10, 38, 42)]],
      ["Ο χαμένος γιος", [p("loukas", 15, 11, 32)]],
      ["Ο καλός ποιμένας", [p("ioannis", 10, 1, 18)]],
      ["Ο Λάζαρος", [p("ioannis", 11, 17, 44)]],
      ["Το μεγαλύτερο εντολή", [p("matthaios", 22, 34, 46)]],
      ["Ο τελευταίος δείπνος", [p("loukas", 22, 7, 23)]],
      ["Μια νέα εντολή", [p("ioannis", 13, 1, 17)]],
      ["Μη ταράσσεσθε", [p("ioannis", 14, 1, 27)]],
      ["Η προσευχή στη Γεθσημανή", [p("loukas", 22, 39, 53)]],
      ["Ο Σταυρός", [p("ioannis", 19, 16, 30)]],
      ["Το άδειο μνήμα", [p("loukas", 24, 1, 12)]],
      ["Ο δρόμος προς Εμμαούς", [p("loukas", 24, 13, 35), p("ioannis", 20, 24, 31)]],
    ],
  ),
  buildPlan("7-imeres-elpidas", "7 ημέρες ελπίδας", "Όταν χρειάζεσαι έναν λόγο να συνεχίσεις.", [
    ["Καινούργια κάθε πρωί", [p("thrinoi", 3, 21, 26)]],
    ["Σχέδια ειρήνης", [p("ieremias", 29, 10, 14)]],
    ["Δύναμη σε όσους ελπίζουν", [p("isaias", 40, 27, 31)]],
    ["Τίποτα δεν μας χωρίζει", [p("romaious", 8, 31, 39)]],
    ["Μια ζωντανή ελπίδα", [p("petrou-a", 1, 3, 9)]],
    ["Ο Θεός των πάντων", [p("psalmoi", 121)]],
    ["Όλα καινούργια", [p("apokalypsi", 21, 1, 7)]],
  ]),
  buildPlan("7-imeres-prosefchis", "7 ημέρες προσευχής", "Μάθε να μιλάς στον Θεό, απλά.", [
    ["Η προσευχή του Ιησού", [p("matthaios", 6, 5, 15)]],
    ["Ζήτα με επιμονή", [p("loukas", 11, 1, 13)]],
    ["Άδειασε την καρδιά σου", [p("psalmoi", 62, 1, 8)]],
    ["Ευχαριστία αντί άγχους", [p("filippisious", 4, 4, 9)]],
    ["Όταν δεν ξέρεις τι να πεις", [p("romaious", 8, 22, 28)]],
    ["Προσευχή μαζί με άλλους", [p("iakovos", 5, 13, 18)]],
    ["Μια προσευχή εμπιστοσύνης", [p("psalmoi", 23)]],
  ]),
  buildPlan("7-imeres-eirinis", "7 ημέρες ειρήνης", "Για μυαλά που δεν σταματούν.", [
    ["Ελάτε σε μένα", [p("matthaios", 11, 25, 30)]],
    ["Ειρήνη αφήνω σε σας", [p("ioannis", 14, 25, 31)]],
    ["Ο Κύριος είναι ο ποιμένας μου", [p("psalmoi", 23)]],
    ["Ησυχάστε", [p("psalmoi", 46)]],
    ["Τέλεια ειρήνη", [p("isaias", 26, 1, 9)]],
    ["Ειρήνη στις σχέσεις", [p("kolossaeis", 3, 12, 17)]],
    ["Κοιμήσου ήσυχα", [p("psalmoi", 4)]],
  ]),
  buildPlan("14-imeres-pistis", "14 ημέρες πίστης", "Τι σημαίνει να εμπιστεύεσαι τον Θεό.", [
    ["Τι είναι η πίστη", [p("evraious", 11, 1, 12)]],
    ["Ο Αβραάμ ξεκινά", [p("genesis", 12, 1, 9)]],
    ["Μη φοβάσαι", [p("isaias", 41, 8, 13)]],
    ["Πίστη σαν κόκκος", [p("matthaios", 17, 14, 21)]],
    ["Βοήθα την απιστία μου", [p("markos", 9, 14, 29)]],
    ["Περπατώντας στο νερό", [p("matthaios", 14, 22, 33)]],
    ["Πίστη και έργα", [p("iakovos", 2, 14, 26)]],
    ["Δικαιωμένοι διά πίστεως", [p("romaious", 5, 1, 11)]],
    ["Ο Θωμάς ρωτά", [p("ioannis", 20, 24, 31)]],
    ["Δεν βλέπουμε ακόμα", [p("korinthious-b", 4, 16, 18)]],
    ["Η πίστη δοκιμάζεται", [p("iakovos", 1, 2, 12)]],
    ["Το θεμέλιο", [p("matthaios", 7, 24, 29)]],
    ["Πίστη και αγάπη", [p("galatas", 5, 1, 6)]],
    ["Τρέχοντας τον αγώνα", [p("evraious", 12, 1, 3)]],
  ]),
  buildPlan("otan-pernas-dyskola", "Όταν περνάς δύσκολα", "Επτά μέρες για δύσκολες περιόδους.", [
    ["Κοντά στους συντετριμμένους", [p("psalmoi", 34, 15, 22)]],
    ["Μέχρι πότε;", [p("psalmoi", 13)]],
    ["Ρίξε το βάρος σου", [p("petrou-a", 5, 6, 11)]],
    ["Παρηγοριά που μοιράζεται", [p("korinthious-b", 1, 3, 11)]],
    ["Ο Ιησούς κλαίει", [p("ioannis", 11, 28, 44)]],
    ["Κουρασμένοι και φορτωμένοι", [p("matthaios", 11, 28, 30)]],
    ["Θα σκουπίσει κάθε δάκρυ", [p("apokalypsi", 21, 1, 7)]],
  ]),
];

export interface StartOption {
  emoji: string;
  label: string;
  answer: string;
  passages: PassageRef[];
  planId?: string;
  topicSlug?: string;
}

export const START_OPTIONS: StartOption[] = [
  {
    emoji: "❤️",
    label: "Θέλω να γνωρίσω τον Ιησού",
    answer: "Ξεκίνα από το Ευαγγέλιο του Ιωάννη — γράφτηκε ακριβώς για αυτόν τον λόγο.",
    passages: [{ book: "ioannis", chapter: 1, from: 1, to: 18 }],
    planId: "gnorise-ton-iisou-30",
  },
  {
    emoji: "📖",
    label: "Θέλω να ξεκινήσω τη Βίβλο",
    answer:
      "Δεν χρειάζεται να ξεκινήσεις από την αρχή. Τα Ευαγγέλια είναι το πιο φυσικό σημείο εκκίνησης.",
    passages: [{ book: "markos", chapter: 1, from: 1, to: 20 }],
    planId: "gnorise-ton-iisou-30",
  },
  {
    emoji: "🙏",
    label: "Θέλω να μάθω να προσεύχομαι",
    answer: "Ο Ιησούς έδειξε στους μαθητές του κάτι σύντομο και ανθρώπινο.",
    passages: [{ book: "matthaios", chapter: 6, from: 5, to: 15 }],
    planId: "7-imeres-prosefchis",
    topicSlug: "prosefchi",
  },
  {
    emoji: "😔",
    label: "Περνάω μια δύσκολη περίοδο",
    answer: "Δεν είσαι μόνος. Η Βίβλος δεν αποφεύγει τον πόνο.",
    passages: [{ book: "psalmoi", chapter: 34, from: 15, to: 22 }],
    planId: "otan-pernas-dyskola",
    topicSlug: "thlipsi",
  },
  {
    emoji: "❓",
    label: "Έχω ερωτήσεις για τον Θεό",
    answer: "Οι ερωτήσεις είναι ευπρόσδεκτες. Δες πώς ο Ιησούς μίλησε σε κάποιον που ρωτούσε τη νύχτα.",
    passages: [{ book: "ioannis", chapter: 3, from: 1, to: 21 }],
    topicSlug: "amfivolia",
  },
  {
    emoji: "🌱",
    label: "Θέλω να βρω ελπίδα",
    answer: "Επτά μέρες, λίγα λεπτά την ημέρα.",
    passages: [{ book: "thrinoi", chapter: 3, from: 21, to: 26 }],
    planId: "7-imeres-elpidas",
    topicSlug: "elpida",
  },
  {
    emoji: "🔎",
    label: "Θέλω να καταλάβω τον Χριστιανισμό",
    answer: "Ξεκίνα από το ποιος είναι ο Ιησούς — όλα τα υπόλοιπα ξεκινούν από εκεί.",
    passages: [{ book: "ioannis", chapter: 1, from: 1, to: 18 }],
  },
];

export interface DailyVerseEntry {
  ref: PassageRef;
  reflection: string;
  thought: string;
}

/** DailyVerse rotation — deterministic per calendar day. */
export const DAILY_VERSES: DailyVerseEntry[] = [
  {
    ref: { book: "ioannis", chapter: 3, from: 16, to: 16 },
    reflection: "Η πιο γνωστή πρόταση της Βίβλου ξεκινά με μια λέξη: αγάπησε.",
    thought: "Σήμερα δεν χρειάζεται να κερδίσεις τίποτα. Δοκίμασε να ξεκινήσεις τη μέρα από εκεί.",
  },
  {
    ref: { book: "psalmoi", chapter: 23, from: 1, to: 3 },
    reflection: "Ένας βοσκός δεν σπρώχνει το κοπάδι. Προχωράει μπροστά και το φωνάζει.",
    thought: "Αν σήμερα νιώθεις κουρασμένος, ίσως δεν χρειάζεσαι περισσότερη πίεση — αλλά ξεκούραση.",
  },
  {
    ref: { book: "filippisious", chapter: 4, from: 6, to: 7 },
    reflection: "Δεν λέει «μην ανησυχείς». Λέει «πες το».",
    thought: "Γράψε κάπου ένα πράγμα που σε απασχολεί και πες το στον Θεό με δικά σου λόγια.",
  },
  {
    ref: { book: "matthaios", chapter: 11, from: 28, to: 30 },
    reflection: "Μια πρόσκληση, όχι μια απαίτηση.",
    thought: "Τι θα άλλαζε στη μέρα σου αν πίστευες ότι κάποιος κρατάει μαζί σου το βάρος;",
  },
  {
    ref: { book: "thrinoi", chapter: 3, from: 22, to: 23 },
    reflection: "Γραμμένο μέσα στα ερείπια μιας πόλης. Και όμως μιλάει για πρωινό.",
    thought: "Χθες δεν καθορίζει το σήμερα.",
  },
  {
    ref: { book: "isaias", chapter: 41, from: 10, to: 10 },
    reflection: "Η πιο επαναλαμβανόμενη εντολή στη Βίβλο είναι «μη φοβάσαι».",
    thought: "Ονόμασε τον φόβο σου. Συχνά μικραίνει μόλις ειπωθεί.",
  },
  {
    ref: { book: "romaious", chapter: 8, from: 38, to: 39 },
    reflection: "Μια λίστα από όλα όσα φοβόμαστε — και μετά μια λέξη: τίποτα.",
    thought: "Η αγάπη του Θεού δεν είναι ανταμοιβή για καλή συμπεριφορά.",
  },
];

export function dailyIndex(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 86400000);
  return day % DAILY_VERSES.length;
}
