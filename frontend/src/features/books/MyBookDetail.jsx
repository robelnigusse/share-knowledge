import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/apiClient";
import { BookList } from "../../components/BookList"; 
import { AuthContext } from "../../context/AuthContext"; 
import { useMessage } from "../../context/MessageContext";

const MyBookDetail = () => {
  const { id } = useParams();
  const { user, fetchUser } = useContext(AuthContext); 
  const { showMessage } = useMessage();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
    window.scrollTo(0, 0);
  }, [id]);

  const handleDownload = async () => {
    if (user.credits < 10) {
      showMessage("You need at least 10 credits to download this book.", 'error');
      return;
    }
    try {
      const response = await api.get(`/books/download/${id}`);
      window.open(response.data.file_url, "_blank");
      await fetchUser(); 
      showMessage("Download started! 10 credits deducted.", "success");
    } catch (error) {
      showMessage(error.response?.data?.detail || "Download failed", 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/books/${book.id}`);
      showMessage(response?.data?.message || "Book deleted", "success");
      await fetchUser();
      navigate('/my-books');
    } catch (error) {
      showMessage(error.response?.data?.detail || "Delete failed", 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="py-20 text-center dark:text-white">Loading...</div>;
  if (!book) return <div className="py-20 text-center dark:text-white">Book not found.</div>;

  const cleanTitle = decodeURIComponent(book.title).replace(".pdf", "");

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              {book.category}
            </span>
            {user?.id === book.owner_id && (
              <button 
                onClick={() => setIsDeleting(true)}
                className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Book
              </button>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            {cleanTitle}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-10">
            {book.description}
          </p>

          <button 
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95"
          >
            <span>Download (10 Credits)</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" />
            </svg>
          </button>
        </div>
      </div>

      {isDeleting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsDeleting(false)}
          ></div>
          
          {/* Modal Card */}
          <div className="relative bg-white dark:bg-gray-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Are you sure?
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
              This action cannot be undone. This will permanently delete <span className="font-semibold">"{cleanTitle}"</span>.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleting(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          More in <span className="text-blue-600">{book.category}</span>
        </h2>
        <BookList search={false} category={book.category} />
      </section>
    </div>
  );
};

export default MyBookDetail;