import type { OIDCConfigResponse } from "trace-schemas";
import { env } from "./env.ts";

type OIDCConfig = Array<OIDCConfigResponse["config"][number] & { subject: string }>;

const oidcConfig: OIDCConfig = [
  {
    label: "GitHub Actions",
    issuer: new URL("https://token.actions.githubusercontent.com"),
    audience: "trace-api",
    subject:
      "^(repo:DigitalForge-Dynamics/Trace:ref:refs/heads/[^/]+)|(repo:DigitalForge-Dynamics/Trace:pull_request)$",
  },
];

if (env.KEYCLOAK_ISSUER && env.KEYCLOAK_AUDIENCE) {
  oidcConfig.push({
    label: "Keycloak",
    issuer: env.KEYCLOAK_ISSUER,
    audience: env.KEYCLOAK_AUDIENCE,
    subject: "^.*$",
  });
}

if (env.CLOUDFLARE_ISSUER && env.CLOUDFLARE_AUDIENCE) {
  oidcConfig.push({
    label: "Cloudflare",
    issuer: env.CLOUDFLARE_ISSUER,
    audience: env.CLOUDFLARE_AUDIENCE,
    subject: "^.*$",
  });
}

if (env.GITHUB_AUDIENCE) {
  oidcConfig.push({
    label: "GitHub",
    issuer: new URL("https://github.com/login/oauth"),
    audience: env.GITHUB_AUDIENCE,
    subject: "^.*$",
  });
}

export { oidcConfig };
