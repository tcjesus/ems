import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/tipos-emergencia`;

export default DefaultService(baseUrl);
