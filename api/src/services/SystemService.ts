import { Settings } from "../utils/types/settings";
import AuthService from "./AuthenticationService";
import { HealthCheckType, Scope, UserCreationAttributes, WithMfa, WithUuid } from "../utils/types/attributeTypes";
import { encodeBase32 } from "../utils/Encodings";

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
    // TODO: loadSettings
    await Promise.resolve();
    return {};
  }

  public async setSettings(settings: Settings): Promise<void> {
    // TODO: setSettings
    await Promise.resolve();
    void settings;
  }

  public async generateQuickStartUser(authService: AuthService): Promise<[WithUuid<WithMfa<UserCreationAttributes>>, string]> {
    const password = authService.generateSecret(32).toString("base64");
    const mfaSecret = encodeBase32(authService.generateSecret(20));
    const user: WithUuid<WithMfa<UserCreationAttributes>> = {
      firstName: "SETUP",
      lastName: "SETUP",
      username: "SETUP",
      password: await authService.hashPassword(password),
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
    return [user, password];
  }
}
