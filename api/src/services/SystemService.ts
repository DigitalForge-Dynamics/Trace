import { Settings } from "../utils/types/settings";
import AuthService from "./AuthenticationService";
import { HealthCheckType, Scope, UserCreationAttributes, WithMfa, WithUuid } from "../utils/types/attributeTypes";
import { encodeBase32 } from "../utils/Encodings";
import { getSettingsPath } from "../utils/Environment";
import fs from "node:fs";
import { validateSettings } from "trace_common";
import ErrorController from "../controllers/ErrorController";

interface ISystemService {
  healthCheck(): HealthCheckType;
  loadSettings(): Promise<Settings>;
  setSettings(settings: Settings): Promise<void>;
  generateQuickStartUser(authService: AuthService): Promise<[WithUuid<WithMfa<UserCreationAttributes>>, string]>;
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
    const path = getSettingsPath();
    if (path === undefined) throw ErrorController.InternalServerError("Missing settings path configuration.");
    const json: string = await new Promise((resolve, reject) => {
      fs.readFile(path, "utf-8", (err: NodeJS.ErrnoException | null, res: string) => {
        if (err !== null) return reject(err);
        return resolve(res);
      });
    });
    return validateSettings(json);
  }

  public async setSettings(settings: Settings): Promise<void> {
    const path = getSettingsPath();
    if (path === undefined) throw ErrorController.InternalServerError("Missing settings path configuration.");
    const json: string = JSON.stringify(settings);
    return new Promise((resolve, reject) => {
      fs.writeFile(path, json, (err: NodeJS.ErrnoException | null) => {
        if (err !== null) return reject(err);
        return resolve();
      });
    });
  }

  public async generateQuickStartUser(authService: AuthService): Promise<[WithUuid<WithMfa<UserCreationAttributes>>, string]> {
    const credential = authService.generateSecret(32).toString("base64");
    const mfaSecret = encodeBase32(authService.generateSecret(20));
    const user: WithUuid<WithMfa<UserCreationAttributes>> = {
      firstName: "SETUP",
      lastName: "SETUP",
      username: "SETUP",
      password: await authService.hashPassword(credential),
      email: "admin@localhost",
      isActive: true,
      scope: [Scope.READ,
        Scope.ASSET_CREATE, Scope.ASSET_DELETE, Scope.ASSET_RETURN, Scope.ASSET_AUDIT, Scope.ASSET_MOVE,
        Scope.USER_CREATE, Scope.USER_DELETE, Scope.USER_AUDIT,
        Scope.LOCATION_CREATE, Scope.LOCATION_DELETE, Scope.LOCATION_AUDIT,
        Scope.SETTINGS_ADMIN,
      ],
      mfaSecret,
      uuid: authService.generateUuid("SETUP"),
    };
    return [user, credential];
  }
}
