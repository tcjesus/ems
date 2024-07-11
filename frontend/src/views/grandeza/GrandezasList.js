import GrandezaService from "services/GrandezaService.js";
import DefaultList from "views/DefaultList";

const headers = ['Code', 'Name', 'Measure Unit', 'Acronym']
const attributes = ['id', 'nome', 'unidadeMedida', 'sigla']

export default DefaultList(GrandezaService, 'variables', 'Variables', headers, attributes);
