import { randomBytes } from "node:crypto";
import { API_URL, checkNever } from "../index";
import OIDC_PROVIDERS from "../../oidc_providers.json";
import type {
  Network,
  OidcDiscovery,
  OidcProvider,
  OidcResponse,
} from "./oidc";
import { reviveOidcDiscovery, reviveOidcProvider } from "./revivers";

const loadOidcProviders = (): OidcProvider[] => {
  const providers: OidcProvider[] = [];
  for (const element of OIDC_PROVIDERS) {
    const provider: Network<OidcProvider> = { state: "URL", ...element };
    providers.push(reviveOidcProvider(provider));
  }
  return providers;
};

const providers: OidcProvider[] = loadOidcProviders();

export const getOidcDiscovery = async (
  provider: OidcProvider
): Promise<OidcDiscovery> => {
  if (provider.state === "Loaded") {
    return provider.loaded;
  } else if (provider.state === "URL") {
    const { discovery_uri } = provider;
    const response = await fetch(discovery_uri);
    const json: Network<OidcDiscovery> = await response.json();
    return reviveOidcDiscovery(json);
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
