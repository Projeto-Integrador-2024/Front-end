"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

export function CadastroAluno({ className, ...props }: CardProps) {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [ra, setRa] = useState(""); // Registro Acadêmico do aluno
  const [periodo, setPeriodo] = useState(""); // Período
  const [password, setPassword] = useState("");

  const handleCadastroAluno = async () => {
    const url = "http://127.0.0.1:5000/CADASTRO_ALUNO";

    const data = { nome, cpf, ra, periodo, senha: password };

    try {
      const response = await axios.post(url, data);

      console.log("Resposta do servidor:", response.data);

      if (response.status === 200) {
        toast.success("Cadastro realizado com sucesso!");
        router.push("/"); // Redireciona o usuário para a página inicial
      } else {
        toast.error(response.data.error || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error || "Erro ao realizar cadastro. Verifique suas informações.");
        } else if (error.request) {
          toast.error("Não houve resposta do servidor. Verifique a conexão.");
        } else {
          toast.error("Erro ao tentar enviar a requisição.");
        }
      } else {
        toast.error("Erro desconhecido.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="w-full bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/sobre" className="hover:text-gray-300">
              Sobre
            </Link>
            <Link href="/contatos" className="hover:text-gray-300">
              Contato
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center flex-1 w-full">
        <Card className={`w-10/12 md:w-4/12 ${className}`} {...props}>
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-3xl font-bold">PPE</CardTitle>
            <CardDescription className="text-2xl font-bold">
              Cadastro de Aluno
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-4">
              <input
                type="text"
                placeholder="Nome"
                className="p-2 border rounded-md w-full"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                type="number"
                placeholder="CPF"
                className="p-2 border rounded-md w-full"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <input
                type="text"
                placeholder="Registro Acadêmico"
                className="p-2 border rounded-md w-full"
                value={ra}
                onChange={(e) => setRa(e.target.value)}
              />
              <input
                type="number"
                placeholder="Período"
                className="p-2 border rounded-md w-full"
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="p-2 border rounded-md w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white" onClick={handleCadastroAluno}>
              Cadastrar
            </Button>
            <Button className="mt-4 w-full font-semibold bg-transparent border border-gray-600 text-gray-600 hover:bg-gray-100 hover:text-gray-700" onClick={() => router.push("/login")}>
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="bg-gray-800 py-5 text-slate-200 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-center w-full">
              COPYRIGHT © 2024. TODOS OS DIREITOS RESERVADOS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CadastroAluno;
