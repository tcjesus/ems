import envs from "environment";
import DefaultService from "./DefaultService";

const baseUrl = `${envs.backendUrl}/grandezas`;

export default DefaultService(baseUrl);
