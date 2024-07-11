import TipoEmergenciaService from 'services/TipoEmergenciaService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Emergency Type'
const inputName = 'tipo-emergencia';
const getLabel = (record) => {
  const grandezas = record.grandezas.map(g => g.nome).join(', ')
  return `${record.nome} (${grandezas})`
};
const service = TipoEmergenciaService;

export default DefaultSelect(recordName, inputName, service, getLabel, 'Select an Emergency Type');
