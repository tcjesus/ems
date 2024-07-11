import ZonaService from 'services/ZonaService';
import DefaultSelect from "./DefaultSelect";

const recordName = 'Zone'
const inputName = 'zona';
const getLabel = (record) => record.nome;
const service = ZonaService;

export default DefaultSelect(recordName, inputName, service, getLabel);
