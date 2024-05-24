import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/sensores`;

export default DefaultService(baseUrl);
