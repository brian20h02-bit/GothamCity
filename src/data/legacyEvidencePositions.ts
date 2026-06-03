/** Posiciones % ancladas a elementos visuales — ver sceneAnchors.ts */
export const legacyEvidencePositions: Record<string, { top: number; left: number; width?: number; height?: number }> = {
  // Crime Alley investigation — frente-crime-alley.png
  'broken-camera':       { top: 38, left: 12, width: 8, height: 10 },   // wall-mounted camera
  'witness-report':      { top: 62, left: 28, width: 8, height: 6 },      // alley debris / papers
  'rose-fragment':       { top: 78, left: 52, width: 6, height: 5 },      // pavement near drain
  'anonymous-letter':    { top: 48, left: 72, width: 7, height: 9 },      // mailbox / slot on building
  'arkham-patient-file': { top: 30, left: 10, width: 10, height: 8 },
  'arkham-blueprint':    { top: 54, left: 78, width: 8, height: 14 },
  'arkham-interview':    { top: 46, left: 50, width: 8, height: 16 },
  'arkham-chemical':     { top: 78, left: 14, width: 8, height: 6 },
  'arkham-escape-log':   { top: 82, left: 50, width: 12, height: 6 },
  'wayne-financial':     { top: 56, left: 36, width: 8, height: 6 },
  'wayne-contract':      { top: 58, left: 78, width: 8, height: 10 },
  'wayne-autopsy':       { top: 48, left: 20, width: 6, height: 8 },
  'wayne-photograph':    { top: 32, left: 38, width: 10, height: 8 },
}
