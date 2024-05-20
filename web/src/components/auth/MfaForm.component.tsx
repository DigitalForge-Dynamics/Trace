import React, { ReactNode, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import QRCode from "react-qr-code";
import { useAuthContext } from "../../context/auth.context";
import { initMfa, enableMfa } from "../../data/api";

type FormState =
| { tag: 'Unconfigured' }
| { tag: 'Initialised', secret: string, code: string }
| { tag: 'Enabled' };

const getUri = (secret: string): URL => {
  return new URL(
    `otpauth://totp/Trace?secret=${encodeURIComponent(secret)}&issuer=Trace%20Asset%20Management&algorithm=SHA1&digits=6&period=30`
  );
};

interface MfaFormProps {
  initialState: 'Unconfigured' | 'Enabled';
}

const MfaForm: React.FC<MfaFormProps> = ({ initialState }): ReactNode => {
  const [state, setState] = useState<FormState>({ tag: initialState });
  const { authState } = useAuthContext();
  const navigate = useNavigate();
  if (authState.isLoggedIn === false) return <Navigate to="/login"/>;

  const handler = async () => {
    switch (state.tag) {
      case 'Unconfigured': {
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
        navigate("/");
        return;
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
        Unconfigured: 'Configure MFA',
        Initialised: 'Submit',
        Enabled: 'Dashboard'
      }[state.tag]}
    </Button>
  </>;
};

export default MfaForm;
