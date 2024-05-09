import { Settings } from "../utils/types/settings";
import { HealthCheckType } from "../utils/types/attributeTypes";

interface ISystemService {
  healthCheck(): HealthCheckType;
  loadSettings(): Promise<Settings>;
  setSettings(settings: Settings): void;
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

  public async loadSettings(): Promise<Settings> {
    // TODO: loadSettings
    await Promise.resolve();
    return {};
  }

  public async setSettings(settings: Settings): Promise<void> {
    // TODO: setSettings
    await Promise.resolve();
    void settings;
  }
}
