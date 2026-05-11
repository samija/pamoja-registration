export type Locale = "en" | "am";

export interface Dictionary {
  nav: {
    about: string;
    conferences: string;
    countries: string;
    register: string;
    directory: string;
  };
  hero: {
    subtitle: string;
    title1: string;
    title2: string;
    description: string;
    registerBtn: string;
    viewConferences: string;
  };
  registration: {
    title: string;
    selectConference: string;
    yourDetails: string;
    reviewAndPay: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    male: string;
    female: string;
    organization: string;
    role: string;
    city: string;
    continue: string;
    back: string;
    review: string;
    pay: string;
    total: string;
    conference: string;
    name: string;
    redirectMessage: string;
    groupRegistration: string;
    groupName: string;
    leaderName: string;
    leaderEmail: string;
    members: string;
    addMember: string;
    removeMember: string;
    registerGroup: string;
  };
  success: {
    title: string;
    message: string;
    reference: string;
    backTo: string;
  };
  common: {
    required: string;
    validEmail: string;
    loading: string;
  };
}

const en: Dictionary = {
  nav: {
    about: "About",
    conferences: "Conferences",
    countries: "Countries",
    register: "Register Now",
    directory: "Directory",
  },
  hero: {
    subtitle: "July 2028 · Addis Ababa",
    title1: "Arise, Shine.",
    title2: "Africa Together.",
    description: "5,000+ students, young professionals, and church leaders from across Africa gathering for worship, vision, and commissioning.",
    registerBtn: "Register Now",
    viewConferences: "View Conferences",
  },
  registration: {
    title: "Registration",
    selectConference: "Select Your Conference",
    yourDetails: "Your Details",
    reviewAndPay: "Review & Pay",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    gender: "Gender",
    male: "Male",
    female: "Female",
    organization: "Organization / Church",
    role: "Role / Title",
    city: "City",
    continue: "Continue",
    back: "Back",
    review: "Review",
    pay: "Pay",
    total: "Total",
    conference: "Conference",
    name: "Name",
    redirectMessage: "You will be redirected to complete your payment.",
    groupRegistration: "Group Registration",
    groupName: "Group / Delegation Name",
    leaderName: "Leader Name",
    leaderEmail: "Leader Email",
    members: "Members",
    addMember: "+ Add Member",
    removeMember: "Remove",
    registerGroup: "Register Group",
  },
  success: {
    title: "Registration Complete!",
    message: "Thank you for registering for Pamoja Africa V. You will receive a confirmation email shortly.",
    reference: "Reference",
    backTo: "Back to",
  },
  common: {
    required: "Required",
    validEmail: "Valid email required",
    loading: "Loading...",
  },
};

const am: Dictionary = {
  nav: {
    about: "ስለ እኛ",
    conferences: "ጉባኤዎች",
    countries: "ሀገራት",
    register: "ይመዝገቡ",
    directory: "ማውጫ",
  },
  hero: {
    subtitle: "ሐምሌ 2028 · አዲስ አበባ",
    title1: "ተነሺ፣ አብሪ።",
    title2: "አፍሪካ አብረን።",
    description: "ከ5,000 በላይ ተማሪዎች፣ ወጣት ባለሙያዎች እና የቤተክርስቲያን መሪዎች ከመላው አፍሪካ ለአምልኮ፣ ራዕይ እና ኮሚሽኒንግ ይሰበሰባሉ።",
    registerBtn: "አሁን ይመዝገቡ",
    viewConferences: "ጉባኤዎችን ይመልከቱ",
  },
  registration: {
    title: "ምዝገባ",
    selectConference: "ጉባኤዎን ይምረጡ",
    yourDetails: "የእርስዎ ዝርዝሮች",
    reviewAndPay: "ይገምግሙ እና ይክፈሉ",
    firstName: "ስም",
    lastName: "የአባት ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    gender: "ጾታ",
    male: "ወንድ",
    female: "ሴት",
    organization: "ድርጅት / ቤተክርስቲያን",
    role: "ሚና / ማዕረግ",
    city: "ከተማ",
    continue: "ቀጥል",
    back: "ተመለስ",
    review: "ይገምግሙ",
    pay: "ይክፈሉ",
    total: "ጠቅላላ",
    conference: "ጉባኤ",
    name: "ስም",
    redirectMessage: "ክፍያዎን ለማጠናቀቅ ይዛወራሉ።",
    groupRegistration: "የቡድን ምዝገባ",
    groupName: "የቡድን / የልዑካን ስም",
    leaderName: "የመሪ ስም",
    leaderEmail: "የመሪ ኢሜይል",
    members: "አባላት",
    addMember: "+ አባል ጨምር",
    removeMember: "አስወግድ",
    registerGroup: "ቡድን ይመዝግቡ",
  },
  success: {
    title: "ምዝገባ ተጠናቋል!",
    message: "ለፓሞጃ አፍሪካ V ስለተመዘገቡ እናመሰግናለን። በቅርቡ የማረጋገጫ ኢሜይል ይደርስዎታል።",
    reference: "ማጣቀሻ",
    backTo: "ተመለስ ወደ",
  },
  common: {
    required: "ያስፈልጋል",
    validEmail: "ትክክለኛ ኢሜይል ያስፈልጋል",
    loading: "በመጫን ላይ...",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, am };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}

export function getLocaleFromCountry(countrySlug: string): Locale {
  if (countrySlug === "ethiopia") return "am";
  return "en";
}
