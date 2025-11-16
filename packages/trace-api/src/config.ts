const oidcConfig = [
  {
    label: "GitHub Actions",
    issuer: "https://token.actions.githubusercontent.com",
    audience: "trace-api",
    subject:
      "^(repo:DigitalForge-Dynamics\/Trace:ref:refs\/heads\/[^/]+)|(repo:DigitalForge-Dynamics\/Trace:pull_request)$",
  },
  {
    label: "Keycloak",
    issuer: Bun.env.KEYCLOAK_ISSUER,
    audience: Bun.env.KEYCLOAK_AUDIENCE,
    subject: "^.*$",
  },
  {
    label: "Cloudflare",
    issuer: Bun.env.CLOUDFLARE_ISSUER,
    audience: Bun.env.CLOUDFLARE_AUDIENCE,
    subject: "^.*$",
  },
  {
    label: "GitHub",
    issuer: "https://github.com/login/oauth",
    audience: Bun.env.GITHUB_AUDIENCE,
    subject: "^.*$",
  },
];

export { oidcConfig };
