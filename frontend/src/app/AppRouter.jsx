// src/router/AppRouter.jsx
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
// import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> 
    </>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      // {
      //   path: "dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <Dashboard />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}