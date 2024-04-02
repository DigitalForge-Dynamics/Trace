import { useContext, useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import icon from "../../assets/trace-icon.png";
import { AuthData } from "../../utils/types/authTypes";
import { AuthContext } from "../../context/auth.context";
import { UserLoginData, fetchUserTokens, decodeUserAuth } from "../../data/api";
import background from "../../assets/login-background.jpg";
import LoginForm from "../../components/login/LoginForm.component";

function LoginPage() {
  const [authData, setAuthData] = useState<AuthData>();
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

  const submitForm = async (data: UserLoginData) => {
    const tokens = await fetchUserTokens(data);
    const tokenAuthData = decodeUserAuth(tokens);
    setAuthData(tokenAuthData);
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
        <LoginForm loginData={submitForm} />
        <Typography sx={{ color: "#555555", pt: 8 }}>
          Trace Asset Management - {new Date().getFullYear()} &copy;
          DigitalForge Dynamics
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;
