import { UserManager } from "oidc-client-ts";
import { APIClient, NetClient } from "trace-sdk";

const API_URL: URL = new URL("http://localhost:3000");
const netClient: NetClient = new NetClient(API_URL);
const apiClient: APIClient = new APIClient(netClient);

const genUserManager = (idp: Awaited<ReturnType<typeof apiClient.getOidcConfig>>["config"][number]): UserManager => {
  const userManager = new UserManager({
    authority: idp.issuer.toString(),
    client_id: idp.audience,
    redirect_uri: new URL("oidc-callback", window.location.origin).toString(),
    automaticSilentRenew: false,
  });
  return userManager;
};

export { apiClient, netClient, genUserManager, API_URL };
