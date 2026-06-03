/** Estado de viento compartido — actualizado por BackgroundStormLayer */
export const atmosphericWind = {
  angle: 0.22,
  speedMult: 1,
  gust: 0,
}

export function updateAtmosphericWind(angle: number, speedMult: number, gust: number): void {
  atmosphericWind.angle = angle
  atmosphericWind.speedMult = speedMult
  atmosphericWind.gust = gust
}
