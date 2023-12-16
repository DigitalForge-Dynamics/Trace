import { randomBytes } from 'node:crypto';
import { API_URL, checkNever } from '../index';

// https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
export type OidcDiscovery = {
	issuer: URL;
	authorization_endpoint: URL;
	token_endpoint: URL;
	userinfo_endpoint?: URL;
	jwks_uri: URL;
	registration_endpoint?: URL;
	scopes_supported: string[];
	response_types_supported: string[];
	response_modes_supported?: string[];
	grant_types_supported?: string[];
	acr_values_supported?: string[];
	subject_types_supported: string[];
	id_token_signing_alg_values_supported: string[];
	id_token_encryption_alg_values_supported?: string[];
	id_token_encryption_enc_values_supported?: string[];
	userinfo_signing_alg_values_supported?: string[];
	userinfo_encryption_alg_values_supported?: string[];
	userinfo_encryption_enc_values_supported?: string[];
	request_object_signing_alg_values_supported?: string[];
	request_object_encryption_alg_values_supported?: string[];
	request_object_encryption_enc_values_supported?: string[];
	token_endpoint_auth_methods_supported?: string[];
	token_endpoint_auth_signing_alg_values_supported?: string[];
	display_values_supported?: string[];
	claim_types_supported?: string[];
	claims_supported?: string[];
	service_documentation?: URL;
	claims_locales_supported?: string[];
	ui_locales_supported?: string[];
	claims_parameter_supported?: boolean;
	request_parameter_supported?: boolean;
	request_uri_parameter_supported?: boolean;
	require_request_uri_registration?: boolean;
	op_policy_uri?: URL;
	op_tos_uri?: URL;
};

export type OidcProvider =
{
	name: string;
	client_id: string;
	client_secret: string; // FIXME: MUST be moved to gitignored configuration file before setting static client_secret in src, or use env vars
} & (
| { state: 'URL'; discovery_uri: URL; }
| { state: 'Loaded'; loaded: OidcDiscovery; }
);

export type OidcResponse = { // typedef based on Google doc's
	access_token: string;
	expires_in: number; // remaining lifetime in seconds
	id_token: string; // JWT
	scope: string; // space separated
	token_type: string; // Google only uses "Bearer"
	refresh_token?: unknown; // For Google, only present if access_type parameter set to offline in authentication request
};

// TODO: Move to configuration file, which then allows for gitignore and storing of secrets
export const OidcGoogle: OidcProvider = {
	name: 'Google',
	client_id: '', // TODO
	client_secret: '', // TODO
	state: 'URL',
	discovery_uri: new URL("https://accounts.google.com/.well-known/openid-configuration"),
};

// TODO: URL fields in OidcDiscovery need to be converted from string to URL when reviving JSON
export const getOidcDiscovery = async (provider: OidcProvider): Promise<OidcDiscovery> => {
	if (provider.state === 'Loaded') {
		return provider.loaded;
	} else if (provider.state === 'URL') {
		const { discovery_uri } = provider;
		const response = await fetch(discovery_uri);
		const discovery: OidcDiscovery = await response.json();
		return discovery;
	} else {
		checkNever(provider);
		throw new Error('Unexpected case caused from type assertion');
	}
};

export const generateCryptoString = async (): Promise<string> => {
	const bytes = await new Promise<Buffer>((resolve, reject) => {
		randomBytes(256, (err, buff) => {
			if (err) return reject(err);
			resolve(buff);
		});
	});
	return bytes.toString('hex');
};

export const initiateOidc = async (provider: OidcProvider): Promise<void> => {
	const discovery = await getOidcDiscovery(provider);
	const csrf = await generateCryptoString();
	const nonce = await generateCryptoString();
	const state = csrf;
	const redirect_uri = `${API_URL}/oidc/code/${provider.name}`;
	const url = `${discovery.authorization_endpoint}?response_type=code&client_id=${provider.client_id}&scope=openid%20email&redirect_uri=${redirect_uri}&state=${state}&nonce=${nonce}`;
	const response = await fetch(url);
	if (response.status !== 200) throw new Error(`Failed to initiate OIDC to provider: ${provider.name}`); // TODO: Error type
	return;
};

export const exchangeOidcCode = async (provider: OidcProvider, code: string): Promise<OidcResponse[]> => {
	const discovery = await getOidcDiscovery(provider);
	const redirect_uri = `${API_URL}/oidc/code/${provider.name}`;
	const body = {
		code,
		client_id: provider.client_id,
		client_secret: provider.client_secret,
		redirect_uri,
		grant_typ: 'authorization_code',
	};

	const response = await fetch(discovery.token_endpoint, {
		method: 'POST',
		body: JSON.stringify(body),
	});
	const keys: OidcResponse[] = await response.json();
	return keys;
};

export const lookupProvider = (name: string): OidcProvider | undefined => ({
	google: OidcGoogle,
}[name]);
