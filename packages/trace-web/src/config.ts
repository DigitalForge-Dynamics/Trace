import { UserManager } from "oidc-client-ts";
import { APIClient, NetClient } from "trace-sdk";

const API_URL = new URL("http://localhost:3000");
const netClient = new NetClient(API_URL);
const apiClient = new APIClient(netClient);

const genUserManager = (idp: any): UserManager => {
  const userManager = new UserManager({
    authority: idp.issuer.toString(),
    client_id: idp.audience,
    redirect_uri: new URL("oidc-callback", window.location.origin).toString(),
    automaticSilentRenew: false,
  });
  return userManager;
};

export { apiClient, genUserManager };
