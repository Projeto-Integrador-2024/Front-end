"use client"

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

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  bolsa: number;
  tipo: number;
  criador_id: string;
}

export function Projetos() {
  const router = useRouter();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState<string | null>(null);
  const [isEditando, setIsEditando] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState<Projeto | null>(null);

  const tabelaRef = useRef<HTMLDivElement | null>(null); // Ref para a área da tabela e botões
  
  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ADMIN/GET_ALL/VAGA");
        setProjetos(response.data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchProjetos();
  }, []);

  // Função para detectar clique fora da tabela
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabelaRef.current && !tabelaRef.current.contains(event.target as Node)) {
        setProjetoSelecionado(null);
        setIsEditando(false);
        setDadosEdicao(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectProjeto = (id: string) => {
    setProjetoSelecionado(prev => (prev === id ? null : id)); // Alterna a seleção
  };

  const handleDeleteProjeto = async () => {
    if (projetoSelecionado) {
      try {
        await axios.delete(`http://127.0.0.1:5000/ADMIN/DELETE/VAGA`, {
          data: { id: projetoSelecionado },
        });
        setProjetos(prevProjetos => prevProjetos.filter(projeto => projeto.id !== projetoSelecionado));
        setProjetoSelecionado(null);
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
      }
    }
  };

  const handleEditProjeto = () => {
    const projetoParaEditar = projetos.find(projeto => projeto.id === projetoSelecionado);
    if (projetoParaEditar) {
      setDadosEdicao(projetoParaEditar);
      setIsEditando(true);
    }
  };

  const handleSaveEdicao = async () => {
    if (dadosEdicao) {
      try {
        await axios.put(`http://127.0.0.1:5000/ADMIN/UPDATE/VAGA`, dadosEdicao);
        setProjetos(prevProjetos =>
          prevProjetos.map(projeto =>
            projeto.id === dadosEdicao.id ? dadosEdicao : projeto
          )
        );
        setIsEditando(false);
        setProjetoSelecionado(null);
      } catch (error) {
        console.error("Erro ao editar projeto:", error);
      }
    }
  };

  return (
    <div ref={tabelaRef}>
      <Table className="max-w-[600px] w-full mx-auto border mt-[10%]">
        <TableCaption className="caption-top text-3xl font-bold mb-[2%]">
          Lista de Projetos.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">ID</TableHead>
            <TableHead className="text-center">Nome</TableHead>
            <TableHead className="text-center">Descrição</TableHead>
            <TableHead className="text-center">Bolsa</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projetos.length > 0 ? (
            projetos.map((projeto) => (
              <TableRow
                key={projeto.id}
                onClick={() => handleSelectProjeto(projeto.id)}
                className={`cursor-pointer ${
                  projetoSelecionado === projeto.id ? "bg-blue-200" : ""
                }`}
              >
                <TableCell className="font-medium">{projeto.id}</TableCell>
                <TableCell className="text-center">{projeto.nome}</TableCell>
                <TableCell className="text-center">{projeto.descricao}</TableCell>
                <TableCell className="text-center">{projeto.bolsa}</TableCell>
                <TableCell className="text-center">{projeto.tipo}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhum projeto encontrado</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-row max-w-[600px] w-full mx-auto mt-[5%] items-center justify-center gap-x-[4%]">
        <Button className="w-full" onClick={() => router.push("/paineldecontrole/projetos/criarProjeto")}>
          Adicionar Projeto
        </Button>
        <Button className="w-full" disabled={!projetoSelecionado} onClick={handleDeleteProjeto}>
          Remover Projeto
        </Button>
        <Button className="w-full" disabled={!projetoSelecionado} onClick={handleEditProjeto}>
          Editar Projeto
        </Button>
        <Button className="w-full" onClick={() => router.push("/paineldecontrole")}>
          Voltar
        </Button>
      </div>

      {isEditando && dadosEdicao && (
        <div className="max-w-[600px] w-full mx-auto mt-5 p-4 border rounded">
          <h3 className="text-xl font-bold mb-4">Editar Projeto</h3>
          <label className="block mb-2">
            Nome:
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
            Descrição:
            <input
              type="text"
              value={dadosEdicao.descricao}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, descricao: e.target.value } : null)
              }
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            Bolsa:
            <input
              type="number"
              value={dadosEdicao.bolsa}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, bolsa: +e.target.value } : null)
              }
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-4">
            Tipo:
            <input
              type="number"
              value={dadosEdicao.tipo}
              onChange={(e) =>
                setDadosEdicao((prev) => prev ? { ...prev, tipo: +e.target.value } : null)
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

export default Projetos;
