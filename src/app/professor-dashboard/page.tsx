'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

type Vaga = {
    vaga_id?: number;
    nome: string;
    descricao: string;
    bolsa: number; 
    bolsa_valor: number; 
    tipo: number; 
    criador_id?: string;
    inscritos?: string[];
}

export default function ProfessorDashboard() {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [newVagas, setNewVagas] = useState<Vaga[]>([{ nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
    const [editVaga, setEditVaga] = useState<Vaga | null>(null); // Vaga em edição
    const router = useRouter();

    // Fetch Vagas
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

    // Check Authentication
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

    // Handle input changes for new vagas
    const handleChange = (index: number, field: string, value: any) => {
        const updatedVagas = [...newVagas];
        updatedVagas[index] = { ...updatedVagas[index], [field]: value };
        setNewVagas(updatedVagas);
    };

    // Handle input changes for editing vaga
    const handleEditChange = (field: string, value: any) => {
        if (editVaga) {
            setEditVaga({ ...editVaga, [field]: value });
        }
    };

    // Create Vagas
    const handleCreateVagas = async () => {
        try {
            for (const vaga of newVagas) {
                if (vaga.nome && vaga.descricao && vaga.bolsa !== undefined) {
                    await axios.post(`${baseURL}/PROFESSOR/CREATE/VAGA`, {
                        ...vaga,
                        criador_id: '1234567'
                    }, {
                        withCredentials: true
                    });
                }
            }
            // Reset the newVagas state to prepare for the next creation
            setNewVagas([{ nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
            fetchVagas();
        } catch (error) {
            console.error("Erro ao criar vagas:", error);
        }
    };

    const handleEditVaga = (vaga: Vaga) => {
        setEditVaga(vaga); // Atualiza o estado de edição com a vaga clicada
    };

    // Update Vaga
    const handleUpdateVaga = async () => {
        if (!editVaga) return;

        try {
            const response = await axios.put(`${baseURL}/PROFESSOR/UPDATE/VAGA`, {
                ...editVaga,
                id: editVaga.vaga_id, // Certifique-se de passar o ID correto
                criador_id: '1234567'
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setEditVaga(null); // Limpa a vaga após a atualização
                fetchVagas(); // Recarrega as vagas atualizadas
            }
        } catch (error) {
            console.error("Erro ao atualizar vaga:", error);
        }
    };

    // Delete Vaga
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

    // Logout
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
                            <button onClick={() => handleDeleteVaga(vaga.vaga_id!)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 mt-2">Deletar</button>
                            <button onClick={() => handleEditVaga(vaga)} className="bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 mt-2">Editar</button>
                        </li>
                    ))}
                </ul>
                <form>
                    {/* Adicionar Vagas */}
                    {newVagas.map((vaga, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`nome-${index}`} className="block text-sm font-medium text-gray-700">Nome da Vaga</label>
                            <input
                                type="text"
                                id={`nome-${index}`}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vaga.nome}
                                onChange={(e) => handleChange(index, 'nome', e.target.value)} 
                            />
                            <label htmlFor={`descricao-${index}`} className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input
                                type="text"
                                id={`descricao-${index}`}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vaga.descricao}
                                onChange={(e) => handleChange(index, 'descricao', e.target.value)} 
                            />
                            <label className="block text-sm font-medium text-gray-700">Bolsa</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id={`bolsa1-${index}`}
                                    name={`bolsa-${index}`}
                                    className="mr-2"
                                    value="0"
                                    checked={vaga.bolsa === 0}
                                    onChange={() => handleChange(index, 'bolsa', 0)}
                                />
                                <label htmlFor={`bolsa1-${index}`}>Não</label>
                                <input
                                    type="radio"
                                    id={`bolsa2-${index}`}
                                    name={`bolsa-${index}`}
                                    className="ml-4 mr-2"
                                    value="1"
                                    checked={vaga.bolsa === 1}
                                    onChange={() => handleChange(index, 'bolsa', 1)}
                                />
                                <label htmlFor={`bolsa2-${index}`}>Sim</label>
                            </div>
                            <label htmlFor={`valor-bolsa-${index}`} className="block text-sm font-medium text-gray-700">Valor da Bolsa</label>
                            <input
                                type="number"
                                id={`valor-bolsa-${index}`}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vaga.bolsa_valor || ''}
                                onChange={(e) => handleChange(index, 'bolsa_valor', parseInt(e.target.value))}
                            />
                            <label htmlFor={`tipo-${index}`} className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                id={`tipo-${index}`}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vaga.tipo || 0}
                                onChange={(e) => handleChange(index, 'tipo', parseInt(e.target.value))}
                            >
                                <option value="0">Pesquisa</option>
                                <option value="1">Extensão</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleCreateVagas}
                                className="bg-green-500 text-white p-2 rounded-md mt-4 w-full">Criar</button>
                        </div>
                    ))}
                    {/* Edição de vaga */}
                    {editVaga && (
                        <div className="mt-4">
                            <label htmlFor="edit-nome" className="block text-sm font-medium text-gray-700">Nome</label>
                            <input
                                id="edit-nome"
                                type="text"
                                value={editVaga.nome}
                                onChange={(e) => handleEditChange('nome', e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            />
                            <label htmlFor="edit-descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input
                                id="edit-descricao"
                                type="text"
                                value={editVaga.descricao}
                                onChange={(e) => handleEditChange('descricao', e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            />
                            <label className="block text-sm font-medium text-gray-700">Bolsa</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="edit-bolsa1"
                                    value="0"
                                    checked={editVaga.bolsa === 0}
                                    onChange={() => handleEditChange('bolsa', 0)}
                                />
                                <label htmlFor="edit-bolsa1">Não</label>
                                <input
                                    type="radio"
                                    id="edit-bolsa2"
                                    value="1"
                                    checked={editVaga.bolsa === 1}
                                    onChange={() => handleEditChange('bolsa', 1)}
                                />
                                <label htmlFor="edit-bolsa2">Sim</label>
                            </div>
                            <label htmlFor="edit-valor-bolsa" className="block text-sm font-medium text-gray-700">Valor da Bolsa</label>
                            <input
                                id="edit-valor-bolsa"
                                type="number"
                                value={editVaga.bolsa_valor || ''}
                                onChange={(e) => handleEditChange('bolsa_valor', parseInt(e.target.value))}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            />
                            <label htmlFor="edit-tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
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
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
