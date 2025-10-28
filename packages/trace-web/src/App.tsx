import { userManager } from "./oidc-manager.ts";

const App = () => {
	const onClick = async () => {
		console.log("onClick");
		await userManager.signinRedirect();
	};
	return <button onClick={onClick}>Login</button>
};

export { App };
