'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from "next/link";

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
  inscritos: string[];
};

export default function AlunoDashboard() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [myVagas, setMyVagas] = useState<Vaga[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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
        }
      } catch (error) {
        router.push('/login');
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
        setMyVagas(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar minhas vagas:', error);
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
        fetchVagas();
        fetchMyVagas();
      }
    } catch (error) {
      console.error('Erro ao inscrever na vaga:', error);
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

  const paginatedVagas = vagas
    .filter((vaga) => !myVagas.some((myVaga) => myVaga.vaga_id === vaga.vaga_id))
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const generatePaginationButtons = () => {
    const visiblePages = 5; // Número máximo de páginas a serem exibidas
    let pages = [];

    if (totalPages <= visiblePages) {
      // Exibe todas as páginas se totalPages for menor ou igual ao limite
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Caso contrário, gera páginas dinamicamente
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) pages.push(1); // Adiciona o botão para a primeira página
      if (startPage > 2) pages.push(-1); // Reticências

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) pages.push(-1); // Reticências
      if (endPage < totalPages) pages.push(totalPages); // Adiciona o botão para a última página
    }

    return pages.map((page, index) =>
      page === -1 ? (
        <span key={index} className="px-2 py-2 text-gray-500">
          ...
        </span>
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
    <div>
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
                
                <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-slate-200 bg-red-600 hover:bg-red-700 rounded-md px-4 py-2"
                    >
                    Logout
                </button>
            </nav>
            </div>
        </header>

        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="relative w-1/2">
            <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Dashboard do Aluno</h2>

            <h3 className="text-xl font-semibold mb-4">Vagas Inscritas</h3>
            <ul className="mb-4">
                {myVagas.map((vaga) => (
                <li key={vaga.vaga_id} className="border-b py-2">
                    <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                    <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                    <div className="text-gray-700">bolsa: {vaga.bolsa}</div>
                    <div className="text-gray-700">Valor da bolsa: {vaga.bolsa_valor}</div>
                    <div className="text-gray-700">tipo: {vaga.tipo}</div>
                    <div className="text-gray-700">Professor: {vaga.criador_id}</div>
                    <div className="text-gray-700">Inscritos: {vaga.inscritos}</div>
                    <button
                    onClick={() => handleDesinscreverVaga(vaga.vaga_id)}
                    className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 mt-2"
                    >
                    Desinscrever-se
                    </button>
                </li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mb-4">Vagas Disponíveis</h3>
            <div className="max-h-96 overflow-y-auto mb-4">
                <ul>
                {paginatedVagas.map((vaga) => (
                    <li key={vaga.vaga_id} className="border-b py-2">
                        <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                        <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                        <div className="text-gray-700">bolsa: {vaga.bolsa}</div>
                        <div className="text-gray-700">Valor da bolsa: {vaga.bolsa_valor}</div>
                        <div className="text-gray-700">tipo: {vaga.tipo}</div>
                        <div className="text-gray-700">Professor: {vaga.criador_id}</div>
                        <div className="text-gray-700">Inscritos: {vaga.inscritos}</div>
                    <button
                        onClick={() => handleInscreverVaga(vaga.vaga_id)}
                        className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 mt-2"
                    >
                        Inscrever-se
                    </button>
                    </li>
                ))}
                </ul>
            </div>

            <div className="flex items-center justify-center space-x-2 mt-4">
                <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-l-md ${
                    currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                >
                <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {generatePaginationButtons()}

                <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-r-md ${
                    currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                >
                <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}
