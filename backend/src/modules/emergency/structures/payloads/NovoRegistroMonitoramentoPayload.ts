class MedidaPayload {
  variable: string
  sensor: string
  value: number
  start_time: string
  end_time: string
}

export class NovoRegistroMonitoramentoPayload {
  device_id: number
  measures: MedidaPayload[]
}
