import SensorService from "services/SensorService";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Modelo', 'Grandezas']
const attributes = [
  'id',
  'modelo',
  (record) => record.especificacoes.map((e) => e.grandeza.nome).join(', ')
]

export default DefaultList(SensorService, 'sensors', 'Sensores', headers, attributes);
