import SensorService from 'services/SensorService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Sensor'
const inputName = 'sensor';
const getLabel = (record) => `${record.modelo} (${record.especificacoes.map(e => e.grandeza.nome).join(', ')})`;
const service = SensorService;

export default DefaultSelect(recordName, inputName, service, getLabel, 'Selecione um Sensor');
