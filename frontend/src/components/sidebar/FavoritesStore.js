export const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites") || "[]");

export const toggleFavorite = (path) => {
  const favs = getFavorites();
  const updated = favs.includes(path)
    ? favs.filter((f) => f !== path)
    : [...favs, path];

  localStorage.setItem("favorites", JSON.stringify(updated));
  return updated;
};
