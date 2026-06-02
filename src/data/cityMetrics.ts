export interface CityMetric {
  id: string
  label: string
  value: string
  numericValue: number
  suffix: string
  threat: 'critical' | 'high' | 'medium' | 'low'
  description: string
}

export const cityMetrics: CityMetric[] = [
  {
    id: 'crime-index',
    label: 'Crime Index',
    value: '87',
    numericValue: 87,
    suffix: '%',
    threat: 'critical',
    description: 'Overall criminal activity index across all districts',
  },
  {
    id: 'threat-level',
    label: 'Threat Level',
    value: 'HIGH',
    numericValue: 0,
    suffix: '',
    threat: 'high',
    description: 'Current city-wide threat assessment by GIN analysts',
  },
  {
    id: 'active-cases',
    label: 'Active Cases',
    value: '124',
    numericValue: 124,
    suffix: '',
    threat: 'high',
    description: 'Open investigations tracked by GCPD central command',
  },
  {
    id: 'surveillance',
    label: 'City Surveillance',
    value: '98',
    numericValue: 98,
    suffix: '%',
    threat: 'low',
    description: 'Coverage of active surveillance cameras city-wide',
  },
]
