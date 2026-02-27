function BookCard({ book }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border dark:border-gray-800">

      <div className="h-56 overflow-hidden">
        <img
          src={`/images/${book.image}`}
          alt={book.title}
          className="w-full h-full object-contain hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-5 flex flex-col gap-3">

        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {book.title}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          by {book.author}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {book.description}
        </p>

        <button className="mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          View Details
        </button>

      </div>
    </div>
  );
}

export default BookCard;