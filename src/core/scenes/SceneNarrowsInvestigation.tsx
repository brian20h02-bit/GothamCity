/** Solo atmósfera — evidencia vía hotspots anclados (modo detective) */
export default function SceneNarrowsInvestigation() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2/5"
        style={{
          background: 'radial-gradient(ellipse at right center, rgba(139,0,0,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
