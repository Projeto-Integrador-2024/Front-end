"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

interface Professor {
  ra: string;
  nome: string;
  cpf: string;
}

export function Professor() {
  const router = useRouter();
  const [professor, setProfessores] = useState<Professor[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<string | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<Professor | null>(null);

  const tabelaRef = useRef<HTMLDivElement | null>(null); // Ref para a área da tabela e botões
  
  useEffect(() => {
    const fetchProfessores = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ADMIN/GET_ALL/PROFESSOR");
        setProfessores(response.data);
      } catch (error) {
        console.error("Erro ao buscar professor:", error);
      }
    };

    fetchProfessores();
  }, []);

  // Função para detectar clique fora da tabela
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabelaRef.current && !tabelaRef.current.contains(event.target as Node)) {
        // Resetar seleção e edição se o clique for fora da tabela
        setProfessorSelecionado(null);
        setIsEditando(false);
        setDadosEdicao(null);
      }
    };

    // Adiciona o listener para o clique fora
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpeza do listener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectProfessor= (registroAcademico: string) => {
    setProfessorSelecionado((prev) => (prev === registroAcademico ? null : registroAcademico));
  };

  const handleDeleteProfessor = async () => {
    if (professorSelecionado) {
      try {
        await axios.delete(`http://127.0.0.1:5000/ADMIN/DELETE/PROFESSOR`, {
          data: { ra: professorSelecionado },
        });
        setProfessores((prevAlunos) => prevAlunos.filter((aluno) => aluno.ra !== professorSelecionado));
        setProfessorSelecionado(null);
      } catch (error) {
        console.error("Erro ao deletar professor:", error);
      }
    }
  };

  const handleEditProfessor = () => {
    const professorParaEditar = professor.find((professor) => professor.ra === professorSelecionado);
    if (professorParaEditar) {
      setDadosEdicao(professorParaEditar);
      setIsEditando(true);
    }
  };

  const handleSaveEdicao = async () => {
    if (dadosEdicao) {
      try {
        await axios.put(`http://127.0.0.1:5000/ADMIN/UPDATE/PROFESSOR`, dadosEdicao);
        setProfessores((prevProfessores) =>
          prevProfessores.map((professor) =>
            professor.ra === dadosEdicao.ra ? dadosEdicao : professor
          )
        );
        setIsEditando(false);
        setProfessorSelecionado(null); // Limpa a seleção após a edição
      } catch (error) {
        console.error("Erro ao editar professor:", error);
      }
    }
  };

  return (
    <div ref={tabelaRef}>
      <Table className="max-w-[600px] w-full mx-auto border mt-[10%]">
        <TableCaption className="caption-top text-3xl font-bold mb-[2%]">
          Lista de Professores.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Registro Acadêmico</TableHead>
            <TableHead className="text-center">Nome Completo</TableHead>
            <TableHead className="text-center">CPF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professor.length > 0 ? (
            professor.map((professor) => (
              <TableRow
                key={professor.ra}
                onClick={() => handleSelectProfessor(professor.ra)}
                className={`cursor-pointer ${
                  professorSelecionado === professor.ra ? "bg-blue-200" : ""
                }`}
              >
                <TableCell className="font-medium">{professor.ra}</TableCell>
                <TableCell className="text-center">{professor.nome}</TableCell>
                <TableCell className="text-center">{professor.cpf}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhum professor encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-row max-w-[600px] w-full mx-auto mt-[5%] items-center justify-center gap-x-[4%]">
        <Button className="w-full" onClick={() => router.push("/paineldecontrole/professores/criarProfessor")}>
          Adicionar Professor
        </Button>
        <Button className="w-full" disabled={!professorSelecionado} onClick={handleDeleteProfessor}>
          Remover Professor
        </Button>
        <Button className="w-full" disabled={!professorSelecionado} onClick={handleEditProfessor}>
          Editar Professor
        </Button>
        <Button className="w-full" onClick={() => router.push("/paineldecontrole")}>
          Voltar
        </Button>
      </div>

      {/* Formulário de Edição */}
      {isEditando && dadosEdicao && (
        <div className="max-w-[600px] w-full mx-auto mt-5 p-4 border rounded">
          <h3 className="text-xl font-bold mb-4">Editar Professor</h3>
          <label className="block mb-2">
            Nome Completo:
            <input
              type="text"
              value={dadosEdicao.nome}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, nome: e.target.value } : null)
              }
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            CPF:
            <input
              type="text"
              value={dadosEdicao.cpf}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, cpf: e.target.value } : null)
              }
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <Button className="mr-2" onClick={handleSaveEdicao}>
            Salvar
          </Button>
          <Button variant="secondary" onClick={() => setIsEditando(false)}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}

export default Professor;
