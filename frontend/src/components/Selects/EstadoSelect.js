import EstadoService from 'services/EstadoService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'State'
const inputName = 'estado';
const getLabel = (record) => `${record.nome}`;
const service = EstadoService;

export default DefaultSelect(recordName, inputName, service, getLabel, 'Select a State');
