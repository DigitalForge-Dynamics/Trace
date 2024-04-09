import { HealthCheckType } from "../utils/types/attributeTypes";

interface ISystemService {
  healthCheck(): HealthCheckType;
}

export default class SystemService implements ISystemService {
  public healthCheck(): HealthCheckType {
    const uptimeTotalHours = Math.floor(process.uptime() / 3600);
    const uptimeTotalMinutes = Math.floor((process.uptime() % 3600) / 60);
    const uptimeTotalSeconds = Math.floor(process.uptime() % 60);
    return {
      uptime: `${uptimeTotalHours} hours : ${uptimeTotalMinutes} minutes : ${uptimeTotalSeconds} seconds`,
      message: "OK",
      timestamp: new Date(Date.now()),
    };
  }
}
