'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from "next/link";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

// Definindo o tipo para os alunos selecionados
type AlunoSelecionado = {
  ra: string;
  nome: string;
  periodo: string;
}

type Vaga = {
  vaga_id?: number;
  nome: string;
  descricao: string;
  bolsa: number;
  bolsa_valor: number;
  tipo: number;
  criador_id?: string;
  inscritos?: string[]; // Lista de alunos inscritos
  selecionados?: AlunoSelecionado[]; // Lista de alunos selecionados
}

export default function ProfessorDashboard() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [newVagas, setNewVagas] = useState<Vaga[]>([{ nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
  const [editVaga, setEditVaga] = useState<Vaga | null>(null); // Vaga em edição
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado para controlar a abertura do acordeão para cada vaga (utilizando o id da vaga)
  const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({});

  const toggleAccordion = async (id: number) => {
    if (openAccordions[id]) {
      setOpenAccordions((prev) => ({ ...prev, [id]: false }));
      return;
    }
    try {
      const response = await axios.get(`${baseURL}/PROFESSOR/GET_SELECIONADOS`, {
        params: { id_vaga: id },
        withCredentials: true
      });
      if (response.status === 200) {
        setVagas((prevVagas) =>
          prevVagas.map((vaga) =>
            vaga.vaga_id === id ? { ...vaga, selecionados: response.data } : vaga
          )
        );
      }
    } catch (error) {
      console.error("Erro ao buscar alunos selecionados:", error);
    }
    setOpenAccordions((prev) => ({ ...prev, [id]: true }));
  };

  const fetchVagas = async () => {
    try {
      const response = await axios.get(`${baseURL}/PROFESSOR/GET_MY/VAGA`, {
        withCredentials: true
      });
      if (response.status === 200) {
        console.log("Dados das vagas:", response.data);
        setVagas(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/check-auth`, {
          withCredentials: true
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          fetchVagas();
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (index: number, field: string, value: any) => {
    const updatedVagas = [...newVagas];
    updatedVagas[index] = { ...updatedVagas[index], [field]: value };
    setNewVagas(updatedVagas);
  };

  const handleEditChange = (field: string, value: any) => {
    if (editVaga) {
      if (field === 'bolsa' && value === 0) {
        // Quando "Bolsa" for "Não", limpar o valor da bolsa
        setEditVaga({ ...editVaga, [field]: value, bolsa_valor: 0 });
      } else {
        setEditVaga({ ...editVaga, [field]: value });
      }
    }
  };

  const handleEditVaga = (vaga: Vaga) => {
    setEditVaga(vaga);
  };

  const handleUpdateVaga = async () => {
    if (!editVaga) return;
    try {
      const response = await axios.put(
        `${baseURL}/PROFESSOR/UPDATE/VAGA`,
        {
          ...editVaga,
          id: editVaga.vaga_id,
          criador_id: '1234567'
        },
        {
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setEditVaga(null); // Fecha o modal
        fetchVagas();
      }
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
    }
  };

  const handleDeleteVaga = async (id: number) => {
    try {
      const response = await axios.delete(`${baseURL}/PROFESSOR/DELETE/VAGA`, {
        data: { id },
        withCredentials: true
      });
      if (response.status === 201) {
        fetchVagas();
      }
    } catch (error) {
      console.error("Erro ao deletar vaga:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${baseURL}/logout`, { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(false); // Definindo como não autenticado
        router.push("/login"); // Redireciona para a página de login após logout
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleSelectAluno = async (vagaId: number, alunoRa: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/PROFESSOR/SELECIONAR_ALUNOS`,
        {
          id_vaga: vagaId,
          alunos_ra: [alunoRa]
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert('Aluno selecionado com sucesso!');
        fetchVagas(); // Atualiza a lista de vagas
      }
    } catch (error) {
      console.error('Erro ao selecionar aluno:', error);
    }
  };

  const handleDeselectAluno = async (vagaId: number, alunoRa: string) => {
    try {
      const response = await axios.post(
        `${baseURL}/PROFESSOR/DESSELECIONAR_ALUNOS`,
        {
          id_vaga: vagaId,
          alunos_ra: [alunoRa]
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert('Aluno desselecionado com sucesso!');
        fetchVagas(); // Atualiza a lista de vagas
      }
    } catch (error) {
      console.error('Erro ao desselecionar aluno:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
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

      <div className="flex justify-center items-center flex-1 bg-gray-100">
        <div className="w-full md:w-1/2 bg-white p-6 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Dashboard do Professor</h2>
          <div className="max-h-96 overflow-y-auto mb-4">
            <ul>
              {vagas.map((vaga) => (
                <li key={vaga.vaga_id} className="border-b py-2">
                  <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                  <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                  <div className="text-gray-700">
                    Bolsa: {vaga.bolsa === 0 ? 'Não possui bolsa' : 'Possui bolsa'}
                  </div>
                  <div className="text-gray-700">
                    Valor da Bolsa: {vaga.bolsa === 0 ? 'N/A' : vaga.bolsa_valor}
                  </div>
                  <div className="text-gray-700">
                    Tipo: {vaga.tipo === 0 ? 'Pesquisa' : 'Extensão'}
                  </div>
                  <div className="text-gray-700 mt-2">
                    <span className="font-semibold">Inscritos:</span>
                    {vaga.inscritos && vaga.inscritos.length > 0 ? (
                      <ul className="list-disc pl-5 mt-1">
                        {vaga.inscritos.map((aluno, index) => {
                          // Verifica se existe algum aluno selecionado cujo RA seja igual
                          const isSelecionado = vaga.selecionados?.some((sel) => sel.ra === aluno);
                          return (
                            <li key={index} className="flex justify-between items-center">
                              {aluno}
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSelectAluno(vaga.vaga_id!, aluno)}
                                  className={`bg-green-500 text-white p-1 rounded-md hover:bg-green-700 ${
                                    isSelecionado ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={isSelecionado}
                                >
                                  Selecionar
                                </button>
                                <button
                                  onClick={() => handleDeselectAluno(vaga.vaga_id!, aluno)}
                                  className="bg-red-500 text-white p-1 rounded-md hover:bg-red-700"
                                >
                                  Desselecionar
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <span className="text-gray-500"> Nenhum inscrito</span>
                    )}
                  </div>

                  {/* Acordeão para alunos selecionados */}
                  <div className="mt-2">
                    <button
                      onClick={() => toggleAccordion(vaga.vaga_id!)}
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md focus:outline-none"
                    >
                      Alunos Selecionados {openAccordions[vaga.vaga_id!] ? '-' : '+'}
                    </button>
                    {openAccordions[vaga.vaga_id!] && (
                      <div className="mt-2 p-2 border border-gray-300 rounded-md">
                        {vaga.selecionados && vaga.selecionados.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {vaga.selecionados.map((aluno, index) => (
                              <li key={index}>
                                Nome:{aluno.nome}  RA:{aluno.ra} 
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">Nenhum aluno selecionado</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteVaga(vaga.vaga_id!)}
                    className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 mt-2 mr-2"
                  >
                    Deletar
                  </button>
                  <button
                    onClick={() => handleEditVaga(vaga)}
                    className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 mt-2"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => router.push('/professor-dashboard/criarvaga')}
            className="bg-green-500 text-white p-2 rounded-md mt-6 w-full hover:bg-green-700"
          >
            Adicionar Projeto
          </button>
        </div>
      </div>

      {/* Modal de Edição */}
      {editVaga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Editar Vaga</h3>
            <label htmlFor="edit-nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="edit-nome"
              type="text"
              value={editVaga.nome}
              onChange={(e) => handleEditChange('nome', e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            <label htmlFor="edit-descricao" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              id="edit-descricao"
              type="text"
              value={editVaga.descricao}
              onChange={(e) => handleEditChange('descricao', e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            <label htmlFor="edit-bolsa" className="block text-sm font-medium text-gray-700">
              Bolsa
            </label>
            <select
              id="edit-bolsa"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={editVaga.bolsa || 0}
              onChange={(e) => handleEditChange('bolsa', parseInt(e.target.value))}
            >
              <option value="0">Não</option>
              <option value="1">Sim</option>
            </select>

            <label htmlFor="edit-valor-bolsa" className="block text-sm font-medium text-gray-700">
              Valor da Bolsa
            </label>
            <input
              id="edit-valor-bolsa"
              type="number"
              value={editVaga.bolsa_valor || ''}
              onChange={(e) => handleEditChange('bolsa_valor', parseInt(e.target.value))}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              disabled={editVaga.bolsa === 0}
            />

            <label htmlFor="edit-tipo" className="block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="edit-tipo"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              value={editVaga.tipo || 0}
              onChange={(e) => handleEditChange('tipo', parseInt(e.target.value))}
            >
              <option value="0">Pesquisa</option>
              <option value="1">Extensão</option>
            </select>
            <button
              type="button"
              onClick={handleUpdateVaga}
              className="bg-blue-500 text-white p-2 rounded-md w-full mt-4"
            >
              Atualizar
            </button>

            <button
              type="button"
              onClick={() => setEditVaga(null)}
              className="mt-[2%] w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
