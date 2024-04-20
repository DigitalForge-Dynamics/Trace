import React, { ReactNode, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import QRCode from "react-qr-code";
import { AuthContext } from "../../context/auth.context";
import { initMfa, enableMfa } from "../../data/api";

type FormState =
| { tag: 'Initial' }
| { tag: 'Initialised', secret: string, code: string }
| { tag: 'Enabled' };

const getUri = (secret: string): URL => {
	return new URL(
		`otpauth://totp/Trace?secret=${secret}&issuer=Trace%20Asset%20Management&algorithm=SHA1&digits=6&period=30`
	);
};

const MfaForm: React.FC<object> = (): ReactNode => {
	const [state, setState] = useState<FormState>({ tag: 'Initial' });
	const { authState } = useContext(AuthContext);
	if (authState.isLoggedIn === false) return <Navigate to="/login"/>;

	const handler = async () => {
		switch (state.tag) {
			case 'Initial': {
				const secret = await initMfa(authState.data);
				if (secret === null) {
					throw new Error();
				}
				setState({ tag: 'Initialised', secret, code: '' });
				return;
			}
			case 'Initialised': {
				if (!/^[0-9]{6}$/.test(state.code)) return;
				const success = await enableMfa(authState.data, state.code);
				if (success !== true) {
					throw new Error();
				}
				setState({ tag: 'Enabled' });
				return;
			}
			case 'Enabled': {
				return <Navigate to="/" />;
			}
		}
	};

	return <>
		{state.tag === 'Initialised' ? <>
			<QRCode value={getUri(state.secret).toString()}/>
			<br/>
			<b>{state.secret}</b>
			<br/>
			<TextField
				value={state.code}
				label="MFA Code"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					setState({...state, code: e.target.value });
				}}
				error={!/^[0-9]{6}$/.test(state.code)}
			/>
			<br/>
		</>
		: null}
		<Button onClick={handler}>
			{{
				Initial: 'Configure MFA',
				Initialised: 'Submit',
				Enabled: 'Dashboard'
			}[state.tag]}
		</Button>
	</>;
};

export default MfaForm;
