// {"device_id": 1, "measures":[{"variable": "temperatura", "sensor": "CM18-2008A", "value": 26, "start_time": 1716500084228, "end_time": 1716523428455 }]}
import { RegistroMonitoramentoBrutoModel } from '@/emergency/models/RegistroMonitoramentoBrutoModel'
import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { RegistroMonitoramentoBrutoRepository } from '@/emergency/repositories/RegistroMonitoramentoBrutoRepository'
import { RegistroMonitoramentoRepository } from '@/emergency/repositories/RegistroMonitoramentoRepository'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { NovoRegistroMonitoramentoPayload } from '@/emergency/structures/payloads/NovoRegistroMonitoramentoPayload'
import { Injectable } from '@nestjs/common'


@Injectable()
export class ProcessRegistroMonitoramentoUseCase {
  constructor(
    private readonly registroMonitoramentoBrutoRepository: RegistroMonitoramentoBrutoRepository,
    private readonly sensorRepository: SensorRepository,
    private readonly grandezaRepository: GrandezaRepository,
    private readonly udeRepository: UdeRepository,
    private readonly registroMonitoramentoRepository: RegistroMonitoramentoRepository,
  ) { }

  async execute(input: NovoRegistroMonitoramentoPayload): Promise<void> {
    const registrosBrutos = input.measures.map((medida) => new RegistroMonitoramentoBrutoModel({
      udeId: input.device_id,
      sensor: medida.sensor,
      grandeza: medida.variable,
      valor: medida.value,
      dataInicial: new Date(medida.start_time),
      dataFinal: new Date(medida.end_time)
    }))

    const createdRegistros = await this.registroMonitoramentoBrutoRepository.saveMany(registrosBrutos)
    this.processRegistrosBrutos(createdRegistros)
  }

  async processRegistrosBrutos(registrosBrutos: RegistroMonitoramentoBrutoModel[]): Promise<RegistroMonitoramentoModel[]> {
    console.log(`Processing pending raw records: ${registrosBrutos.length} records.`)

    const grandezas = await this.grandezaRepository.findAll()
    const grandezasMap = grandezas.reduce((acc, grandeza) => {
      acc[grandeza.nome.toLocaleLowerCase()] = grandeza
      return acc
    }, {})

    const sensores = await this.sensorRepository.findAll()
    const sensoresMap = sensores.reduce((acc, sensor) => {
      acc[sensor.modelo.toLocaleLowerCase()] = sensor
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
      const currentRegistros: RegistroMonitoramentoModel[] = []
      try {
        const ude = udesMap[registroBruto.udeId]
        let monitoramento
        for (const deteccao of ude.deteccoesEmergencia) {
          for (const m of deteccao.monitoramentosGrandeza) {
            if (m.sensor.modelo.toLowerCase() === registroBruto.sensor.toLowerCase()
              && m.grandeza.nome.toLowerCase() === registroBruto.grandeza.toLowerCase()) {
              monitoramento = m
              break
            }
          }
        }
        if (!monitoramento) {
          console.error(`Monitoring not found for raw record: ${registroBruto.id}`)
          continue
        }

        dataColeta = registroBruto.dataInicial
        while (dataColeta <= registroBruto.dataFinal) {
          currentRegistros.push(new RegistroMonitoramentoModel({
            registroBrutoId: registroBruto.id,
            udeId: registroBruto.udeId,
            sensorId: sensoresMap[registroBruto.sensor.toLocaleLowerCase()].id,
            grandezaId: grandezasMap[registroBruto.grandeza.toLocaleLowerCase()].id,
            valor: registroBruto.valor,
            dataColeta
          }))

          dataColeta = new Date(dataColeta.getTime() + monitoramento.intervaloAmostragem * 1000)
        }

        registros.push(...currentRegistros)
      } catch (error) {
        console.error(`Error processing raw record: ${registroBruto.id}`)
        console.error(error)
      }
    }

    console.log(`Total of processed records: ${registros.length} records.`)

    return this.registroMonitoramentoRepository.saveMany(registros)
  }
}
