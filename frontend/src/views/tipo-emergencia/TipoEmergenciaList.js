import TipoEmergenciaService from "services/TipoEmergenciaService";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Nome', 'Grandezas']
const attributes = [
  'id',
  'nome',
  (record) => record.grandezas.map((g) => g.nome).join(', ')
]

export default DefaultList(TipoEmergenciaService, 'emergency-types', 'Tipos de Emergência', headers, attributes);
