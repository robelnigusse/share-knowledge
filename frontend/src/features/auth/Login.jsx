import { GoogleLogin } from "@react-oauth/google";
import axios from "../../services/apiClient";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";

export default function LoginPage() {
  const { user, fetchUser } = useContext(AuthContext);
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  // const handleSuccess = async (credentialResponse) => {
  //   try {
  //     const response = await axios.post("/login", {
  //       clientID: credentialResponse.credential
  //     });

  //     await fetchUser();

  //     navigate("/");

  //   } catch (error) {
  //     console.error("Login Error:", error);
  //   }
  // };
  if (user) {
    navigate("/");
  }
  //  const handleSuccess = async (credentialResponse) => {

  //   axios.post("/login", {

  //     clientID : credentialResponse.credential

  //   }).then((response) => {

  //     console.log(response.data);

  //     // navigate("/");

  //   }).catch((error) => {

  //     console.log(error);

  //   })
  //   await fetchUser();

  // };
  const handleSuccess = async (credentialResponse) => {
    try {
      await axios.post("/login", {
        clientID: credentialResponse.credential,
      });

      const loggedUser = await fetchUser();

      navigate("/");
      if (loggedUser) {
        showMessage(`Welcome ${loggedUser?.name}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  useEffect(() => {
    if (user) ;
  }, [user]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="Read"
              />
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            BookShare
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Join our community of readers.
          </p>
        </div>

        <div className="flex justify-center py-4 px-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => showMessage("Login Failed", 'error')}
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          New here?{" "}
          <button
            onClick={() => navigate("/books")}
            className="text-blue-600 hover:underline font-medium"
          >
            Browse Books
          </button>
        </p>
      </div>
    </div>
  );
}
