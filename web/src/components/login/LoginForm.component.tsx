import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface ILoginFormInput {
  username: string;
  password: string;
  mfaCode: string;
}

type LoginFormProps = {
  loginData: (data: ILoginFormInput) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ loginData }) => {
  const [loginInformation, setLoginInformation] = useState<ILoginFormInput>({
    username: "",
    password: "",
    mfaCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInformation.username.length === 0) return;
    if (loginInformation.password.length === 0) return;
    if (![0, 6].includes(loginInformation.mfaCode.length)) return;
    if (!/^[0-9]{0,6}$/.test(loginInformation.mfaCode)) return;
    loginData(loginInformation);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 4, width: "15vw" }}
    >
      <TextField
        id="usernameTextField"
        data-testid="testid-usernameTextField"
        label="Username"
        onChange={(e) =>
          setLoginInformation({
            ...loginInformation,
            username: e.target.value,
          })
        }
      />
      <TextField
        id="passwordTextField"
        type="password"
        data-testid="testid-passwordTextField"
        label="Password"
        onChange={(e) =>
          setLoginInformation({
            ...loginInformation,
            password: e.target.value,
          })
        }
      />
      <TextField
        id="mfaCodeTextField"
        type="number"
        data-testid="testid-mfaCodeTextField"
        label="MFA Code"
        onChange={(e) => 
          setLoginInformation({
            ...loginInformation,
            mfaCode: e.target.value,
          })
        }
      />
      <Button
        id="loginButton"
        data-testid="testid-loginButton"
        variant="contained"
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
