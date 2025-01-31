export const getProfile = async () => {
  const res = await fetch("/api/profile");

  if (!res.ok) {
    return null;
  }

  return res.json();
};

export const createProfile = async (currency: string) => {
  const res = await fetch("/api/profile", {
    method: "POST",
    body: JSON.stringify({
      isInitial: true,
      currency,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create profile");
  }

  return res.json();
};
