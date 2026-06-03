/** Solo atmósfera — evidencia vía hotspots anclados */
export default function SceneCrimeAlleyInvestigation() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3"
        style={{
          background: 'radial-gradient(ellipse at left center, rgba(139,0,0,0.12) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
