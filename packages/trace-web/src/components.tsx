import { UserManager } from "oidc-client-ts";

const OIDC_CLIENT_ID = "";
const OIDC_ISSUER = "";

const userManager = new UserManager({
	authority: OIDC_ISSUER,
	client_id: OIDC_CLIENT_ID,
	redirect_uri: "https://localhost:5173/oidc-callback",
	response_type: "code",
	scope: "openid email"
});

const Login = () => {
	const onClick = () => {
		console.log("onClick");
		userManager.signinRedirect();
	};
	return <button onClick={onClick}>Login</button>
};

export { Login };
