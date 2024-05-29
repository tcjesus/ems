import UdeService from 'services/UdeService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Un. de Detec. de Emergência'
const inputName = 'ude';
const getLabel = (record) => `${record.label}`;
const service = UdeService;

export default DefaultSelect(recordName, inputName, service, getLabel);
