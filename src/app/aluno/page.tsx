'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/20/solid';
import Link from "next/link";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
const ITEMS_PER_PAGE = 4;

type Vaga = {
  vaga_id: number;
  nome: string;
  descricao: string;
  bolsa: number;
  bolsa_valor: number;
  tipo: number;
  criador_id: string;
  candidatos: string[];
  favoritos: string;
  alunos_selecionados: string;
};

export default function AlunoDashboard() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [myVagas, setMyVagas] = useState<Vaga[]>([]);
  const [favoritadas, setFavoritadas] = useState<Vaga[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [favoritarError, setFavoritarError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/check-auth`, {
          withCredentials: true,
        });
        if (response.status !== 200 && response.status !== 304) {
          router.push('/login');
        } else {
          fetchVagas();
          fetchMyVagas();
          fetchFavoritadas();
        }
      } catch (error) {
        console.log("Erro de autenticação.");
      }
    };

    checkAuth();
  }, [router]);

  const fetchVagas = async () => {
    try {
      const response = await axios.get(`${baseURL}/GET_ALL_VAGAS`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setVagas(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  const fetchMyVagas = async () => {
    try {
      const response = await axios.get(`${baseURL}/ALUNO/GET_MY_VAGAS`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // Mapear a chave "id" para "vaga_id" para compatibilidade com o tipo Vaga
        const vagasMapeadas = response.data.map((vaga: any) => ({
          ...vaga,
          vaga_id: vaga.id,
        }));
        setMyVagas(vagasMapeadas);
      }
    } catch (error) {
      console.error('Erro ao buscar minhas vagas:', error);
    }
  };

  const fetchFavoritadas = async () => {
    try {
      const response = await axios.get(`${baseURL}/ALUNO/GET_FAVORITADAS`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFavoritadas(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas favoritadas:', error);
    }
  };

  const handleInscreverVaga = async (id: number) => {
    try {
      const response = await axios.post(
        `${baseURL}/ALUNO/INSCREVER`,
        { id },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        console.log('Inscrição realizada com sucesso!');
        fetchVagas();
        fetchMyVagas();
      } else {
        console.error(`Erro ao inscrever: status ${response.status}`);
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Erro na resposta:', error.response.data);
      } else if (error.request) {
        console.error('Erro na requisição:', error.request);
      } else {
        console.error('Erro ao inscrever na vaga:', error.message);
      }
    }
  };

  const handleDesinscreverVaga = async (id: number) => {
    try {
      const response = await axios.post(
        `${baseURL}/ALUNO/DESINSCREVER`,
        { id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        fetchVagas();
        fetchMyVagas();
      }
    } catch (error) {
      console.error('Erro ao desinscrever da vaga:', error);
    }
  };

  const handleFavoritarVaga = async (id: number) => {
    try {
      const response = await axios.post(
        `${baseURL}/ALUNO/FAVORITAR_VAGA`,
        { id_vaga: id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Vaga favoritada com sucesso!');
        fetchVagas();
        fetchFavoritadas();
        setFavoritarError(null);
      } else {
        console.error('Erro ao favoritar a vaga:', response.data);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.data.erro === "Vaga já favoritada") {
          toast.error("Essa vaga já foi favoritada.");
        } else {
          toast.error("Erro ao favoritar a vaga.");
        }
      } else {
        toast.error("Erro desconhecido ao tentar favoritar a vaga.");
      }
      console.error('Erro ao favoritar a vaga:', error);
    }
  };

  // New function to "desfavoritar" (remove favorite)
  const handleDesfavoritarVaga = async (id: number) => {
    try {
      const response = await axios.post(
        `${baseURL}/ALUNO/DESFAVORITAR_VAGA`,
        { id_vaga: id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log('Vaga removida dos favoritos com sucesso!');
        fetchFavoritadas();
      }
    } catch (error: any) {
      if (error.response) {
        toast.error("Erro ao desfavoritar a vaga.");
      } else {
        toast.error("Erro desconhecido ao desfavoritar a vaga.");
      }
      console.error('Erro ao desfavoritar a vaga:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${baseURL}/logout`, { withCredentials: true });
      if (response.status === 200) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const totalPages = Math.ceil(vagas.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const paginatedVagas = vagas
    .filter((vaga) => !myVagas.some((myVaga) => myVaga.vaga_id === vaga.vaga_id))
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const generatePaginationButtons = () => {
    const visiblePages = 5;
    let pages = [];

    if (totalPages <= visiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      if (startPage > 1) pages.push(1);
      if (startPage > 2) pages.push(-1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) pages.push(-1);
      if (endPage < totalPages) pages.push(totalPages);
    }

    return pages.map((page, index) =>
      page === -1 ? (
        <span key={index} className="px-2 py-2 text-gray-500">...</span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          className={`px-4 py-2 ${
            currentPage === page
              ? 'bg-gray-700 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
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
            <Link href="/projetos" className="hover:text-gray-300">Projetos</Link>
            <Link href="/contato" className="hover:text-gray-300">Contato</Link>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-200 bg-red-600 hover:bg-red-700 rounded-md px-4 py-2"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center bg-gray-100">
        <div className="relative w-full max-w-4xl p-6 bg-white rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Dashboard do Aluno</h2>

          {/* Accordion for Inscribed Vacancies */}
          <div className="border-b">
            <button
              onClick={toggleAccordion}
              className="flex justify-between items-center w-full py-2 text-lg font-semibold text-gray-700"
            >
              Vagas Inscritas ({myVagas.length} {myVagas.length === 1 ? 'vaga inscrita' : 'vagas inscritas'})
              {isAccordionOpen ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isAccordionOpen ? '500px' : '0' }}
            >
              {myVagas.map((vaga) => (
                <div key={vaga.vaga_id} className="p-4 border rounded-md mb-2 bg-gray-50">
                  <p className="text-gray-700"><strong>Vaga:</strong> {vaga.nome}</p>
                  <p className="text-gray-700"><strong>Descrição:</strong> {vaga.descricao}</p>
                  <button
                    onClick={() => handleDesinscreverVaga(vaga.vaga_id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
                  >
                    Desinscrever-se
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Vacancies */}
          <h3 className="text-xl font-semibold mb-4 mt-6">Vagas Disponíveis</h3>
          {paginatedVagas.map((vaga) => (
            <div key={vaga.vaga_id} className="p-4 border rounded-md mb-2">
              <p className="text-gray-700"><strong>Vaga:</strong> {vaga.nome}</p>
              <p className="text-gray-700"><strong>Descrição:</strong> {vaga.descricao}</p>
              <button
                onClick={() => handleInscreverVaga(vaga.vaga_id)}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mt-2"
              >
                Inscrever-se
              </button>
              <button
                onClick={() => handleFavoritarVaga(vaga.vaga_id)}
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 mt-2"
              >
                Favoritar
              </button>
              {favoritarError && (
                <p className="text-red-500 mt-2">{favoritarError}</p>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevious}
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex space-x-2">{generatePaginationButtons()}</div>
            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setIsSliderOpen(true)}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div
            className={`fixed inset-y-0 right-0 w-80 bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
              isSliderOpen ? 'translate-x-0' : 'translate-x-full'
            } overflow-y-auto`}
          >
            <button
              onClick={() => setIsSliderOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Vagas Favoritadas</h3>
            {favoritadas.length > 0 ? (
              favoritadas.map((vaga) => (
                <div key={vaga.vaga_id} className="p-4 border rounded-md mb-2 bg-gray-50">
                  <p className="text-gray-700"><strong>Vaga:</strong> {vaga.nome}</p>
                  <p className="text-gray-700"><strong>Descrição:</strong> {vaga.descricao}</p>
                  <button
                    onClick={() => handleDesfavoritarVaga(vaga.vaga_id)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-2"
                  >
                    Desfavoritar
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Você ainda não favoritou nenhuma vaga.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
