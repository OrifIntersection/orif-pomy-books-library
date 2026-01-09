export function parseWhitelist() {
  const hosts = process.env.EMAIL_HOSTS.split(",");

  const hostWhitelist = hosts.map((h) => {
    if (h.startsWith(".*")) {
      const base = h.slice(2).replace(/\./g, "\\.");
      return new RegExp(`^[^.]+\\.${base}$`, "i");
    }
    return h;
  });

  return hostWhitelist;
}
