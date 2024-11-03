"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CreateUserProps {
    className?: string;
    [key: string]: any;
}

export const criarProfessor: React.FC<CreateUserProps> = ({ className, ...props }) => {
    const router = useRouter();
    const [nome, setNome] = useState<string>('');
    const [sobrenome, setSobrenome] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [curso, setCurso] = useState<string>('Ciência da Computação');

    const handleCreateUser = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/createuser', JSON.stringify({
                usuario: `${nome} ${sobrenome}`,
                cpf: cpf,
                curso: curso
            }), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Usuário criado com sucesso!');
            
            // Limpar o formulário
            setNome('');
            setSobrenome('');
            setCpf('');
            setCurso('Ciência da Computação');
        } catch (error) {
            toast.error('Erro ao criar usuário!');
            console.error('Erro ao criar usuário:', error);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleCreateUser();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen flex-col">
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base leading-7 text-center mt-[5%] text-2xl font-bold">Adicionar Professor</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600 text-center">Preencha os seguintes campos:</p>
                    </div>
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Informações Pessoais</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Digite as informações do professor.</p>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Sobrenome</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        value={sobrenome}
                                        onChange={(e) => setSobrenome(e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium leading-6 text-gray-900">CPF</label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-5">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Curso</label>
                                <div className="mt-2">
                                    <select
                                        id="course"
                                        name="course"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        value={curso}
                                        onChange={(e) => setCurso(e.target.value)}
                                    >
                                        <option>Ciência da Computação</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6 mb-[4%]">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => router.push("/paineldecontrole/alunos")}>
                        Cancelar
                    </button>
                    <Button type="submit">Adicionar</Button>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}

export default criarProfessor;
