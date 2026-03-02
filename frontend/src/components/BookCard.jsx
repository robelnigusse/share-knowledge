

function BookCard({ book }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition border dark:border-gray-800 flex flex-col h-full">
      
      <div className="p-6 flex flex-col flex-grow gap-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
          {book.title}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 flex-grow">
          {book.description}
        </p>

        <button 
          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          onClick={() => window.open(book.downloadUrl, '_blank')}
        >
          Download
        </button>
      </div>
      
    </div>
  );
}

export default BookCard;