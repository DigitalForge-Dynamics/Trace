import { useState, useEffect } from "react";

import { setSessionOidcState, getSessionOidcState, removeSessionOidcState } from "../data/storage";
import { loginOidc, decodeUserAuth } from "../data/api";
import type { Tokens, AuthData } from "../utils/types/authTypes";
import { useAuthContext } from "../context/auth.context";

const idpUrl = "https://localhost:18000/realms/trace";
const clientId = "trace-api";
const clientSecret = "4bRyTTZEOl1VyqrGQnavVeinxNcCLN1L";
const redirectUri = "http://localhost:5173/oidc/callback";
const scope = "openid+profile+email";

export const OidcRequest = () => {
	const [state, setState] = useState<string>("");
	const [nonce, setNonce] = useState<string>("");
	const [wellKnown, setWellKnown] = useState<WellKnown | undefined>();

	useEffect(() => {
		setState("SomeRandomStateValue");
		setNonce("SomeRandomNonceValue");
	}, [state, nonce]);

	useEffect(() => {
		const callback = async () => setWellKnown(await getWellKnown(idpUrl));
		callback()
		.catch((err) => console.error(err));
	}, []);

	if (!wellKnown || !state || !nonce) return "Loading";

	setSessionOidcState(state);
	const authUrl = `${wellKnown.authorization_endpoint}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&nonce=${nonce}`;

	return <a href={authUrl}>Authorise via OIDC</a>;
};

export const OidcCallback = () => {
	const [wellKnown, setWellKnown] = useState<WellKnown | undefined>();
	const { login } = useAuthContext();

	useEffect(() => {
		const callback = async () => setWellKnown(await getWellKnown(idpUrl));
		callback().catch((err) => console.error(err));
	}, []);

	useEffect(() => {
		const storedState = getSessionOidcState();
		const params = new URLSearchParams(window.location.search);
		const callbackState = params.get("state");
		const callbackCode = params.get("code");

		if (!storedState || !callbackState || !callbackCode) return;
		if (storedState !== callbackState) {
			console.warn(`Unmatching state. Received ${callbackState}`);
			return;
		}
		if (!wellKnown) return;
		removeSessionOidcState();

		const callback = async () => {
			const idpTokens = await getTokens(wellKnown.token_endpoint, callbackCode);
			const apiTokens: Tokens = await loginOidc(idpTokens.access_token);
			const apiTokenAuthData: AuthData = decodeUserAuth(apiTokens);
			login(apiTokenAuthData);
		};
		callback().catch((err) => console.error(err));
	}, [wellKnown, login]);

	return null;
};

// https://openid.net/specs/openid-connect-discovery-1_0.html
type WellKnown = {
	readonly issuer: `https://${string}`;
	readonly authorization_endpoint: `https://${string}`;
	readonly token_endpoint: `https://${string}`;
	readonly userinfo_endpoint?: `https://${string}`;
	readonly jwks_uri: `https://${string}`;
	readonly registration_endpoint?: `https://${string}`;
	/** If present, MUST contain "openid" */
	readonly scopes_supported?: string[];
	/** MUST contain "code", "id_token", "id_token token" */
	readonly response_types_supported: string[];
	/** If omitted, default to ["query", "fragment"] */
	readonly response_modes_supported?: string[];
	/** Valid types include "pairwise", "public" */
	readonly subject_types_supported: string[];
	/** MUST include RS256. May include "none" */
	readonly id_token_signing_alg_values_supported: string[];
	/** Might not be exhaustive */
	readonly claims_supported: string[];
};

type TokenResult = {
	readonly token_type: "Bearer";
	readonly access_token: string;
	readonly id_token: string;
	readonly expires_in?: number;
	readonly refresh_token?: string;
	readonly scope?: string;
};

const getWellKnown = async (idpUrl: string): Promise<WellKnown> => {
	const response = await fetch(`${idpUrl}/.well-known/openid-configuration`);
	// TODO: Validate body
	const wellKnown: WellKnown = await response.json();
	return wellKnown;
};

const getTokens = async (tokenEndpoint: string, callbackCode: string): Promise<TokenResult> => {
	const response = await fetch(tokenEndpoint, {
		method: "POST",
		body: Object.entries({
			grant_type: "authorization_code",
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: redirectUri,
			code: callbackCode,
		})
		.map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
		.join('&'),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});
	const tokens: TokenResult = await response.json();
	return tokens;
}

const decodeIdToken = (idToken: string): OidcIdToken => {
	const parts = idToken.split(".");
	if (parts.length !== 3) throw new Error("Invalid IdToken");
	// TODO: Signature Verification
	const bodyEnc: string = parts[1]!;
	// TODO: Body schema validation
	const parsed: OidcIdToken = JSON.parse(atob(bodyEnc));
	return parsed;
};

// https://openid.net/specs/openid-connect-core-1_0.html#IDToken
type OidcIdToken = {
	readonly iss: `https://${string}`;
	readonly sub: string;
	/** MUST contain client_id */
	readonly aud: string | string[];
	readonly exp: number;
	readonly iat: number;
	readonly auth_time?: number;
	/** If present, MUST verify is the same as generated in initial request. If present in auth request, then IdP MUST include it in Id Token. */
	readonly nonce?: string;
	readonly act?: string;
	readonly amr?: string[];
	readonly azp?: string;
};

// https://www.rfc-editor.org/rfc/rfc7517.html
type JsonWebKey = {
	readonly kty: string;
	readonly use?: "sig" | "enc" | string;
	readonly key_ops?: ("sign" | "verify" | "encrypt" | "decrypt" | "wrapKey" | "unwrapKey" | "deriveKey" | "deriveBits" | string)[];
	readonly alg?: string;
	readonly kid?: string;
	readonly x5u?: string;
	readonly x5c?: string;
	readonly x5t?: string;
	readonly "x5t#S256"?: string;
};

// https://www.rfc-editor.org/rfc/rfc7517.html
export type JsonWebKeySet = {
	readonly keys: JsonWebKey[];
};

void decodeIdToken;
