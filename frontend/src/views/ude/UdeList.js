import UdeService from "services/UdeService";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Tipo', 'Label', 'MAC', 'Zona', 'Emergências']
const attributes = [
  'id',
  'tipo',
  'label',
  'mac',
  (record) => record.zona.nome,
  (record) => record.deteccoesEmergencia.map((e) => e.tipoEmergencia.nome).join(', ')
]

export default DefaultList(UdeService, 'udes', 'Un. Detec. de Emergência', headers, attributes);
