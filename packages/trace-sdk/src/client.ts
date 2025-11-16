import {
  type HealthCheckResponse,
  healthCheckResponse,
  type OIDCResponse,
  oidcResponse,
  type OIDCConfigResponse,
  oidcConfigResponse,
} from "trace-schemas";

class NetClient {
  private readonly baseURL: URL;
  private readonly headers: Headers;
  private readonly tls: BunFetchRequestInitTLS;

  constructor(baseUrl: URL) {
    if (!baseUrl.pathname.endsWith("/")) {
      baseUrl.pathname += "/";
    }
    this.baseURL = baseUrl;
    this.headers = new Headers();
    this.tls = {};
  }

  public addHeader(name: string, value: string): this {
    this.headers.append(name, value);
    return this;
  }

  public setAuthorisation(authorisation: string): this {
    this.headers.set("Authorization", `Bearer ${authorisation}`);
    return this;
  }

  public setRootCA(rootCa: string[]): this {
    this.tls.ca = rootCa;
    return this;
  }

  public setClientKey(key: string, cert: string | string[]): this {
    this.tls.cert = cert;
    this.tls.key = key;
    return this;
  }

  public async fetch(path: string, method: "GET" | "POST", init?: RequestInit): Promise<unknown> {
    if (!(path.startsWith("./") || path.startsWith("/"))) {
      throw new Error(`Invalid path prefix provided to fetch: ${path}, with method: ${method}`);
    }
    const relativePath = path.startsWith(".") ? path : `.${path}`;
    if (relativePath.includes("..")) {
      throw new Error("Path traversal is not permitted within NetClient");
    }
    if (relativePath.includes("%")) {
      // TODO: There are legitimate paths using non alphanumeric characters, i.e. spaces, that are safe.
      // This takes the blanket approach of banning all escapes, due to their ability to bypass checks preventing path traversal.
      throw new Error("Character escapes are not currently permitted within NetClient");
    }
    const url = new URL(relativePath, this.baseURL);
    const response = await fetch(url, {
      ...init,
      method,
      tls: this.tls,
      headers: {
        ...init?.headers,
        ...this.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`Request to ${path} with method ${method} failed with status: ${response.status}`);
    }
    return response.json();
  }

  public get(path: string, init?: RequestInit): Promise<unknown> {
    return this.fetch(path, "GET", init);
  }

  public post(path: string, init?: RequestInit): Promise<unknown> {
    return this.fetch(path, "POST", init);
  }
}

class APIClient {
  private readonly netClient: NetClient;

  constructor(netClient: NetClient) {
    this.netClient = netClient;
  }

  public async getHealth(): Promise<HealthCheckResponse> {
    const body = await this.netClient.get("/health-check");
    return healthCheckResponse.parse(body);
  }

  public async authenticateOidc(idpToken: string): Promise<OIDCResponse> {
    const body = await this.netClient.post("/auth/oidc", {
      headers: {
        authorization: `Bearer ${idpToken}`,
      },
    });
    return oidcResponse.parse(body);
  }

  public async getOidcConfig(): Promise<OIDCConfigResponse> {
    const body = await this.netClient.get("/auth/oidc/config");
    return oidcConfigResponse.parse(body);
  }
}

export { NetClient, APIClient };
