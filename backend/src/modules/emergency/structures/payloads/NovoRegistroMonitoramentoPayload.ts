class MedidaPayload {
  variable: string
  sensor: string
  value: number
  start_time: number
  end_time: number
}

export class NovoRegistroMonitoramentoPayload {
  device_id: number
  measures: MedidaPayload[]
}
