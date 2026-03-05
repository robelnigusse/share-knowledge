import { useState, useEffect, useContext } from "react";
import MyBook from "../../components/MyBook";
import api from "../../services/apiClient";
import { AuthContext } from "../../context/AuthContext";

export const MyBooks = ({ search = true, category }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await api.get("/books/me");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="space-y-8">
      
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          ))
        ) : books.length > 0 ? (
          books.map((book) => <MyBook key={book.id} book={book} />)
        ) : (
          <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
            <p className="text-xl font-medium text-gray-500">
              You have not Uploaded any Books
            </p>
          </div>
        )}
      </section>
    </div>
  );
};