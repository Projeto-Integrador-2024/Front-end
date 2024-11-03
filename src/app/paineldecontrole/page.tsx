"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ControlPanel() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
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
  );
}

export default ControlPanel;
