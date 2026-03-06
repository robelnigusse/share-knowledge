import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMessage } from "../../context/MessageContext";
import api from "../../services/apiClient";

const Profile = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const { showMessage } = useMessage();
  
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return showMessage("Name cannot be empty", "error");
    
    setIsUpdating(true);
    try {
      await api.put("/me", { name: newName });
      await fetchUser(); 
      showMessage("Profile updated successfully!", "success");
    } catch (error) {
      showMessage(error.response?.data?.detail || "Update failed", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your profile and viewing preferences</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center gap-2 w-fit">
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{user?.credits} Credits Available 🪙</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-blue-500/20">
              {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold dark:text-white truncate w-full">{user?.name || "Member"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full">{user?.email}</p>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
            <h3 className="font-bold mb-2">Member Since</h3>
            <p className="text-blue-100 text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"}
            </p>
          </div>
        </div>

        {/* Right Col: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold dark:text-white border-b dark:border-gray-800 pb-4">Personal Information</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
              <input 
                type="text"
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                placeholder="Enter your name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="space-y-2 opacity-60">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address (Read Only)</label>
              <input 
                type="email"
                disabled
                className="w-full px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border-none cursor-not-allowed dark:text-gray-400"
                value={user?.email || ""}
              />
              <p className="text-[10px] text-gray-400 ml-1">Email is managed via Google Auth and cannot be changed.</p>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={isUpdating || newName === user?.name}
                className="w-full md:w-auto px-10 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;