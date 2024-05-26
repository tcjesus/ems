
class TemporalSummary {
  x: Date[]
  y: number[]
}

export class MonitoramentoSummaryResponse {
  [key: string]: TemporalSummary
}
