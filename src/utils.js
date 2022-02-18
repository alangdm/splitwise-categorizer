const REGEX = {
  date: /date|fecha/i,
  description: /description|descripción/i,
  category: /category|categoría/i,
  cost: /cost|coste/i,
  currency: /currency|moneda/i,
};

export const getColumnIndexes = (headers) => {
  const columns = {};
  for (const [key, regex] of Object.entries(REGEX)) {
    const index = headers.findIndex((h) => regex.test(h));
    columns[key] = index;
  }
  return columns;
};
