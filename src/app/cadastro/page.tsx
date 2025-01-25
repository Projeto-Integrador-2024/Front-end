"use client";
import { useRouter } from "next/navigation";

import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";


export function Cadastro() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">


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
            <Link href="/projetos" className="hover:text-gray-300">
              Projetos
            </Link>
            <Link href="/contatos" className="hover:text-gray-300">
              Contato
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center flex-1 w-full flex-col">
        <div>
          <h1 className="text-3xl font-thin">Como você gostaria de se cadastrar?</h1>
        </div>

        <div className="w-full flex flex-col mt-[2%] justify-center items-center">
          <button className="mt-4 w-[30%] rounded-lg font-thin bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-700 pt-2 pb-2" onClick={() => router.push("cadastro/professor")}>Professor</button>
          <button className="mt-4 w-[30%] rounded-lg font-thin bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-gray-700  pt-2 pb-2" onClick={() => router.push("cadastro/estudante")}>Estudante</button>
        </div>
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

export default Cadastro;
