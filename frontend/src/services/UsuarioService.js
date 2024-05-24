import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/usuarios`;

export default DefaultService(baseUrl);
