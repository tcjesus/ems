const Role = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
  PUBLIC: 'PUBLIC'
})

export default Role;

export function format(role) {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 'Super Admin';
    case Role.ADMIN:
      return 'Admin';
    case Role.USER:
      return 'Usuário';
    case Role.GUEST:
      return 'Convidado';
    default:
      return 'Unknown';
  }
}