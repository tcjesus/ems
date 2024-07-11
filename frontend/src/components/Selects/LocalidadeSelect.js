import LocalidadeService from 'services/LocalidadeService';
import DefaultSelect from "./DefaultSelect";
import { format } from 'services/Role';

const recordName = 'Locality'
const inputName = 'localidade';
const getRole = (record) => {
  if (record.role) {
    return ` (${format(record.role)})`;
  }
  return '';
}
const getLabel = (record) => `${record.cidade.nome} - ${record.cidade.estado.sigla}${getRole(record)}`;
const service = LocalidadeService;

export default DefaultSelect(recordName, inputName, service, getLabel, 'Select a Locality');
