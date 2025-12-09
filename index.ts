import { appendFile } from "node:fs/promises";

type EnvVar = { name: string; required: boolean };
type EnvFiles = Record<string, EnvVar[]>;

const envFiles: EnvFiles = {
  "trace-api": [
    {
      name: "KEYCLOAK_ISSUER",
      required: true,
    },
    {
      name: "KEYCLOAK_AUDIENCE",
      required: true,
    },
    {
      name: "CLOUDFLARE_ISSUER",
      required: false,
    },
    {
      name: "CLOUDFLARE_AUDIENCE",
      required: false,
    },
    {
      name: "GITHUB_AUDIENCE",
      required: false,
    },
    {
      name: "TRACE_ADMIN_ISSUER",
      required: true,
    },
    {
      name: "TRACE_ADMIN_SUB",
      required: true,
    },
  ],
  "trace-playwright": [
    {
      name: "KEYCLOAK_USERNAME",
      required: true,
    },
    {
      name: "KEYCLOAK_PASSWORD",
      required: true,
    },
  ],
  // TODO: These are only required when running `bun test`. Add `test` script to `package.json` to account for this, using `cwd`.
  "..": [
    {
      name: "KEYCLOAK_ISSUER",
      required: true,
    },
    {
      name: "KEYCLOAK_AUDIENCE",
      required: true,
    },
    {
      name: "TRACE_ADMIN_ISSUER",
      required: true,
    },
    {
      name: "TRACE_ADMIN_SUB",
      required: true,
    },
  ],
};

const setupEnvFiles = async (): Promise<void> => {
  for (const [pkgName, envVars] of Object.entries(envFiles)) {
    const file = Bun.file(`packages/${pkgName}/.env`);
    let existing: string[] = [];
    if (await file.exists()) {
      const existingText = await file.text();
      existing = existingText
        .split("\n")
        .filter((line) => line !== "")
        .map((line) => line.split("=")[0])
        .filter((line) => line !== undefined);
    }
    for (const env of envVars) {
      if (env.required && existing.includes(`#${env.name}`)) {
        console.log(`[INFO]: Env Var ${env.name} in ${pkgName} is now required.`);
      } else if (env.required && !existing.includes(env.name)) {
        await appendFile(`packages/${pkgName}/.env`, `${env.name}=""\n`);
        console.log(`[INFO]: Env Var ${env.name} requires configuring.`);
      } else if (!(existing.includes(env.name) || existing.includes(`#${env.name}`))) {
        await appendFile(`packages/${pkgName}/.env`, `#${env.name}=""\n`);
      }
    }
    for (const env of existing) {
      const isUsed = envVars.find((envVar) => envVar.name === env) !== undefined;
      if (!isUsed) {
        console.log(`[INFO]: Env Var ${env} in ${pkgName} is defined, but not used.`);
      }
    }
  }
};

await setupEnvFiles();
