import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import icon from "../assets/trace-icon.png";
import { AuthData } from "../types/authTypes";
import { AuthContext } from "../components/Auth/authProvider";
import { fetchUserAuth } from "../components/api";
import background from "../assets/login-background.jpg";

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
    <Box sx={{ height: "100vh", display: "flex" }}>
      <img style={{ width: "55vw", height: "100vh" }} src={background} />
      <Paper
        square
        elevation={8}
        sx={{
          maxHeight: "100vh",
          width: "45vw",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          pt: 10,
          overflow: "hidden",
        }}
      >
        <img style={{ width: "175px", height: "175px" }} src={icon} />
        <Typography variant="h4">Welcome to Trace</Typography>
        <Box sx={{ minWidth: '20vw', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TextField label="Username" />
          <TextField label="Password" />
          <Button variant="contained">Login</Button>
        </Box>
        <Typography sx={{ color: "#555555", pt: 8 }}>
          Trace Asset Management - {new Date().getFullYear()} &copy;
          DigitalForge Dynamics
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;
