import { apiClient } from "../../config.ts";
import { Button } from "./button.tsx";

const LoginPage = async () => {
	const idps = await apiClient.getOidcConfig();
	return (
	<>
		<label htmlFor="idp">Select Identity Provider to use to login</label>
		<select name="idp" id="idp">
			{idps.config.map((idp) => <option value={idp.uid} key={idp.uid}>{idp.label}</option>)}
		</select>
		<div id="hydrationRoot">
			<Button idps={idps.config}/>
		</div>
	</>
	);
};

export { LoginPage };
