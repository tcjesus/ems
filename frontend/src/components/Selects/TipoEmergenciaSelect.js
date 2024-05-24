import TipoEmergenciaService from 'services/TipoEmergenciaService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Tipo de Emergência'
const inputName = 'tipo-emergencia';
const getLabel = (record) => record.nome;
const service = TipoEmergenciaService;

export default DefaultSelect(recordName, inputName, service, getLabel);
