import { useState, useEffect } from "react";

import { setSessionOidcState, getSessionOidcState, removeSessionOidcState } from "../data/storage";

const idpUrl = "https://localhost:18000/realms/trace";
const clientId = "trace-api";
const clientSecret = ""; // TODO
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

	return (
		<a href={`${wellKnown.authorization_endpoint}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&nonce=${nonce}`}
		>Authorise</a>
	);
};

export const OidcCallback = () => {
	const [wellKnown, setWellKnown] = useState<WellKnown | undefined>();

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
			const tokens = await getTokens(wellKnown.token_endpoint, callbackCode);
			const id = JSON.parse(atob(tokens.id_token.split(".")[1] ?? ""));
			console.log(id);
		};
		callback().catch((err) => console.error(err));
	}, [wellKnown]);

	return null;
};

type WellKnown = {
	readonly authorization_endpoint: string;
	readonly token_endpoint: string;
	readonly jwks_uri: string;
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
