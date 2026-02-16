// src/App.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const App = () => {
  const handleSuccess = (credentialResponse) => {
    axios.post("http://localhost:8000/auth/login", {
      clientID : credentialResponse.credential
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Google Sign-In with React</h1>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default App;
