import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ensure this is imported

import Home from "../features/home/Home";
import Login from "../features/auth/Login";
import Navbar from "../components/NavBar";
import Upload from "../features/books/Upload";
import BookDetails from "../features/books/BookDetails"; // You'll create this next
import { BookList } from "../components/BookList";
import { MyBooks } from "../features/books/MyBooks";
import MyBookDetail from "../features/books/MyBookDetail";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      // New dynamic route for book details
      { path: "book/:id", element: <BookDetails /> },
      { path: "books", element: <BookList /> },
      {
        path: "my-books",
        element: (
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-books/:id",
        element: (
          <ProtectedRoute>
            <MyBookDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload",
        element: (
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
