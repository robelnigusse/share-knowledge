import { Link } from "react-router-dom";

function MyBook({ book }) {
  
  const cleanTitle = decodeURIComponent(book.title || "Untitled Book")
    .replace(/\.pdf$/i, "");
    console.log(book)

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden">
      
      <div className="p-6 flex flex-col flex-grow gap-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
            {book.category || "General"}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors capitalize">
          {cleanTitle}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow leading-relaxed">
          {book.description || "No description available for this book."}
        </p>

        <Link
          to={`/my-books/${book.id}`}
          className="mt-4 w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
        >
          View Detail
          <span className="text-lg">→</span>
        </Link>
      </div>
    </div>
  );
}

export default MyBook;