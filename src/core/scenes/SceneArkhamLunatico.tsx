/** Solo atmósfera — expedientes vía hotspots en puertas */
export default function SceneArkhamLunatico() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'rgba(5,5,5,0.2)' }} />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(60,0,0,0.1) 0%, transparent 60%)' }}
      />
    </div>
  )
}
