export interface InteractionHint {
  actionLine: string
  targetLine: string
}

export function buildNavigationHint(
  cursorAction: string,
  destinationName: string,
): InteractionHint {
  const actionLine = navigationActionLine(cursorAction)
  return { actionLine, targetLine: destinationName.toUpperCase() }
}

export function buildEvidenceHint(title: string, found = false): InteractionHint {
  return {
    actionLine: found ? 'EXAMINE' : 'VIEW EVIDENCE',
    targetLine: title.toUpperCase(),
  }
}

export function buildAnalyzeHint(label: string): InteractionHint {
  return {
    actionLine: 'ANALYZE',
    targetLine: label.toUpperCase(),
  }
}

export function buildReadFileHint(label: string): InteractionHint {
  return {
    actionLine: 'READ FILE',
    targetLine: label.toUpperCase(),
  }
}

export function buildTerminalHint(label = 'Batcomputer'): InteractionHint {
  return {
    actionLine: 'OPEN TERMINAL',
    targetLine: label.toUpperCase(),
  }
}

function navigationActionLine(action: string): string {
  switch (action) {
    case 'ENTER':          return 'ENTER LOCATION'
    case 'ACCESS':         return 'ACCESS AREA'
    case 'OPEN LOCATION':  return 'ACCESS AREA'
    case 'INVESTIGATE':    return 'ENTER LOCATION'
    case 'VIEW':           return 'VIEW ARCHIVE'
    default:               return 'ENTER LOCATION'
  }
}

export function dispatchInteractionEnter(hint: InteractionHint): void {
  window.dispatchEvent(new CustomEvent('hotspot-enter', { detail: hint }))
}

export function dispatchInteractionLeave(): void {
  window.dispatchEvent(new CustomEvent('hotspot-leave'))
}

export function parseInteractionHint(detail: unknown): InteractionHint | null {
  if (typeof detail === 'string') {
    return { actionLine: detail, targetLine: '' }
  }
  if (!detail || typeof detail !== 'object') return null
  const d = detail as Partial<InteractionHint>
  if (typeof d.actionLine === 'string' && typeof d.targetLine === 'string') {
    return { actionLine: d.actionLine, targetLine: d.targetLine }
  }
  return null
}
