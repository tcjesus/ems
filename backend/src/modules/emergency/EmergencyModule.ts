import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GrandezaController } from '@/emergency/controllers/GrandezaController'
import { MonitoramentoController } from '@/emergency/controllers/MonitoramentoController'
import { SensorController } from '@/emergency/controllers/SensorController'
import { TipoEmergenciaController } from '@/emergency/controllers/TipoEmergenciaController'
import { UdeController } from '@/emergency/controllers/UdeController'
import { ZonaController } from '@/emergency/controllers/ZonaController'
import { DeteccaoEmergenciaModel } from '@/emergency/models/DeteccaoEmergenciaModel'
import { EspecificacaoGrandezaModel } from '@/emergency/models/EspecificacaoGrandezaModel'
import { GrandezaModel } from '@/emergency/models/GrandezaModel'
import { MonitoramentoGrandezaModel } from '@/emergency/models/MonitoramentoGrandezaModel'
import { MonitoramentoRawDataModel } from '@/emergency/models/MonitoramentoRawDataModel'
import { RegistroMonitoramentoModel } from '@/emergency/models/RegistroMonitoramentoModel'
import { SensorModel } from '@/emergency/models/SensorModel'
import { TipoEmergenciaModel } from '@/emergency/models/TipoEmergenciaModel'
import { UdeModel } from '@/emergency/models/UdeModel'
import { ZonaModel } from '@/emergency/models/ZonaModel'
import { GrandezaRepository } from '@/emergency/repositories/GrandezaRepository'
import { MonitoramentoRawDataRepository } from '@/emergency/repositories/MonitoramentoRawDataRepository'
import { RegistroMonitoramentoRepository } from '@/emergency/repositories/RegistroMonitoramentoRepository'
import { SensorRepository } from '@/emergency/repositories/SensorRepository'
import { TipoEmergenciaRepository } from '@/emergency/repositories/TipoEmergenciaRepository'
import { UdeRepository } from '@/emergency/repositories/UdeRepository'
import { ZonaRepository } from '@/emergency/repositories/ZonaRepository '
import { GrandezaFacade } from '@/emergency/services/GrandezaFacade'
import { MonitoramentoFacade } from '@/emergency/services/MonitoramentoFacade'
import { SensorFacade } from '@/emergency/services/SensorFacade'
import { TipoEmergenciaFacade } from '@/emergency/services/TipoEmergenciaFacade'
import { UdeFacade } from '@/emergency/services/UdeFacade'
import { ZonaFacade } from '@/emergency/services/ZonaFacade'
import { CreateGrandezaUseCase } from '@/emergency/usecases/grandeza/CreateGrandezaUseCase'
import { DeleteGrandezaUseCase } from '@/emergency/usecases/grandeza/DeleteGrandezaUseCase'
import { FindGrandezaByIdUseCase } from '@/emergency/usecases/grandeza/FindGrandezaByIdUseCase'
import { ListGrandezasUseCase } from '@/emergency/usecases/grandeza/ListGrandezasUseCase'
import { UpdateGrandezaUseCase } from '@/emergency/usecases/grandeza/UpdateGrandezaUseCase'
import { GetMonitoramentoSummaryUseCase } from '@/emergency/usecases/registro-monitoramento/GetMonitoramentoSummaryUseCase'
import { ListMonitoramentoRawDataUseCase } from '@/emergency/usecases/registro-monitoramento/ListMonitoramentoRawDataUseCase'
import { ProcessRegistroMonitoramentoUseCase } from '@/emergency/usecases/registro-monitoramento/ProcessRegistroMonitoramentoUseCase'
import { RequestMonitoramentoDataUseCase } from '@/emergency/usecases/registro-monitoramento/RequestMonitoramentoDataUseCase'
import { CreateSensorUseCase } from '@/emergency/usecases/sensor/CreateSensorUseCase'
import { DeleteSensorUseCase } from '@/emergency/usecases/sensor/DeleteSensorUseCase'
import { FindSensorByIdUseCase } from '@/emergency/usecases/sensor/FindSensorByIdUseCase'
import { ListSensoresUseCase } from '@/emergency/usecases/sensor/ListSensoresUseCase'
import { UpdateSensorUseCase } from '@/emergency/usecases/sensor/UpdateSensorUseCase'
import { CreateTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/CreateTipoEmergenciaUseCase'
import { DeleteTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/DeleteTipoEmergenciaUseCase'
import { FindTipoEmergenciaByIdUseCase } from '@/emergency/usecases/tipo-emergencia/FindTipoEmergenciaByIdUseCase'
import { ListTiposEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/ListTiposEmergenciaUseCase'
import { UpdateTipoEmergenciaUseCase } from '@/emergency/usecases/tipo-emergencia/UpdateTipoEmergenciaUseCase'
import { CreateUdeUseCase } from '@/emergency/usecases/ude/CreateUdeUseCase'
import { DeleteUdeUseCase } from '@/emergency/usecases/ude/DeleteUdeUseCase'
import { FindUdeByIdUseCase } from '@/emergency/usecases/ude/FindUdeByIdUseCase'
import { ListUdesUseCase } from '@/emergency/usecases/ude/ListUdesUseCase'
import { NotifyUdeUpdatedUseCase } from '@/emergency/usecases/ude/NotifyUdeUpdatedUseCase'
import { UpdateUdeUseCase } from '@/emergency/usecases/ude/UpdateUdeUseCase'
import { CreateZonaUseCase } from '@/emergency/usecases/zona/CreateZonaUseCase'
import { DeleteZonaUseCase } from '@/emergency/usecases/zona/DeleteZonaUseCase'
import { FindZonaByIdUseCase } from '@/emergency/usecases/zona/FindZonaByIdUseCase'
import { ListZonasUseCase } from '@/emergency/usecases/zona/ListZonasUseCase'
import { UpdateZonaUseCase } from '@/emergency/usecases/zona/UpdateZonaUseCase'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GrandezaModel,
      TipoEmergenciaModel,
      SensorModel,
      EspecificacaoGrandezaModel,
      ZonaModel,
      UdeModel,
      DeteccaoEmergenciaModel,
      MonitoramentoGrandezaModel,
      MonitoramentoRawDataModel,
      RegistroMonitoramentoModel,
    ]),
  ],
  controllers: [
    GrandezaController,
    TipoEmergenciaController,
    SensorController,
    ZonaController,
    UdeController,
    MonitoramentoController,
  ],
  providers: [
    // Facade
    GrandezaFacade,
    TipoEmergenciaFacade,
    SensorFacade,
    ZonaFacade,
    UdeFacade,
    MonitoramentoFacade,

    // Repositories
    GrandezaRepository,
    TipoEmergenciaRepository,
    SensorRepository,
    ZonaRepository,
    UdeRepository,
    MonitoramentoRawDataRepository,
    RegistroMonitoramentoRepository,

    // Usecases
    ListGrandezasUseCase,
    FindGrandezaByIdUseCase,
    CreateGrandezaUseCase,
    UpdateGrandezaUseCase,
    DeleteGrandezaUseCase,

    ListTiposEmergenciaUseCase,
    FindTipoEmergenciaByIdUseCase,
    CreateTipoEmergenciaUseCase,
    UpdateTipoEmergenciaUseCase,
    DeleteTipoEmergenciaUseCase,

    ListSensoresUseCase,
    FindSensorByIdUseCase,
    CreateSensorUseCase,
    UpdateSensorUseCase,
    DeleteSensorUseCase,

    ListZonasUseCase,
    FindZonaByIdUseCase,
    CreateZonaUseCase,
    UpdateZonaUseCase,
    DeleteZonaUseCase,

    ListUdesUseCase,
    FindUdeByIdUseCase,
    CreateUdeUseCase,
    UpdateUdeUseCase,
    DeleteUdeUseCase,

    NotifyUdeUpdatedUseCase,

    RequestMonitoramentoDataUseCase,
    ProcessRegistroMonitoramentoUseCase,
    ListMonitoramentoRawDataUseCase,
    GetMonitoramentoSummaryUseCase,
  ],
})
export class EmergencyModule { }
