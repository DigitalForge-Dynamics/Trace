import { UserManager } from "oidc-client-ts";
import { OIDC_CLIENT_ID, OIDC_ISSUER } from "./.config.ts";

const metadata = await fetch(`${OIDC_ISSUER}/.well-known/openid-configuration`).then((response) => response.json());

const userManager = new UserManager({
  authority: OIDC_ISSUER,
  client_id: OIDC_CLIENT_ID,
  redirect_uri: "https://localhost:5173/oidc-callback",
  response_type: "code",
  scope: "openid email",
  automaticSilentRenew: false,
  metadata: {
    ...metadata,
    //token_endpoint: "https://localhost:5173/oidc-token",
  },
});

export { userManager, metadata };
