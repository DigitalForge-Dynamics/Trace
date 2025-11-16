import { UserManager } from "oidc-client-ts";
import { NetClient, APIClient } from "trace-sdk";

const API_URL = new URL("http://localhost:3000");
const netClient = new NetClient(API_URL);
const apiClient = new APIClient(netClient);

const oidcIdpConfig = await apiClient.getOidcConfig();
const idp = oidcIdpConfig.config.find((idp) => idp.label === "Keycloak");
if (!idp) throw new Error("Unable to identify Keycloak IdP. Please configure.");

const userManager = new UserManager({
  authority: idp.issuer.toString(),
  client_id: idp.audience,
  redirect_uri: "https://localhost:5173/oidc-callback",
  response_type: "code",
  scope: "openid email",
  automaticSilentRenew: false,
});

export { userManager };
