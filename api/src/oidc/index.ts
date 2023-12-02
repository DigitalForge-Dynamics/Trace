// https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
export type OidcDiscovery = {
	issuer: URL;
	authorization_endpoint: URL;
	token_endpoint?: URL; // TODO: Required unless Implicit flow
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
| {
	state: 'URL'
	discovery_uri: URL;
}
| ({ state: 'Loaded' } & OidcDiscovery);


export const OidcGoogle: OidcProvider = {
	state: 'URL',
	discovery_uri: "https://accounts.google.com/.well-known/openid-configuration",
};
