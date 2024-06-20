import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/estados`;

export default DefaultService(baseUrl);
