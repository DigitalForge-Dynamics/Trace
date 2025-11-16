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
  {
    label: "Keycloak",
    issuer: env.KEYCLOAK_ISSUER,
    audience: env.KEYCLOAK_AUDIENCE,
    subject: "^.*$",
  },
  {
    label: "Cloudflare",
    issuer: env.CLOUDFLARE_ISSUER,
    audience: env.CLOUDFLARE_AUDIENCE,
    subject: "^.*$",
  },
  {
    label: "GitHub",
    issuer: new URL("https://github.com/login/oauth"),
    audience: env.GITHUB_AUDIENCE,
    subject: "^.*$",
  },
];

export { oidcConfig };
