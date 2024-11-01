"use client";
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from "next/navigation";



// Define a interface para o tipo dos itens
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
  const router = useRouter();
  // Carrega os itens da API ao carregar o componente
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/VAGA/GET_ALL", {
        method: "GET",
        headers: {
          "User-Agent": "insomnia/10.0.0"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); // para verificar os dados recebidos
      setItems(data); // armazena os dados no estado `items`
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };
  

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className='min-h-screen flex flex-col'>
      <header className="w-full bg-gray-800 text-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" width={80} height={80} />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/sobre" className="hover:text-gray-300">Sobre</Link>
            <Link href="/contato" className="hover:text-gray-300">Contato</Link>
            <button
              type="button"
              className="text-sm font-semibold text-slate-200 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md px-4 py-2 transition duration-150"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 flex flex-col justify-center items-center p-4">
        <h1 className="text-3xl font-bold mb-5 text-gray-800">Projetos disponíveis</h1>
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {paginatedItems.map((item) => (
                <li key={item.vaga_id} className="py-4 px-6 cursor-pointer hover:bg-gray-50 group">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {item.nome}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">{item.tipo}</p>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">{item.bolsa}</p>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">{item.descricao}</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600">Vaga ID: {item.vaga_id}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, items.length)}</span> de{' '}
                <span className="font-medium">{items.length}</span> resultados
              </p>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageClick(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === index + 1 ? 'bg-gray-700 text-slate-200' : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 py-5 text-slate-200 text-sm" id="contact">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="lg:w-1/2 w-full text-center lg:text-left mb-4 lg:mb-0">
              <p className="mb-2">1233 Via Rosalina, Campo-Mourão, PR</p>
              <div className="flex flex-col sm:flex-row items-center sm:justify-start sm:space-x-4">
                <p className="mb-2">
                  <a className="hover:underline" href="mailto:suporte@ppe.com.br">suporte@ppe.com.br</a>
                </p>
                <p className="mb-0">
                  <a className="hover:underline" href="tel:+44823456788">(44) 91234-1234</a>
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full text-center lg:text-right">
              <div className="flex justify-center lg:justify-end space-x-4 mb-4">
                <a href="#" aria-label="Facebook" className="text-slate-200 hover:text-blue-500 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter" className="text-slate-200 hover:text-blue-400 transition-colors">
                  <i className="fab fa-twitter-alt"></i>
                </a>
                <a href="#" aria-label="Instagram" className="text-slate-200 hover:text-pink-500 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p className="text-sm">
                COPYRIGHT © 2024. TODOS OS DIREITOS RESERVADOS.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  ); 
}
