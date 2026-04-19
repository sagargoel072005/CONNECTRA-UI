//export const BASE_URL =location.hostname == "localhost:3000" ? "http://localhost:1507" : "/api";

export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:1507"
    : "api";