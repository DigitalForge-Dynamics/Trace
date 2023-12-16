import type { Network, OidcDiscovery, OidcProvider } from "./oidc";

const reviveOidcProviderImpl = <T>(key: string, value: T): T | URL => {
  if (key === "discovery_uri" && typeof value === "string") {
    return new URL(value);
  }
  return value;
};

const reviveOidcDiscoveryImpl = <T>(key: string, value: T): T | URL => {
  if (key == "issuer" || key.endsWith("_endpoint") || key.endsWith("_uri")) {
    if (typeof value !== "string") return value;
    return new URL(value);
  }
  return value;
};

export const reviveOidcProvider = (
  provider: Network<OidcProvider>
): OidcProvider => JSON.parse(JSON.stringify(provider), reviveOidcProviderImpl);

export const reviveOidcDiscovery = (
  discovery: Network<OidcDiscovery>
): OidcDiscovery =>
  JSON.parse(JSON.stringify(discovery), reviveOidcDiscoveryImpl);
