import {
  type CreateAssetRequest,
  type CreateAssetResponse,
  type CreateLocationRequest,
  type CreateLocationResponse,
  type CreateUserRequest,
  type CreateUserResponse,
  createAssetResponse,
  createLocationResponse,
  createUserResponse,
  type GetAssetRequest,
  type GetAssetResponse,
  getAssetResponse,
  type HealthCheckResponse,
  healthCheckResponse,
  type JWKSResponse,
  jwksResponse,
  type LinkUserIdpRequest,
  type ListAssetsResponse,
  listAssetsResponse,
  type OIDCConfigResponse,
  type OIDCResponse,
  oidcConfigResponse,
  oidcResponse,
} from "@DigitalForge-Dynamics/trace-schemas";

type SDKHeadersInit = Headers;
type SDKRequestInit = Omit<RequestInit, "headers"> & { headers?: SDKHeadersInit };

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

  public async fetch(path: string, method: "GET" | "POST", init?: SDKRequestInit): Promise<unknown> {
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
    const headers = new Headers();
    if (init?.headers) {
      init.headers.forEach((value, key) => {
        headers.set(key, value);
      });
    }
    this.headers.forEach((value, key) => {
      headers.set(key, headers.get(key) ?? value);
    });

    const url = new URL(relativePath, this.baseURL);
    const response = await fetch(url, {
      ...init,
      method,
      tls: this.tls,
      mode: "cors",
      headers,
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Request to ${method} ${path} failed with status: ${response.status}, and body ${body}`);
    }
    return response.json();
  }

  public get(path: string, init?: SDKRequestInit): Promise<unknown> {
    return this.fetch(path, "GET", init);
  }

  public post(path: string, init?: SDKRequestInit): Promise<unknown> {
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
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${idpToken}`);
    const body = await this.netClient.post("/auth/oidc", { headers });
    return oidcResponse.parse(body);
  }

  public async getOidcConfig(): Promise<OIDCConfigResponse> {
    const body = await this.netClient.get("/auth/oidc/config");
    return oidcConfigResponse.parse(body);
  }

  public async getJwks(): Promise<JWKSResponse> {
    const body = await this.netClient.get("/auth/oidc/.well-known/jwks");
    return jwksResponse.parse(body);
  }

  public async createUser(user: CreateUserRequest): Promise<CreateUserResponse> {
    const body = await this.netClient.post("/user", { body: JSON.stringify(user) });
    return createUserResponse.parse(body);
  }

  public async linkUserIdp(info: LinkUserIdpRequest): Promise<void> {
    await this.netClient.post("/user/link", { body: JSON.stringify(info) });
  }

  public async createAsset(asset: CreateAssetRequest): Promise<CreateAssetResponse> {
    const body = await this.netClient.post("/asset", { body: JSON.stringify(asset) });
    return createAssetResponse.parse(body);
  }

  public async getAsset(asset: GetAssetRequest): Promise<GetAssetResponse | null> {
    // biome-ignore lint/plugin/regex-full-search: False positive from lint. // TODO: Improve lint to remove this matching.
    const body = await this.netClient.get(`/asset/${asset.id}`);
    if (body === null) {
      return null;
    }
    return getAssetResponse.parse(body);
  }

  public async listAssets(): Promise<ListAssetsResponse> {
    const body = await this.netClient.get("/asset");
    return listAssetsResponse.parse(body);
  }

  public async createLocation(location: CreateLocationRequest): Promise<CreateLocationResponse> {
    const body = await this.netClient.post("/location", { body: JSON.stringify(location) });
    return createLocationResponse.parse(body);
  }
}

export { NetClient, APIClient };
