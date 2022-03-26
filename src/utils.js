const COLUMN_REGEX = {
  date: /date|fecha/i,
  description: /description|descripción/i,
  category: /category|categoría/i,
  cost: /cost|coste/i,
  currency: /currency|moneda/i,
};

const PAYMENT_METHODS = {
  tc: {
    en: "Credit Card",
  },
  ef: {
    en: "Cash",
  },
  id: {
    en: "ID",
  },
  lp: {
    en: "LINE Pay",
  },
  ic: {
    en: "Suica",
  },
  db: {
    en: "Bank Deposit",
  },
};

const DESCRIPTION_REGEX = new RegExp(
  `(?:(?<paymentMethod>${Object.keys(PAYMENT_METHODS).join(
    "|"
  )})\\.\\s*)?(?<description>.*)`,
  "i"
);

export const getColumnIndexes = (headers) => {
  const columns = {};
  for (const [key, regex] of Object.entries(COLUMN_REGEX)) {
    const index = headers.findIndex((h) => regex.test(h));
    columns[key] = index;
  }
  return columns;
};

export const parseDescription = (rawText) => {
  const { paymentMethod, description } = DESCRIPTION_REGEX.exec(rawText).groups;
  return { paymentMethod: paymentMethod?.toLowerCase(), description };
};
