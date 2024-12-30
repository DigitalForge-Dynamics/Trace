import type { UUID } from "trace_common";

export {
  GenericClaimStructure,
  TokenUse,
  RefreshTokenPayload,
  AccessTokenPayload,
  IdTokenPayload,
  TokenPayload,
  UserLogin,
  Tokens,
} from "trace_common";

// https://openid.net/specs/openid-connect-core-1_0.html#UserInfoResponse
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
export type IdPUserInfoPayload = {
  readonly sub: UUID;
  readonly name?: string;
  readonly given_name?: string;
  readonly family_name?: string;
  readonly middle_name?: string;
  readonly nickname?: string;
  readonly preferred_username?: string;
  readonly profile?: string;
  readonly picture?: string;
  readonly website?: string;
  readonly email?: string;
  readonly email_verified?: boolean;
  readonly gender?: string;
  readonly birthdate?: string; // YYYY-MM-DD / 0000-MM-DD / YYYY
  readonly zoneinfo?: string;
  readonly locale?: string;
  readonly phone_number?: string;
  readonly phone_number_verified?: boolean;
  readonly address?: { [key: string]: unknown };
  readonly updated_at?: number;
};
