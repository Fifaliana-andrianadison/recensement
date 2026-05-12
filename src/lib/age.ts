export type AgeCategory =
  | "zaza"
  | "tanora"
  | "olondehibe"
  | "antitafita"

export function calculateAge(datyNaterahana: string): number {
  const [day, month, year] = datyNaterahana.split("/").map(Number)
  const birth = new Date(year, month - 1, day)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const mDiff = today.getMonth() - birth.getMonth()
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getAgeCategory(age: number): AgeCategory {
  if (age <= 12) return "zaza"
  if (age <= 25) return "tanora"
  if (age <= 59) return "olondehibe"
  return "antitafita"
}

export const ageCategoryLabels: Record<AgeCategory, string> = {
  zaza: "Zaza (0-12)",
  tanora: "Tanora (13-25)",
  olondehibe: "Olon-dehibe (26-59)",
  antitafita: "Anti-tafita (60+)",
}
