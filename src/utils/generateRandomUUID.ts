export function generateRandomUUID(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  // Combine timestamp and random number using mathematical operations
  const combined = timestamp * random;

  // Convert to hex and ensure length
  const hex = combined.toString(16).padStart(32, '0');

  // Insert UUID format separators and version (4)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
