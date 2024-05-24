import UsuarioService from "services/UsuarioService";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Nome', 'Email', 'Role']
const attributes = ['id', 'nome', 'email', 'role']

export default DefaultList(UsuarioService, 'usuarios', 'Usuários', headers, attributes);
