import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="bg-white border-b dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          BookShare
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-6">

          <span className="text-sm text-gray-600 dark:text-gray-400">
            Credits:
            <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">
              3
            </span>
          </span>

          <button onClick={()=>navigate('/upload')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Upload
          </button>

          <button
            onClick={toggleDarkMode}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 transition"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 transition">
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;