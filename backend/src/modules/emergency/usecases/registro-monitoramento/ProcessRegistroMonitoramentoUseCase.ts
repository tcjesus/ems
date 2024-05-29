// {"device_id": 1, "measures":[{"variable": "temperatura", "sensor": "CM18-2008A", "value": 26, "start_time": 1716500084228, "end_time": 1716523428455 }]}
import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { MonitoramentoRawDataRepository } from '@/emergency/repositories/MonitoramentoRawDataRepository'
import { RegistroMonitoramentoRepository } from '@/emergency/repositories/RegistroMonitoramentoRepository'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import normalizeStr from '@/utils/normalizeStr'
import { Injectable } from '@nestjs/common'


@Injectable()
export class ProcessRegistroMonitoramentoUseCase {
  constructor(
    private readonly registroMonitoramentoBrutoRepository: MonitoramentoRawDataRepository,
    private readonly sensorRepository: SensorRepository,
    private readonly grandezaRepository: GrandezaRepository,
    private readonly udeRepository: UdeRepository,
    private readonly registroMonitoramentoRepository: RegistroMonitoramentoRepository,
  ) { }

  async execute(input: NovoRegistroMonitoramentoPayload): Promise<void> {
    const registrosBrutos = input.measures.map((medida) => {
      return new MonitoramentoRawDataModel({
        udeId: input.device_id,
        sensor: medida.sensor,
        grandeza: medida.variable,
        valor: medida.value,
        dataInicial: new Date(medida.start_time),
        dataFinal: new Date(medida.end_time)
      })
    })

    console.log(`Receiving ${registrosBrutos.length} raw records.`)

    const createdRegistros = await this.registroMonitoramentoBrutoRepository.saveMany(registrosBrutos)
    this.processRegistrosBrutos(createdRegistros)
  }

  async processRegistrosBrutos(registrosBrutos: MonitoramentoRawDataModel[]): Promise<RegistroMonitoramentoModel[]> {
    console.log(`Processing pending raw records: ${registrosBrutos.length} records.`)

    const grandezas = await this.grandezaRepository.findAll()
    const grandezasMap = grandezas.reduce((acc, grandeza) => {
      acc[normalizeStr(grandeza.nome)] = grandeza
      return acc
    }, {})

    const sensores = await this.sensorRepository.findAll({ relations: [] })
    const sensoresMap = sensores.reduce((acc, sensor) => {
      acc[normalizeStr(sensor.modelo)] = sensor
      return acc
    }, {})

    const udesIds = new Set(registrosBrutos.map((registroBruto) => registroBruto.udeId))
    const udes = await this.udeRepository.findManyById(Array.from(udesIds))
    const udesMap = udes.reduce((acc, ude) => {
      acc[ude.id] = ude
      return acc
    }, {})

    const registros: RegistroMonitoramentoModel[] = []
    let dataColeta
    for (const registroBruto of registrosBrutos) {
      try {
        const ude = udesMap[registroBruto.udeId]
        let monitoramento
        for (const deteccao of ude.deteccoesEmergencia || []) {
          for (const m of deteccao.monitoramentosGrandeza) {
            if (normalizeStr(m.sensor.modelo) === normalizeStr(registroBruto.sensor)
              && normalizeStr(m.grandeza.nome) === normalizeStr(registroBruto.grandeza)) {
              monitoramento = m
              break
            }
          }
        }
        if (!monitoramento) {
          console.error(`Monitoring not found for raw record: ID ${registroBruto.id}`)
          continue
        }

        dataColeta = registroBruto.dataInicial
        while (dataColeta <= registroBruto.dataFinal) {
          registros.push(new RegistroMonitoramentoModel({
            rawDataId: registroBruto.id,
            udeId: registroBruto.udeId,
            sensorId: sensoresMap[normalizeStr(registroBruto.sensor)].id,
            grandezaId: grandezasMap[normalizeStr(registroBruto.grandeza)].id,
            valor: registroBruto.valor,
            dataColeta
          }))

          dataColeta = new Date(dataColeta.getTime() + monitoramento.intervaloAmostragem * 1000)
        }
      } catch (error) {
        console.error(`Error processing raw record: ${registroBruto.id}`)
        console.error(error)
      }
    }

    console.log(`Total of processed records: ${registros.length} records.`)

    return this.registroMonitoramentoRepository.saveMany(registros)
  }
}
