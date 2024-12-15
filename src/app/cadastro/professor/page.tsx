"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CadastroProfessor() {
  const router = useRouter();

  // Estados para os campos do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [SIAPE, setSiape] = useState("");
  const [senha, setSenha] = useState("");

  // Função para lidar com o cadastro
  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = "http://127.0.0.1:5000/CADASTRO_PROFESSOR";
    const data = { nome, cpf, SIAPE, senha };

    try {
      const response = await axios.post(url, data);

      if (response.status === 200) {
        toast.success("Cadastro realizado com sucesso!");
        setNome("");
        setCpf("");
        setSiape("");
        setSenha("");
        router.push("/login"); // Redireciona para a página inicial
      } else {
        toast.error(response.data.error || "Erro desconhecido ao realizar cadastro.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error || "Erro ao realizar cadastro. Verifique os dados.");
        } else {
          toast.error("Erro ao se conectar com o servidor.");
        }
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Professor</h1>

        <form onSubmit={handleCadastro} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              className="mt-1 p-2 border rounded-md w-full"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              className="mt-1 p-2 border rounded-md w-full"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          {/* SIAPE */}
          <div>
            <label htmlFor="siape" className="block text-sm font-medium text-gray-700">
              SIAPE
            </label>
            <input
              type="text"
              id="siape"
              className="mt-1 p-2 border rounded-md w-full"
              value={SIAPE}
              onChange={(e) => setSiape(e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              className="mt-1 p-2 border rounded-md w-full"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Botão de cadastro */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>

        {/* Botão de voltar */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline text-sm"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
}
