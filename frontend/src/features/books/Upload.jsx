import React, { useState, useContext } from 'react';
import api from "../../services/apiClient";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const { user, fetchUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("General");
  const [status, setStatus] = useState("idle"); 

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");

    const data = new FormData();
    data.append("file", file);
    data.append("category", category);

    try {
      
      const response = await api.post("/books", data);
      
      setStatus("success");
      
      await fetchUser(); 

      alert(`Success! Credits earned. Title extracted: ${response.data.message}`);
      navigate("/");
      
    } catch (error) {
      console.error("Upload failed", error);
      
      if (error.response?.status === 409) {
        alert("This book already exists in our library!");
      } else if (error.response?.status === 400) {
        alert(error.response.data.detail || "Invalid file or size.");
      } else {
        alert("Server error. Please try again later.");
      }
      setStatus("error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 transition-colors dark:bg-gray-950">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Upload Book</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
             PDFs only. AI will extract details automatically.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          
          <div className="relative group">
            <input
              type="file"
              accept="application/pdf"
              required
              disabled={status === "uploading"}
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className={`py-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
              file ? "border-blue-500 bg-blue-50/10" : "border-gray-300 dark:border-gray-700"
            }`}>
              <span className="text-3xl mb-2">{file ? "✅" : "📄"}</span>
              <p className="text-xs font-medium dark:text-gray-300 px-4 text-center truncate w-full">
                {file ? file.name : "Select PDF Book"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3.5 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              <option value="Programming">Programming</option>
              <option value="Science">Science</option>
            </select>
          </div>

          <button 
            disabled={status === "uploading" || !file}
            className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${
              status === "uploading" ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20"
            }`}
          >
            {status === "uploading" ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                AI Processing...
              </div>
            ) : "Upload & Earn 10 Credits"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;