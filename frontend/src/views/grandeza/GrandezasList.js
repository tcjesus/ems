import GrandezaService from "services/GrandezaService.js";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Nome', 'Un. Medida', 'Sigla']
const attributes = ['id', 'nome', 'unidadeMedida', 'sigla']

export default DefaultList(GrandezaService, 'grandezas', 'Grandezas', headers, attributes);
