import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import BookCard from "../../components/BookCard";


function Home() {
  const books = [
    {
      id: 1,
      image: "monte.jpg",
      title: "The Republic of Thieves",
      author: "Scott Lynch",
      description: "A handbook of agile software craftsmanship."
    },
    {
      id: 2,
      image: "valour.jpg",
      title: "Valour",
      author: "John Gwynne",
      description: "Journey to mastery and better software development."
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredBooks = books.filter((book) => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) return true;

    return book.title.toLowerCase().includes(query);
  });

  const isSearching = searchTerm !== debouncedSearch;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">

        <section className="flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
            Discover & Share Great Books
          </h1>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Upload your books, earn credits, and explore what others are sharing.
          </p>
        </section>

        <section>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              🔍
            </span>
          </div>

          {isSearching && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Searching...
            </p>
          )}
        </section>

        <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-lg text-gray-500 dark:text-gray-400">
                No books found.
              </p>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Home;