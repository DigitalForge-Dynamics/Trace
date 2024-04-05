import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface ILoginFormInput {
  username: string;
  password: string;
}

type LoginFormProps = {
  loginData: (data: ILoginFormInput) => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ loginData }) => {
  const [loginInformation, setLoginInformation] = useState<ILoginFormInput>({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInformation.username.length > 0 && loginInformation.password.length > 0) {
      loginData(loginInformation);
    }
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
