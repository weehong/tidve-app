export const getExternalExchangeRates = async (): Promise<{
  rates: {
    [key: string]: number;
  };
}> => {
  const res = await fetch("https://api.fxratesapi.com/latest?base=USD");

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return await res.json();
};

export const getExchangeRates = async (): Promise<{
  rates: {
    [key: string]: number;
  };
}> => {
  const res = await fetch("/api/exchange");

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return await res.json();
};
