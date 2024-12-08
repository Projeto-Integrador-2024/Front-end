"use client";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Project {
  vaga_id: number;
  nome: string;
  tipo: string;
  bolsa: string;
  descricao: string;
}

const ITEMS_PER_PAGE = 4;

export default function Example() {
  const [items, setItems] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/ADMIN/GET_ALL/VAGA", {
        method: "GET",
        headers: { "User-Agent": "insomnia/10.0.0" }
      });
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/logout", { withCredentials: true });

      if (response.status === 200) {
        setIsAuthenticated(false);
        toast.success("Você foi desconectado com sucesso!"); // Toast de sucesso ao deslogar
        router.push("/login");
      } else {
        console.error("Erro no logout: Status diferente de 200", response);
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* ToastContainer adicionado no JSX */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="w-full bg-white text-stone-600 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" width={80} height={80} />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/sobre" className="hover:text-gray-300">Sobre</Link>
            <Link href="/contato" className="hover:text-gray-300">Contato</Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <UserIcon className="h-6 w-6 text-blue-600" />
                <button
                  type="button"
                  className="text-sm font-semibold text-slate-200 bg-red-600 hover:bg-red-700 rounded-md px-4 py-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-sm font-semibold text-slate-200 bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 flex flex-col justify-center items-center p-4">
        <h1 className="text-3xl font-bold mb-5 text-gray-800 mb-[2%]">Projetos disponíveis</h1>

        <div className="w-full max-w-4xl flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-xs px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {paginatedItems.map((item) => (
              <li key={item.vaga_id} className="py-4 px-6 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold text-gray-900">{item.nome}</p>
                    <p className="text-sm text-gray-600">{item.tipo}</p>
                    <p className="text-sm text-gray-600">{item.bolsa}</p>
                    <p className="text-sm text-gray-600">{item.descricao}</p>
                    <p className="text-xs text-gray-500">Vaga ID: {item.vaga_id}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{" "}
                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}</span> de{" "}
                <span className="font-medium">{filteredItems.length}</span> resultados
              </p>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === index + 1 ? "bg-gray-700 text-slate-200" : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-50"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-5 text-slate-800 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="mb-0">1233 Via Rosalina, Campo-Mourão, PR | suporte@ppe.com.br | (44) 91234-1234</p>
          <p className="text-sm">COPYRIGHT © 2024. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}
