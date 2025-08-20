export function removeEmptyValues(data: Record<string, any>) {
  const entries = Object.entries(data);

  const values = entries.filter(([_, value]) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    if (value === null || value === undefined || value === 0) return false;
    // Keep numbers, booleans, objects, etc.
    return true;
  });
  return Object.fromEntries(values);
}
