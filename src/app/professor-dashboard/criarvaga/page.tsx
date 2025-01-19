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
    const [novasVagas, setNovasVagas] = useState<Vaga[]>([
        { nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }
    ]);
    const router = useRouter();

    // Handle input changes
    const handleChange = (index: number, field: keyof Vaga, value: any) => {
        const updatedVagas = [...novasVagas];
        updatedVagas[index] = { ...updatedVagas[index], [field]: value };
        setNovasVagas(updatedVagas);
    };

    // Add a new empty form
    const handleAddForm = () => {
        setNovasVagas([...novasVagas, { nome: '', descricao: '', bolsa: 0, bolsa_valor: 0, tipo: 0 }]);
    };

    // Remove a form
    const handleRemoveForm = (index: number) => {
        const updatedVagas = [...novasVagas];
        updatedVagas.splice(index, 1);
        setNovasVagas(updatedVagas);
    };

    // Create all Vagas
    const handleCreateVagas = async () => {
        try {
            for (const vaga of novasVagas) {
                if (vaga.nome && vaga.descricao && vaga.bolsa !== undefined) {
                    await axios.post(`${baseURL}/PROFESSOR/CREATE/VAGA`, vaga, {
                        withCredentials: true
                    });
                }
            }
            alert('Vagas criadas com sucesso!');
            router.push('/professor-dashboard'); // Redirecionar após criação
        } catch (error) {
            console.error("Erro ao criar vagas:", error);
            alert('Erro ao criar as vagas. Por favor, tente novamente.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form className="w-1/2 bg-white p-6 shadow-lg rounded-md">
                <h2 className="text-xl font-bold mb-4">Criar Novas Vagas</h2>
                {novasVagas.map((vaga, index) => (
                    <div key={index} className="border-b border-gray-300 pb-4 mb-4">
                        <h3 className="text-lg font-semibold">Vaga {index + 1}</h3>
                        <label htmlFor={`nome-${index}`} className="block text-sm font-medium text-gray-700">Nome da Vaga</label>
                        <input
                            type="text"
                            id={`nome-${index}`}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={vaga.nome}
                            onChange={(e) => handleChange(index, 'nome', e.target.value)}
                        />
                        <label htmlFor={`descricao-${index}`} className="block text-sm font-medium text-gray-700 mt-4">Descrição</label>
                        <textarea
                            id={`descricao-${index}`}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={vaga.descricao}
                            onChange={(e) => handleChange(index, 'descricao', e.target.value)}
                        />
                        <label className="block text-sm font-medium text-gray-700 mt-4">Bolsa</label>
                        <div className="flex items-center mt-1">
                            <input
                                type="radio"
                                id={`bolsa-0-${index}`}
                                name={`bolsa-${index}`}
                                className="mr-2"
                                value="0"
                                checked={vaga.bolsa === 0}
                                onChange={() => handleChange(index, 'bolsa', 0)}
                            />
                            <label htmlFor={`bolsa-0-${index}`}>Não</label>
                            <input
                                type="radio"
                                id={`bolsa-1-${index}`}
                                name={`bolsa-${index}`}
                                className="ml-4 mr-2"
                                value="1"
                                checked={vaga.bolsa === 1}
                                onChange={() => handleChange(index, 'bolsa', 1)}
                            />
                            <label htmlFor={`bolsa-1-${index}`}>Sim</label>
                        </div>
                        <label htmlFor={`bolsa_valor-${index}`} className="block text-sm font-medium text-gray-700 mt-4">Valor da Bolsa</label>
                        <input
                            type="number"
                            id={`bolsa_valor-${index}`}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            value={vaga.bolsa_valor || ''}
                            onChange={(e) => handleChange(index, 'bolsa_valor', parseInt(e.target.value) || 0)}
                        />
                        <label htmlFor={`tipo-${index}`} className="block text-sm font-medium text-gray-700 mt-4">Tipo</label>
                        <div className="flex items-center">
                            <select
                                id={`tipo-${index}`}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                value={vaga.tipo}
                                onChange={(e) => handleChange(index, 'tipo', parseInt(e.target.value))}
                            >
                                <option value="0">Pesquisa</option>
                                <option value="1">Extensão</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleAddForm}
                                className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                            >
                                +
                            </button>
                            {novasVagas.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveForm(index)}
                                    className="ml-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                                >
                                    -
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleCreateVagas}
                    className="bg-green-500 text-white p-2 rounded-md mt-6 w-full hover:bg-green-700"
                >
                    Criar Vagas
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
