import { motion } from 'framer-motion'

/** Solo atmósfera — registros vía hotspot READ FILE en terminal */
export default function SceneArkhamIntensivo() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.18)' }} />
      <motion.div
        aria-hidden="true"
        className="absolute top-0 left-1/2"
        style={{
          width: '1px',
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(200,215,210,0.08) 0%, transparent 100%)',
          transform: 'translateX(-50%)',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  )
}
