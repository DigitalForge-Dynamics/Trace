import { HealthCheckType } from "../utils/types/utilsTypes";

interface ISettingsService {
    healthCheck(): HealthCheckType;
}

export default class SettingsService implements ISettingsService {
    // TODO: Figure out way to update software version automatically without using the package.json
    public healthCheck(): HealthCheckType {
        return {
            version: "0.0.0",
            uptime: process.uptime(),
            responseTime: process.hrtime(),
            message: "OK",
            timestamp: new Date(Date.now())
        }
    }
}