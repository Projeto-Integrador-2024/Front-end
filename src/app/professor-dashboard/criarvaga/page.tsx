'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

type Vaga = {
    nome: string;
    descricao: string;
    bolsa: number; 
    bolsa_valor: number; 
    tipo: number; 
}

export default function CriarVaga() {
    const [novaVaga, setNovaVaga] = useState<Vaga>({ nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 });
    const router = useRouter();

    // Handle input changes
    const handleChange = (field: keyof Vaga, value: any) => {
        setNovaVaga({ ...novaVaga, [field]: value });
    };

    // Create Vaga
    const handleCreateVaga = async () => {
        try {
            if (novaVaga.nome && novaVaga.descricao && novaVaga.bolsa !== undefined) {
                await axios.post(`${baseURL}/PROFESSOR/CREATE/VAGA`, novaVaga, {
                    withCredentials: true
                });
                alert('Vaga criada com sucesso!');
                router.push('/professor-dashboard'); // Redirecionar após criação
            }
        } catch (error) {
            console.error("Erro ao criar vaga:", error);
            alert('Erro ao criar a vaga. Por favor, tente novamente.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="w-1/2 bg-white p-6 shadow-lg rounded-md">
                <h2 className="text-xl font-bold mb-4">Criar Nova Vaga</h2>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Vaga</label>
                <input
                    type="text"
                    id="nome"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    value={novaVaga.nome}
                    onChange={(e) => handleChange('nome', e.target.value)} 
                />
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mt-4">Descrição</label>
                <textarea
                    id="descricao"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    value={novaVaga.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)} 
                />
                <label className="block text-sm font-medium text-gray-700 mt-4">Bolsa</label>
                <div className="flex items-center mt-1">
                    <input
                        type="radio"
                        id="bolsa-0"
                        name="bolsa"
                        className="mr-2"
                        value="0"
                        checked={novaVaga.bolsa === 0}
                        onChange={() => handleChange('bolsa', 0)}
                    />
                    <label htmlFor="bolsa-0">Não</label>
                    <input
                        type="radio"
                        id="bolsa-1"
                        name="bolsa"
                        className="ml-4 mr-2"
                        value="1"
                        checked={novaVaga.bolsa === 1}
                        onChange={() => handleChange('bolsa', 1)}
                    />
                    <label htmlFor="bolsa-1">Sim</label>
                </div>
                <label htmlFor="bolsa_valor" className="block text-sm font-medium text-gray-700 mt-4">Valor da Bolsa</label>
                <input
                    type="number"
                    id="bolsa_valor"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    value={novaVaga.bolsa_valor || ''}
                    onChange={(e) => handleChange('bolsa_valor', parseInt(e.target.value) || 0)}
                />
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mt-4">Tipo</label>
                <select
                    id="tipo"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    value={novaVaga.tipo}
                    onChange={(e) => handleChange('tipo', parseInt(e.target.value))}
                >
                    <option value="0">Pesquisa</option>
                    <option value="1">Extensão</option>
                </select>
                <button
                    type="button"
                    onClick={handleCreateVaga}
                    className="bg-green-500 text-white p-2 rounded-md mt-6 w-full hover:bg-green-700"
                >
                    Criar Vaga
                </button>

                <button
                    type="button"
                    onClick={() => router.push('/professor-dashboard')}
                    className=" mt-[2%] w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                    Voltar
                </button>
            </form>
        </div>
    );
}