export function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function severityClass(severity) {
  return `badge ${severity?.toLowerCase() || "medium"}`;
}
