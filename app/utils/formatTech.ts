export function formatTechWithVersion(techVersions: Record<string, string> | undefined, techName: string): string {
  if (!techName) return ''
  const version = techVersions?.[techName]
  return version ? `${techName} v${version}` : `${techName} (Latest)`
}
