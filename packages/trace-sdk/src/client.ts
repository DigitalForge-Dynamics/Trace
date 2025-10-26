import { healthCheckResponse, type HealthCheckResponse } from "trace-schemas";

class NetClient {
  private baseURL: URL;
  private headers: Headers;
  private tls: BunFetchRequestInitTLS;

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

  public async get(path: string): Promise<unknown> {
    if (!path.startsWith(".")) {
      path = `.${path}`;
    }
    if (path.includes("..")) {
      throw new Error("Path traversal is not permitted within NetClient");
    }
    const url = new URL(path, this.baseURL);
    const response = await fetch(url, {
      method: "GET",
      tls: this.tls,
    });
    if (!response.ok) {
      throw new Error(`Request to ${path} failed with status: ${response.status}`);
    }
    return response.json();
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
}

export { NetClient, APIClient };
