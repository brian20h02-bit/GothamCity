/** Clave activa de progreso (evidencias, clearance, trails) */
export const STORAGE_KEY = 'gotham-detective-v3'

const LEGACY_KEYS = [
  'gotham-detective-v1',
  'gotham-detective-v2',
  'gotham-investigation-v1',
] as const

/** Elimina saves obsoletos — no toca la clave activa */
export function purgeLegacyProgress(): void {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
  } catch { /* SSR / privacy mode */ }
}

/** Borra todo el progreso (desde consola: import o Ctrl+Shift+R tras reset) */
export function resetAllProgress(): void {
  try {
    for (const key of [...LEGACY_KEYS, STORAGE_KEY]) localStorage.removeItem(key)
  } catch { /* ignore */ }
}
