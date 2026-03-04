import { BookList } from "../../components/BookList";
function Home() {
 
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        
        <header className="flex flex-col gap-4 text-center md:text-left border-l-4 border-blue-600 pl-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Discover & Share <span className="text-blue-600">Books</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Upload your books, earn credits, and explore what others are sharing.
          </p>
        </header>
        <BookList />        
      </main>
    </div>
  );
}

export default Home;