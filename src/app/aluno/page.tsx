'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

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
    const router = useRouter();

    // Busca todas as vagas disponíveis
    const fetchVagas = async () => {
        try {
            const response = await axios.get(`${baseURL}/GET_ALL_VAGAS`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setVagas(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar vagas:", error);
        }
    };

    const fetchMyVagas = async () => {
        try {
            const response = await axios.get(`${baseURL}/ALUNO/GET_MY_VAGAS`, {
                withCredentials: true
            });

            if (response.status === 200) {
                setMyVagas(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar minhas vagas:", error);
        }
    };

    // Verifica se o usuário está autenticado
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${baseURL}/check-auth`, {
                    withCredentials: true
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

    // Inscreve o aluno em uma vaga
    const handleInscreverVaga = async (id: number) => {
        try {
            const response = await axios.post(`${baseURL}/ALUNO/INSCREVER`, {
                id,
            }, {
                withCredentials: true
            });

            if (response.status === 200 || response.status === 201) {
                fetchVagas();
                fetchMyVagas();
            }
        } catch (error) {
            console.error("Erro ao inscrever na vaga:", error);
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

    const handleDesinscreverVaga = async (id: number) => {
        if (id === undefined) {
            console.error("ID da vaga está undefined!");
            return;
        }

        try {
            console.log(`Tentando desinscrever da vaga com ID: ${id}`);
            const response = await axios.post(`${baseURL}/ALUNO/DESINSCREVER`, {
                id: id,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                fetchVagas();
                fetchMyVagas();
            } else {
                console.error(response.data.erro);
            }
        } catch (error) {
            console.error("Erro ao desinscrever da vaga:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="relative w-full max-w-md">
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
                <div className="bg-white p-6 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Dashboard do Aluno</h2>
                    
                    <h3 className="text-xl font-semibold mb-4">Vagas Inscritas</h3>
                    <ul className="mb-4">
                        {myVagas.map((vaga: Vaga) => (
                            <li key={vaga.vaga_id} className="border-b py-2">
                                <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                                <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                                <div className="text-gray-700">ID: {vaga.vaga_id}</div>
                                <div className="text-gray-700">Bolsa: {vaga.bolsa === 0 ? 'Não possui bolsa' : 'Possui bolsa'}</div>
                                <div className="text-gray-700">Valor da Bolsa: {vaga.bolsa === 0 ? 'N/A' : vaga.bolsa_valor}</div>
                                <div className="text-gray-700">Tipo: {vaga.tipo === 0 ? 'Pesquisa' : 'Extensão'}</div>
                                <button onClick={() => handleDesinscreverVaga(vaga.vaga_id)} className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 mt-2">Desinscrever-se</button>
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">Vagas Disponíveis</h3>
                    <ul className="mb-4">
                        {vagas.filter((vaga: Vaga) => !myVagas.some((myVaga: Vaga) => myVaga.vaga_id === vaga.vaga_id)).map((vaga: Vaga) => (
                            <li key={vaga.vaga_id} className="border-b py-2">
                                <div className="text-xl font-semibold">Nome: {vaga.nome}</div>
                                <div className="text-gray-700">Descrição: {vaga.descricao}</div>
                                <div className="text-gray-700">ID: {vaga.vaga_id}</div>
                                <div className="text-gray-700">Bolsa: {vaga.bolsa === 0 ? 'Não possui bolsa' : 'Possui bolsa'}</div>
                                <div className="text-gray-700">Valor da Bolsa: {vaga.bolsa === 0 ? 'N/A' : vaga.bolsa_valor}</div>
                                <div className="text-gray-700">Tipo: {vaga.tipo === 0 ? 'Pesquisa' : 'Extensão'}</div>
                                <button onClick={() => handleInscreverVaga(vaga.vaga_id)} className="bg-green-500 text-white p-1 rounded-md hover:bg-green-600 mt-2">Inscrever-se</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
