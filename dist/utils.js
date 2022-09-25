const COLUMN_REGEX = {
  date: /date|fecha/i,
  description: /description|descripción/i,
  category: /category|categoría/i,
  cost: /cost|coste/i,
  currency: /currency|moneda/i
};
const PAYMENT_METHODS = {
  tc: {
    en: "Credit Card"
  },
  ef: {
    en: "Cash"
  },
  id: {
    en: "ID"
  },
  lp: {
    en: "LINE Pay"
  },
  ic: {
    en: "Suica"
  },
  db: {
    en: "Bank Deposit"
  }
};
const DESCRIPTION_REGEX = new RegExp(`(?:(?<paymentMethod>${Object.keys(PAYMENT_METHODS).join("|")})\\.\\s*)?(?<description>.*)`, "i");
export const CATEGORIES = [// entertainment
{
  en: "Games",
  es: ""
}, {
  en: "Movies",
  es: ""
}, {
  en: "Music",
  es: ""
}, {
  en: "Entertainment - Other",
  es: ""
}, {
  en: "Sports",
  es: ""
}, // food and drink
{
  en: "Groceries",
  es: ""
}, {
  en: "Dining out",
  es: ""
}, {
  en: "Other",
  es: ""
}, {
  en: "Liquor",
  es: ""
}, // home
{
  en: "Rent",
  es: ""
}, {
  en: "Mortgage",
  es: ""
}, {
  en: "Household supplies",
  es: ""
}, {
  en: "Furniture",
  es: ""
}, {
  en: "Maintenance",
  es: ""
}, {
  en: "Home - Other",
  es: ""
}, {
  en: "Pets",
  es: ""
}, {
  en: "Services",
  es: ""
}, {
  en: "Electronics",
  es: ""
}, // life
{
  en: "Insurance",
  es: ""
}, {
  en: "Clothing",
  es: ""
}, {
  en: "Gifts",
  es: ""
}, {
  en: "Medical expenses",
  es: ""
}, {
  en: "Life - Other",
  es: ""
}, {
  en: "Taxes",
  es: ""
}, {
  en: "Education",
  es: ""
}, {
  en: "Childcare",
  es: ""
}, // transportation
{
  en: "Parking",
  es: ""
}, {
  en: "Car",
  es: ""
}, {
  en: "Bus/train",
  es: ""
}, {
  en: "Gas/fuel",
  es: ""
}, {
  en: "Transportation - Other",
  es: ""
}, {
  en: "Plane",
  es: ""
}, {
  en: "Taxi",
  es: ""
}, {
  en: "Bicycle",
  es: ""
}, {
  en: "Hotel",
  es: ""
}, // uncategorized
{
  en: "General",
  es: ""
}, // utilities
{
  en: "Electricity",
  es: ""
}, {
  en: "Heat/gas",
  es: ""
}, {
  en: "Water",
  es: ""
}, {
  en: "TV/Phone/Internet",
  es: ""
}, {
  en: "Other",
  es: ""
}, {
  en: "Trash",
  es: ""
}, {
  en: "Cleaning",
  es: ""
}];
CATEGORIES.sort((a, b) => {
  if (a.en < b.en) {
    return -1;
  } else if (a.en > b.en) {
    return 1;
  }

  return 0;
});
export const EXCLUDED_CATEGORIES = [{
  en: "Payment",
  es: ""
}];
export const getColumnIndexes = headers => {
  const columns = {};

  for (const [key, regex] of Object.entries(COLUMN_REGEX)) {
    const index = headers.findIndex(h => regex.test(h));
    columns[key] = index;
  }

  return columns;
};
export const parseDescription = rawText => {
  const {
    paymentMethod,
    description
  } = DESCRIPTION_REGEX.exec(rawText).groups;
  return {
    paymentMethod: paymentMethod?.toLowerCase(),
    description
  };
};
export const getPaymentMethodName = (method, lang = "en") => {
  return PAYMENT_METHODS[method]?.[lang];
};
export const normalizeCategoryName = category => {
  const cat = CATEGORIES.find(({
    en,
    es
  }) => category === en || category === es);
  return cat?.en ?? "";
};
export const isExcludedCategory = category => {
  const cat = EXCLUDED_CATEGORIES.find(({
    en,
    es
  }) => category === en || category === es);
  return !!cat;
};