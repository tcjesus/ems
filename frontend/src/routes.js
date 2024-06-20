/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Role from "services/Role";
import Index from "views/Index.js";
import Localidade from "views/Localidade";
import Login from "views/Login.js";
import Monitoramento from "views/Monitoramento.js";
import GrandezaForm from "views/grandeza/GrandezaForm.js";
import Grandezas from "views/grandeza/GrandezasList.js";
import SensorForm from "views/sensor/SensorForm.js";
import Sensores from "views/sensor/SensorList.js";
import TipoEmergenciaForm from "views/tipo-emergencia/TipoEmergenciaForm.js";
import TiposEmergencia from "views/tipo-emergencia/TipoEmergenciaList.js";
import UdeForm from "views/ude/UdeForm.js";
import Udes from "views/ude/UdeList.js";
import UsuarioForm from "views/usuario/UsuarioForm.js";
import Usuarios from "views/usuario/UsuarioList.js";
import ZonaForm from "views/zona/ZonaForm.js";
import Zonas from "views/zona/ZonaList.js";

const resources = [
  { name: "usuarios", roles: [Role.SUPER_ADMIN, Role.ADMIN], listComponent: <Usuarios />, formComponent: <UsuarioForm />, label: "Usuários", icon: 'ni-single-02', color: "text-gray" },
  { name: "grandezas", roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER], listComponent: <Grandezas />, formComponent: <GrandezaForm />, label: "Grandezas", icon: 'ni-atom', color: "text-green" },
  { name: "tipos-emergencia", roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER], listComponent: <TiposEmergencia />, formComponent: <TipoEmergenciaForm />, label: "Tipos de Emergência", icon: 'ni-bell-55', color: "text-red" },
  { name: "sensores", roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER], listComponent: <Sensores />, formComponent: <SensorForm />, label: "Sensores", icon: 'ni-sound-wave', color: "text-orange" },
  { name: "zonas", roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER], listComponent: <Zonas />, formComponent: <ZonaForm />, label: "Zonas", icon: 'ni-square-pin', color: "text-brown" },
  { name: "udes", roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER], listComponent: <Udes />, formComponent: <UdeForm />, label: "Udes", icon: 'ni-app', color: "text-blue" },
];

const routes = [
  {
    path: "/*",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/login",
    show: false,
  },
  {
    path: "/*",
    name: "Localidade",
    icon: "ni ni-key-25 text-info",
    component: <Localidade />,
    layout: "/localidade",
    show: false,
  },
  {
    path: "/index",
    name: "Dashboard",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.GUEST],
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",

  },
  // Hidden Routes
  ...resources.map(resource => ({
    show: false,
    path: `/${resource.name}/edit`,
    name: resource.label,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
    component: resource.formComponent,
    layout: "/admin",
  })),
  ...resources.map(resource => ({
    show: false,
    path: `/${resource.name}/edit/:id`,
    name: resource.label,
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER],
    component: resource.formComponent,
    layout: "/admin",
  })),

  // Sidebar Routes
  ...resources.map(resource => ({
    path: `/${resource.name}`,
    name: resource.label,
    roles: resource.roles,
    icon: `ni ${resource.icon} ${resource.color}`,
    component: resource.listComponent,
    layout: "/admin",
  })),
  {
    // Data visualization
    path: "/monitoramento",
    name: "Monitoramento",
    roles: [Role.SUPER_ADMIN, Role.ADMIN, Role.USER, Role.GUEST],
    icon: "ni ni-chart-bar-32 text-yellow",
    component: <Monitoramento />,
    layout: "/admin",

  },
];
export default routes;
