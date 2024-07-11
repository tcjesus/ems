import UdeService from "services/UdeService";
import DefaultList from "views/DefaultList";

const headers = ['Code', 'Type', 'Label', 'MAC', 'Zone', 'Emergencies']
const attributes = [
  'id',
  'tipo',
  'label',
  'mac',
  (record) => record.zona.nome,
  (record) => record.deteccoesEmergencia.map((e) => e.tipoEmergencia.nome).join(', ')
]

export default DefaultList(UdeService, 'edus', 'Emergency Detection Unit', headers, attributes);
