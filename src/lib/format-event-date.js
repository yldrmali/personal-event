export const formatEventDate = (isoString, format = "full") => {
  const date = new Date(isoString);

  const options = {
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Europe/Istanbul",
    },
    short: {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Istanbul",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Istanbul",
    },
  };

  if (format === "time") {
    return date.toLocaleTimeString("tr-TR", options.time);
  }

  return date.toLocaleDateString("tr-TR", options[format] ?? options.full);
};
