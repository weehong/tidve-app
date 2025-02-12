export const getExternalExchangeRates = async () => {
  const res = await fetch("https://api.fxratesapi.com/latest?base=USD");

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return await res.json();
};

export const getExternalCurrencies = async () => {
  const res = await fetch("https://api.fxratesapi.com/currencies");

  if (!res.ok) {
    throw new Error("Failed to fetch currencies");
  }

  return await res.json();
};

export const getExchangeRates = async () => {
  const res = await fetch("/api/exchange");

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return await res.json();
};

export const getCurrencies = async () => {
  const res = await fetch("/api/currency");

  if (!res.ok) {
    throw new Error("Failed to fetch currencies");
  }

  return await res.json();
};
