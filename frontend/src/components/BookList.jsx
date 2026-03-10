import { useState, useEffect, useContext } from "react";
import BookCard from "./BookCard";
import api from "../services/apiClient";
import { AuthContext } from "../context/AuthContext";

export const BookList = ({ search = true, category }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    next_page: null,
    prev_page: null,
    total: 0,
  });

  const { user } = useContext(AuthContext);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    if (!search) return;
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          page_size: 6,
          search: search ? debouncedSearch : category,
        };

        const response = await api.get("/books/", { params });
        console.log("Fetched books:", response.data);

        setBooks(response.data.data);
        setPaginationInfo({
          next_page: response.data.next_page,
          prev_page: response.data.prev_page,
          total: response.data.total,
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearch, category, search, currentPage]);

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

      {!loading && books.length > 0 && (
        <div className="flex flex-col items-center space-y-4 pt-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Total {paginationInfo.total} Books found
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={!paginationInfo.prev_page}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm group"
              aria-label="Previous Page"
            >
              <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500">
                ←
              </span>
            </button>

            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
              <span className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 text-sm font-bold">
                {currentPage}
              </span>

              <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                of {Math.ceil(paginationInfo.total / 6)}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!paginationInfo.next_page}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm group"
              aria-label="Next Page"
            >
              <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500">
                →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
