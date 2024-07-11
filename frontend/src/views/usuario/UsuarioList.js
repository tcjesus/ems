import UsuarioService from "services/UsuarioService";
import DefaultList from "views/DefaultList";

const headers = ['Código', 'Nome', 'Email', 'Super Admin?']
const attributes = ['id', 'nome', 'email', (usuario) => usuario.isSuperAdmin ? 'Sim' : 'Não']

export default DefaultList(UsuarioService, 'users', 'Usuários', headers, attributes);
