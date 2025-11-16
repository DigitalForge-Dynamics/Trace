const oidcConfig = [
  {
    issuer: "https://token.actions.githubusercontent.com",
    audience: "trace-api",
    subject:
      "^(repo:DigitalForge-Dynamics\/Trace:ref:refs\/heads\/[^/]+)|(repo:DigitalForge-Dynamics\/Trace:pull_request)$",
  },
];

export { oidcConfig };
