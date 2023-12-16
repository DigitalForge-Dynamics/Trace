import { randomBytes } from "node:crypto";
import { API_URL, checkNever } from "../index";
import OIDC_PROVIDERS from "../../oidc_providers.json";
import type { OidcDiscovery, OidcProvider, OidcResponse } from "./oidc";

export const getOidcDiscovery = async (
  provider: OidcProvider
): Promise<OidcDiscovery> => {
  if (provider.state === "Loaded") {
    return JSON.parse(JSON.stringify(provider.loaded), reviveOidcDiscovery);
  } else if (provider.state === "URL") {
    const { discovery_uri } = JSON.parse(
      JSON.stringify(provider),
      reviveOidcProviders
    );
    const response = await fetch(discovery_uri);
    const json = await response.json();
    const discovery: OidcDiscovery = JSON.parse(
      JSON.stringify(json),
      reviveOidcDiscovery
    );
    return discovery;
  } else {
    checkNever(provider);
    throw new Error(
      `Unexpected case caused from type assertion: ${JSON.stringify(provider)}`
    );
  }
};

export const generateCryptoString = async (): Promise<string> => {
  const bytes = await new Promise<Buffer>((resolve, reject) => {
    randomBytes(256, (err, buff) => {
      if (err) return reject(err);
      resolve(buff);
    });
  });
  return bytes.toString("hex");
};

export const initiateOidc = async (provider: OidcProvider): Promise<void> => {
  const discovery = await getOidcDiscovery(provider);
  const csrf = await generateCryptoString();
  const nonce = await generateCryptoString();
  const state = csrf;
  const redirect_uri = `${API_URL}/oidc/code/${provider.name}`;
  const url = `${discovery.authorization_endpoint}?response_type=code&client_id=${provider.client_id}&scope=openid%20email&redirect_uri=${redirect_uri}&state=${state}&nonce=${nonce}`;
  const response = await fetch(url);
  if (response.status !== 200)
    throw new Error(`Failed to initiate OIDC to provider: ${provider.name}`); // TODO: Error type
  return;
};

export const exchangeOidcCode = async (
  provider: OidcProvider,
  code: string
): Promise<OidcResponse[]> => {
  const discovery = await getOidcDiscovery(provider);
  const redirect_uri = `${API_URL}/oidc/code/${provider.name}`;
  const body = {
    code,
    client_id: provider.client_id,
    client_secret: provider.client_secret,
    redirect_uri,
    grant_typ: "authorization_code",
  };

  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const keys: OidcResponse[] = await response.json();
  return keys;
};

export const lookupProvider = (name: string): OidcProvider | undefined =>
  providers.find((provider) => provider.name === name);

const reviveOidcProviders = <T>(key: string, value: T): T | URL => {
  if (key === "discovery_uri" && typeof value === "string") {
    return new URL(value);
  }
  return value;
};

const reviveOidcDiscovery = <T>(key: string, value: T): T | URL => {
  if (key == "issuer" || key.endsWith("_endpoint") || key.endsWith("_uri")) {
    if (typeof value !== "string") return value;
    return new URL(value);
  }
  return value;
};

const providers: OidcProvider[] = JSON.parse(
  JSON.stringify(OIDC_PROVIDERS),
  reviveOidcProviders
);
