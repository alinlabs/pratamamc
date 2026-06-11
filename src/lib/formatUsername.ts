export function formatUsername(username?: string): string {
  if (!username) return "Klien";
  
  return username.split(/[-_&]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' & ');
}
