import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/udes`;

export default DefaultService(baseUrl);
