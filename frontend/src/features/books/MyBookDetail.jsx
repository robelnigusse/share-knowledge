import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/apiClient";
import { BookList } from "../../components/BookList"; 
import { AuthContext } from "../../context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const MyBookDetail = () => {
  const { id } = useParams();
  const { user, fetchUser } = useContext(AuthContext); 
  const navigate = useNavigate()
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

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
      alert("You need at least 10 credits to download this book.");
      return;
    }

    try {
      const response = await api.get(`/books/download/${id}`);
      console.log(response?.data);
      window.open(response.data.file_url, "_blank");
      await fetchUser(); 
    } catch (error) {
      alert(error.response?.data?.detail || "Download failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
        const response = await api.delete(`/books/${book.id}`);
        alert(response?.data?.message)
        navigate('/my-books')
      } catch (error) {
        console.error("Error deleting book:", error);
      } 
    }

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
            
              <button 
                onClick={handleDelete}
                className="text-xs font-medium text-red-500 hover:underline"
              >
                Delete Content
              </button>
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