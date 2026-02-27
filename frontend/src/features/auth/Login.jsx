import { GoogleLogin } from "@react-oauth/google";
import axios from "../../services/apiClient";

function LoginPage() {
  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;

    await axios.post("/login", {
      clientID: id_token,
    });

    window.location.href = "/";
  };

  return <GoogleLogin onSuccess={handleSuccess} />;
}