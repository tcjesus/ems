import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/cidades`;

export default DefaultService(baseUrl);
