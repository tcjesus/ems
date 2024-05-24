import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/zonas`;

export default DefaultService(baseUrl);
