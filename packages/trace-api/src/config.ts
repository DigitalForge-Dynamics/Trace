import type { Database } from "@DigitalForge-Dynamics/trace-db";
import { env } from "./env.ts";

const regexAny: RegExp = /^.*$/;
const githubRegex =
  /^(repo:DigitalForge-Dynamics\/Trace:ref:refs\/heads\/[^/]+)|(repo:DigitalForge-Dynamics\/Trace:pull_request)$/;

const setupConfiguration = async (db: Database): Promise<void> => {
  await db.createIdp({
    label: "GitHub Actions",
    issuer: new URL("https://token.actions.githubusercontent.com"),
    audience: "trace-api",
    subject: githubRegex,
  });
  if (env.KEYCLOAK_ISSUER && env.KEYCLOAK_AUDIENCE) {
    await db.createIdp({
      label: "Keycloak",
      issuer: env.KEYCLOAK_ISSUER,
      audience: env.KEYCLOAK_AUDIENCE,
      subject: regexAny,
    });
  }

  if (env.CLOUDFLARE_ISSUER && env.CLOUDFLARE_AUDIENCE) {
    await db.createIdp({
      label: "Cloudflare",
      issuer: env.CLOUDFLARE_ISSUER,
      audience: env.CLOUDFLARE_AUDIENCE,
      subject: regexAny,
    });
  }

  if (env.GITHUB_AUDIENCE) {
    await db.createIdp({
      label: "GitHub",
      issuer: new URL("https://github.com/login/oauth"),
      audience: env.GITHUB_AUDIENCE,
      subject: regexAny,
    });
  }

  const traceAdmin = await db.createUser({
    username: "TRACE_ADMIN",
  });
  const idp = await db.findIdp(env.TRACE_ADMIN_ISSUER);
  if (idp === null) {
    throw new Error("Unable to locate IdP configured for bootstrap ADMIN access.");
  }
  await db.linkUser(traceAdmin.uid, idp.uid, env.TRACE_ADMIN_SUB);
};

const corsHeaders: Headers = new Headers({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
});

export { setupConfiguration, corsHeaders };
