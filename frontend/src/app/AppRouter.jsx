// src/router/AppRouter.jsx
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Home from "../features/home/Home";
import Login from "../features/auth/Login";
// import Dashboard from "../pages/Dashboard";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import Upload from "../features/books/Upload";

function Layout() {
 return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-950 transition-colors">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
      <Outlet />
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

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
      { path: "upload", element: <Upload /> },
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