export const getExternalCurrencies = async (): Promise<{
  currencies: {
    code: string;
    name: string;
  }[];
}> => {
  const res = await fetch("https://api.fxratesapi.com/currencies");

  if (!res.ok) {
    throw new Error("Failed to fetch currencies");
  }

  return await res.json();
};

export const getCurrencies = async (): Promise<{
  currencies: {
    code: string;
    name: string;
  }[];
}> => {
  const res = await fetch("/api/currency");

  if (!res.ok) {
    throw new Error("Failed to fetch currencies");
  }

  return await res.json();
};
