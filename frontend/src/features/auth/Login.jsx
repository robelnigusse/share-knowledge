import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../context/UserContext";
import apiClient from "../api/apiClient"; // axios instance

export default function Login() {
  const { login } = useUser();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await apiClient.post("/auth/login", {
        clientID: credentialResponse.credential,
      });

      login({ user: res.data.user, token: res.data.token });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}