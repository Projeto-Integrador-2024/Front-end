"use client";

import axios from "axios";
import { AxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

export function Login({ className, ...props }: CardProps) {
  const router = useRouter();

  const [ra, setRa] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        username: ra,
        senha: password,
      });

      console.log("Resposta do servidor:", response.data);

      if (response.status === 200) {
        const nome = response.data.nome || "usuário!";
        toast.success(`Bem-vindo, ${nome}`);
        console.log("Toast de sucesso exibido");
        router.push("/"); 
      } else {
        toast.error(response.data.error || "Erro desconhecido.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);

      // Verifique se o erro é uma instância de AxiosError
      if (axios.isAxiosError(error)) {
        // Se o erro for relacionado a uma resposta do servidor
        if (error.response) {
          toast.error(error.response.data.error || "Erro ao realizar login. Verifique suas credenciais.");
        } else if (error.request) {
          // Se não houve resposta do servidor
          toast.error("Não houve resposta do servidor. Verifique a conexão.");
        } else {
          // Se houve um erro ao configurar a requisição
          toast.error("Erro ao tentar enviar a requisição.");
        }
      } else {
        // Caso seja um erro desconhecido
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
      /> {/* Componente que exibe os toasts */}

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
              Cadastre seus dados.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-4">
              <div className="flex items-center space-x-4">
                <p>Sou um:</p>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="aluno"
                    checked={userType === "aluno"}
                    onChange={() => setUserType("aluno")}
                    className="mr-2"
                  />
                  Aluno
                </label>
                <label>
                  <input
                    type="radio"
                    name="userType"
                    value="professor"
                    checked={userType === "professor"}
                    onChange={() => setUserType("professor")}
                    className="mr-2"
                  />
                  Professor
                </label>
              </div>
              <input
                type="text"
                placeholder="Nome"
                className="p-2 border rounded-md w-full"
                value={ra}
                //onChange={(e) => setRa(e.target.value)}
                disabled={!userType}
              />
              <input
                type="number"
                placeholder="CPF"
                className="p-2 border rounded-md w-full"
                value={ra}
                //onChange={(e) => setRa(e.target.value)}
                disabled={!userType}
              />
              <input
                type="text"
                placeholder={userType === "aluno" ? "R.A" : "SIAPE"}
                className="p-2 border rounded-md w-full"
                value={ra}
                onChange={(e) => setRa(e.target.value)} // COLOCAR VALIDAÇÃO: SE COMEÇAR COM A -> SetRA
                disabled={!userType}
              />
              {userType === "aluno" && (
                <input
                  type="number"
                  placeholder="Período"
                  className="p-2 border rounded-md w-full"
                  value={ra}
                  //onChange={(e) => setRa(e.target.value)}
                  disabled={!userType}
                />
              )}
              <input
                type="password"
                placeholder="Senha"
                className="p-2 border rounded-md w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!userType}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <Button className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white" onClick={handleLogin} disabled={!userType}>
              Cadastre-se
            </Button>
            <Button className="mt-4 w-full font-semibold bg-transparent border border-gray-600 text-gray-600 hover:bg-gray-100 hover:text-gray-700" onClick={() => router.back()}>
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

export default Login;
