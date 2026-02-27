import { GoogleLogin } from "@react-oauth/google";
import axios from "../../services/apiClient";

export default function LoginPage() {
  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;

    await axios.post("/login", {
      clientID: id_token,
    });

    // After login, fetch user info
    window.location.href = "/";
  };

  return <div className="flex items-center justify-center min-h-screen bg-gray-50">
  <div className="bg-white p-8 rounded-xl shadow w-96 text-center">
    <h2 className="text-2xl font-semibold mb-6">
      Welcome to BookShare
    </h2>
    <GoogleLogin onSuccess={handleSuccess}/>
  </div>
</div>;
}