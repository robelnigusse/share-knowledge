import { useState, useEffect, useContext } from "react";
import BookCard from "./BookCard";
import api from "../services/apiClient";
import { AuthContext } from "../context/AuthContext";

export const BookList = ({ search = true, category }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = search 
          ? { search: debouncedSearch } 
          : { search: category };

        const response = await api.get("/books/", { params });
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, category, search]);

  return (
    <div className="space-y-8">
      {search && (
        <section className="relative group max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 group-focus-within:text-blue-500 transition-colors">
              🔍
            </span>
          </div>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-sm"
          />
        </section>
      )}

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          ))
        ) : books.length > 0 ? (
          books.map((book) => <BookCard key={book.id} book={book} />)
        ) : (
          <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
            <p className="text-xl font-medium text-gray-500">
              {search 
                ? `No books found matching "${debouncedSearch}"` 
                : `No books available in ${category}`}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};