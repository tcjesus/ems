const normalizeStr = (str: string | undefined): string => {
  if (!str) return ""

  let normalized = str.trim()
  normalized = normalized.toLocaleLowerCase()
  normalized = normalized.normalize("NFD")
  normalized = normalized.replace(/[\u0300-\u036f]/g, "")

  return normalized
}

export default normalizeStr