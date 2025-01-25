"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export function ControlPanel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-gray-800 text-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" width={80} height={80} />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/projetos" className="hover:text-gray-300">Projetos</Link>
            <Link href="/contato" className="hover:text-gray-300">Contato</Link>
            <button
              type="button"
              className="text-sm font-semibold text-slate-200 bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col w-[400px] border p-4">
          <h1 className="text-center text-3xl font-bold mb-[5%]">Painel de Controle</h1>
          <Button className="w-full mb-2" onClick={() => router.push("/paineldecontrole/alunos")}>
            Alunos
          </Button>
          <Button className="w-full mb-2" onClick={() => router.push("/paineldecontrole/professores")}>
            Professores
          </Button>
          <Button className="w-full mb-2" onClick={() => router.push("/paineldecontrole/projetos")}>
            Projetos
          </Button>
        </div>
      </div>

      <footer className="bg-gray-800 py-5 text-slate-200 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="mb-0">1233 Via Rosalina, Campo-Mourão, PR | suporte@ppe.com.br | (44) 91234-1234</p>
          <p className="text-sm">COPYRIGHT © 2024. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
}

export default ControlPanel;
