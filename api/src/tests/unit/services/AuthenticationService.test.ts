import AuthenticationService from "../../../services/AuthenticationService";

describe("generateMfaCode", () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    authenticationService = new AuthenticationService();
  });

  it.each<[Buffer, number, string]>([
    [Buffer.from([0, 0, 0, 0, 0]), 0, "328482"],
    [Buffer.from([0, 0, 0, 0, 0]), 100, "032003"],
    [Buffer.from([0, 68, 50, 20, 199]), 0, "058591"],
    [Buffer.from([0, 68, 50, 20, 199]), 100, "117565"],
  ])("Correctly generates the TOTP code", (secret: Buffer, index: number, expected: string) => {
    expect(authenticationService.generateMfaCode(secret, index)).toEqual(expected);
  });
});
