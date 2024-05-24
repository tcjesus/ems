import ZonaService from "services/ZonaService.js";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Nome']
const attributes = ['id', 'nome']

export default DefaultList(ZonaService, 'zonas', 'Zonas', headers, attributes);
