import { motion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Solo atmósfera — paneles vía BatcomputerPanelLayer; evidencia vía InteractionLayers */
export default function SceneBatcomputerControl() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.08)' }} aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,5,5,0.2) 100%)' }}
      />
      <motion.p
        className="absolute bottom-6 left-1/2 font-body pointer-events-none"
        style={{ transform: 'translateX(-50%)', fontSize: '6px', letterSpacing: '3px', color: 'rgba(100,200,140,0.2)', zIndex: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        SELECT A CONSOLE PANEL — OR ENABLE DETECTIVE MODE TO SCAN
      </motion.p>
    </div>
  )
}
