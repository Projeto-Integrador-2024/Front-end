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
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Aluno {
  ra: string;
  nome: string;
  cpf: string;
  periodo: string;
}

export function Alunos() {
  const router = useRouter();
  const [alunos, setAlunos] = useState<Aluno[]>([]); 
  const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<Aluno | null>(null);

  
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ADMIN/GET_ALL/ALUNO");
        setAlunos(response.data); 
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchAlunos(); 
  }, []);

  
  const handleSelectAluno = (registroAcademico: string) => {
    setAlunoSelecionado((prev) => (prev === registroAcademico ? null : registroAcademico));
  };

 
  const handleDeleteAluno = async () => {
    if (alunoSelecionado) {
      try {
        await axios.delete(`http://127.0.0.1:5000/ADMIN/DELETE/ALUNO`, {
          data: { ra: alunoSelecionado },
        });
        setAlunos((prevAlunos) => prevAlunos.filter((aluno) => aluno.ra !== alunoSelecionado));
        setAlunoSelecionado(null); 
      } catch (error) {
        console.error("Erro ao deletar aluno:", error);
      }
    }
  };

  
  const handleEditAluno = () => {
    const alunoParaEditar = alunos.find((aluno) => aluno.ra === alunoSelecionado);
    if (alunoParaEditar) {
      setDadosEdicao(alunoParaEditar);
      setIsEditando(true);
    }
  };

  
  const handleSaveEdicao = async () => {
    if (dadosEdicao) {
      try {
        await axios.put(`http://127.0.0.1:5000/ADMIN/UPDATE/ALUNO`, dadosEdicao);
        setAlunos((prevAlunos) =>
          prevAlunos.map((aluno) =>
            aluno.ra === dadosEdicao.ra ? dadosEdicao : aluno
          )
        );
        setIsEditando(false);
        setAlunoSelecionado(null); // Limpa a seleção após a edição
      } catch (error) {
        console.error("Erro ao editar aluno:", error);
      }
    }
  };

  return (
    <div>
      <Table className="max-w-[600px] w-full mx-auto border mt-[10%]">
        <TableCaption className="caption-top text-3xl font-bold mb-[2%]">
          Lista de alunos.
        </TableCaption>
        <TableHeader>
          <TableRow >
            <TableHead className="w-[100px] text-center">Registro Acadêmico</TableHead>
            <TableHead className="text-center">Nome Completo</TableHead>
            <TableHead className="text-center">CPF</TableHead>
            <TableHead className="text-center">Período</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <TableRow
                key={aluno.ra}
                onClick={() => handleSelectAluno(aluno.ra)}
                className={`cursor-pointer ${
                  alunoSelecionado === aluno.ra ? "bg-blue-200" : ""
                }`}
              >
                <TableCell className="font-medium">{aluno.ra}</TableCell>
                <TableCell className="text-center">{aluno.nome}</TableCell>
                <TableCell className="text-center">{aluno.cpf}</TableCell>
                <TableCell className="text-center">{aluno.periodo}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Nenhum aluno encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-row max-w-[600px] w-full mx-auto mt-[5%] items-center justify-center gap-x-[4%]">
        <Button className="w-full" onClick={() => router.push("/paineldecontrole/alunos/criarAluno")}>
          Adicionar Aluno
        </Button>
        <Button className="w-full" disabled={!alunoSelecionado} onClick={handleDeleteAluno}>
          Remover Aluno
        </Button>
        <Button className="w-full" disabled={!alunoSelecionado} onClick={handleEditAluno}>
          Editar Aluno
        </Button>
        <Button className="w-full" onClick={() => router.push("/paineldecontrole")}>
          Voltar
        </Button>
      </div>

      {/* Formulário de Edição */}
      {isEditando && dadosEdicao && (
        <div className="max-w-[600px] w-full mx-auto mt-5 p-4 border rounded">
          <h3 className="text-xl font-bold mb-4">Editar Aluno</h3>
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
          <label className="block mb-4">
            Período:
            <input
              type="text"
              value={dadosEdicao.periodo}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, periodo: e.target.value } : null)
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

export default Alunos;
