import GrandezaService from 'services/GrandezaService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Variable'
const inputName = 'grandeza';
const getLabel = (record) => `${record.nome} (${record.sigla})`;
const service = GrandezaService;

export default DefaultSelect(recordName, inputName, service, getLabel);
