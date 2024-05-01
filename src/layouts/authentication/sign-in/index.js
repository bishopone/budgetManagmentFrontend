/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import api from "api";
// @mui icons
import MDSnackbar from "components/MDSnackbar";

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import CircularProgress from "@mui/material/CircularProgress";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const [errorSB, setErrorSB] = useState(false);
  const [error, setError] = useState("");
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [showPassword, setShowPassword] = useState(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Publice Finance Budget Manager"
      content={error}
      dateTime="Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  const handleSetRememberMe = () => {
    setRememberMe(!rememberMe);
    localStorage.removeItem("phone");
    localStorage.removeItem("rememberMe");
  };
  const handleSetUsername = (e) => setUsername(e.target.value);
  const handleSetPassword = (e) => setPassword(e.target.value);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };
  useEffect(() => {
    const storedusername = localStorage.getItem("phone");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe) {
      setRememberMe(true);
      setUsername(storedusername);
    }

    if (rememberMe && storedusername) {
      setUsername(storedusername);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(
        `users/login`,
        {
          PhoneNumber: username,
          Password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);

      if (response.status === 200) {
        const token = response.data.token;
        console.log(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("permission", JSON.stringify(response.data.permissions));
        if (rememberMe) {
          localStorage.setItem("phone", username);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("phone");
          localStorage.removeItem("rememberMe");
        }
        setIsLoading(false);
        history("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error.response?.data.message ?? "error !!");
      openErrorSB(true);
      // Handle error, show error message, etc.
    }
  };
  if (isLoading) {
    return (
      <BasicLayout image={bgImage}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <CircularProgress color="inherit" />
          </Grid>
        </Grid>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              ></MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              ></MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography
                component={MuiLink}
                href="#"
                variant="body1"
                color="white"
              ></MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                onChange={handleSetUsername}
                value={username}
                type="phone"
                label="Phone-Number"
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" mb={2}>
              <MDInput
                onKeyPress={handlePasswordKeyPress}
                onChange={handleSetPassword}
                value={password}
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
              />
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            {renderErrorSB}
            <MDBox mt={4} mb={1}>
              <MDButton onClick={handleSignIn} variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
