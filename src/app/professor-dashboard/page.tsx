'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

type Vaga = {
    vaga_id?: number; // Torna opcional para o caso de novas vagas
    nome: string;
    descricao: string;
    bolsa: number; // 0 = Sem bolsa, 1 = Com bolsa
    bolsa_valor: number; // Valor da bolsa (se aplicável)
    tipo: number; // 0 = Pesquisa, 1 = Extensão
    criador_id?: string;
    inscritos?: string[]; // Lista de inscritos (se aplicável)
}

export default function ProfessorDashboard() {
    const [vagas, setVagas] = useState<Vaga[]>([])
    const [newVagas, setNewVagas] = useState<Vaga[]>([
        { nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }
    ])
    const router = useRouter()

    // Busca todas as vagas do professor
    const fetchVagas = async () => {
        try {
            const response = await axios.get(`${baseURL}/PROFESSOR/GET_MY/VAGA`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setVagas(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar vagas:", error);
        }
    };

    // Verifica se o usuário está autenticado
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${baseURL}/check-auth`, {
                    withCredentials: true
                });

                if (response.status !== 200) {
                    router.push('/login');
                } else {
                    fetchVagas();
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Adiciona um novo formulário de vaga
    const handleAddForm = () => {
        setNewVagas([...newVagas, { nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
    }

    // Atualiza os campos do formulário de uma nova vaga
    const handleChange = (index: number, field: string, value: any) => {
        const updatedVagas = [...newVagas];
        updatedVagas[index] = { ...updatedVagas[index], [field]: value };
        setNewVagas(updatedVagas);
    }

    // Cria novas vagas
    const handleCreateVagas = async () => {
        try {
            for (const vaga of newVagas) {
                await axios.post(`${baseURL}/PROFESSOR/CREATE/VAGA`, {
                    ...vaga,
                    criador_id: '1234567' // Substituir pelo ID correto
                }, {
                    withCredentials: true
                });
            }
            setNewVagas([{ nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
            fetchVagas();
        } catch (error) {
            console.error("Erro ao criar vagas:", error);
        }
    }

    // Deleta uma vaga
    const handleDeleteVaga = async (id: number) => {
        try {
            const response = await axios.delete(`${baseURL}/PROFESSOR/DELETE/VAGA`, {
                data: { id },
                withCredentials: true
            });

            if (response.status === 201) {
                fetchVagas();
                window.location.reload(); // Recarrega a página após a exclusão
            }
        } catch (error) {
            console.error("Erro ao deletar vaga:", error);
        }
    };

    // Logout do sistema
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${baseURL}/logout`, { withCredentials: true });
            if (response.status === 200) {
                router.push('/login');
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Dashboard do Professor</h2>
                <ul className="mb-4">
                    {vagas.map(vaga => (
                        <li key={vaga.vaga_id} className="border-b py-2">
                            <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                            <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                            <div className="text-gray-700">Bolsa: {vaga.bolsa === 0 ? 'Não possui bolsa' : 'Possui bolsa'}</div>
                            <div className="text-gray-700">Valor da Bolsa: {vaga.bolsa === 0 ? 'N/A' : vaga.bolsa_valor}</div>
                            <div className="text-gray-700">Tipo: {vaga.tipo === 0 ? 'Pesquisa' : 'Extensão'}</div>
                            <button onClick={() => handleDeleteVaga(vaga.vaga_id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 mt-2">Deletar</button>
                        </li>
                    ))}
                </ul>
                <form>
                    {newVagas.map((vaga, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`nome-${index}`} className="block text-sm font-medium text-gray-700">Nome da Vaga</label>
                            <input type="text" id={`nome-${index}`} className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={vaga.nome} onChange={(e) => handleChange(index, 'nome', e.target.value)} />
                            <label htmlFor={`descricao-${index}`} className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input type="text" id={`descricao-${index}`} className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={vaga.descricao} onChange={(e) => handleChange(index, 'descricao', e.target.value)} />
                            <label className="block text-sm font-medium text-gray-700">Bolsa</label>
                            <div className="flex items-center">
                                <input type="radio" id={`bolsa1-${index}`} name={`bolsa-${index}`} value={0} checked={vaga.bolsa === 0} onChange={(e) => handleChange(index, 'bolsa', parseInt(e.target.value))} className="mr-2" />
                                <label htmlFor={`bolsa1-${index}`} className="mr-4">Não possui bolsa</label>
                                <input type="radio" id={`bolsa2-${index}`} name={`bolsa-${index}`} value={1} checked={vaga.bolsa === 1} onChange={(e) => handleChange(index, 'bolsa', parseInt(e.target.value))} className="mr-2" />
                                <label htmlFor={`bolsa2-${index}`}>Possui bolsa</label>
                            </div>
                            <label htmlFor={`bolsa_valor-${index}`} className="block text-sm font-medium text-gray-700">Valor da Bolsa</label>
                            <input type="number" id={`bolsa_valor-${index}`} className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={vaga.bolsa_valor} onChange={(e) => handleChange(index, 'bolsa_valor', parseInt(e.target.value))} disabled={vaga.bolsa === 0} />
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <div className="flex items-center">
                                <input type="radio" id={`tipo1-${index}`} name={`tipo-${index}`} value={0} checked={vaga.tipo === 0} onChange={(e) => handleChange(index, 'tipo', parseInt(e.target.value))} className="mr-2" />
                                <label htmlFor={`tipo1-${index}`} className="mr-4">Pesquisa</label>
                                <input type="radio" id={`tipo2-${index}`} name={`tipo-${index}`} value={1} checked={vaga.tipo === 1} onChange={(e) => handleChange(index, 'tipo', parseInt(e.target.value))} className="mr-2" />
                                <label htmlFor={`tipo2-${index}`}>Extensão</label>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddForm} className="bg-blue-500 text-white p-2 rounded-md w-full mt-4 hover:bg-blue-600">Adicionar Vaga</button>
                    <button type="button" onClick={handleCreateVagas} className="bg-green-500 text-white p-2 rounded-md w-full mt-4 hover:bg-green-600">Criar Vagas</button>
                </form>
                <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-md w-full mt-4 hover:bg-red-600">Logout</button>
            </div>
        </div>
    )
}    