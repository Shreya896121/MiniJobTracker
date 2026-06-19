import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { CreateApplication } from "./pages/CreateApplication";
import { EditApplication } from "./pages/EditApplication";
import { ApplicationDetail } from "./pages/ApplicationDetail";

type Page = "dashboard" | "create" | "edit" | "detail";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [editId, setEditId] = useState<string>("");

  const handleNavigate = (page: Page, id?: string) => {
    setCurrentPage(page);
    if (id) {
      setEditId(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onNavigate={handleNavigate} />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentPage === "dashboard" && (
          <Dashboard onNavigate={handleNavigate} />
        )}
        {currentPage === "create" && (
          <CreateApplication onNavigate={handleNavigate} />
        )}
        {currentPage === "edit" && (
          <EditApplication id={editId} onNavigate={handleNavigate} />
        )}
        {currentPage === "detail" && (
          <ApplicationDetail id={editId} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}

export default App;
