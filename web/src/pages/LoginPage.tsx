import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import icon from "../assets/trace-icon.png";
import { AuthData } from "../types/authTypes";
import { AuthContext } from "../components/Auth/authProvider";
import { fetchUserAuth } from "../components/api";

function LoginPage() {
  const [authData, setAuthData] = useState<AuthData>();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (authData) {
      login({
        accessToken: authData.accessToken,
        userId: authData.userId,
        email: authData.email,
        firstName: authData.firstName,
        lastName: authData.lastName,
      });
    }
  }, [authData, login]);

  const submitForm = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const request = await fetchUserAuth(loginData);
    setAuthData(request);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100vw",
      }}
    >
      <Box
        sx={{
          minHeight: "80vh",
          minWidth: "30vw",
          backgroundColor: "White",
          borderRadius: "8px",
          boxShadow: "2px 2px black",
        }}
      >
        <img src={icon} width="100px" height="100px" />
        <h1>Trace</h1>
        <h3>Welcome to Trace Asset Management</h3>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            variant="outlined"
            label="Username"
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <TextField
            variant="outlined"
            label="Password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <Button variant="contained" onClick={(e) => submitForm(e)}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
