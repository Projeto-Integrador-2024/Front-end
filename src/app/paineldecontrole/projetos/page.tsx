'use client'

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

interface Projeto {
	vaga_id: string
	nome: string
	descricao: string
	bolsa: string // agora é string
	tipo: string // agora é string
	criador_id: string
}

const Projetos = () => {
	const router = useRouter()
	const [projetos, setProjetos] = useState<Projeto[]>([])
	const [projetoSelecionado, setProjetoSelecionado] = useState<string | null>(
		null
	)
	const [isEditando, setIsEditando] = useState(false)
	const [dadosEdicao, setDadosEdicao] = useState<Projeto | null>(null)

	const tabelaRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const fetchProjetos = async () => {
			try {
				const response = await axios.get(
					'http://127.0.0.1:5000/ADMIN/GET_ALL/VAGA'
				)
				console.log('Projetos recebidos:', response.data)

				if (Array.isArray(response.data)) {
					setProjetos(response.data)
				} else if (response.data && response.data.data) {
					setProjetos(response.data.data)
				} else {
					console.error(
						'Resposta da API não tem o formato esperado:',
						response.data
					)
				}
			} catch (error) {
				console.error('Erro ao buscar projetos:', error)
			}
		}

		fetchProjetos()
	}, [])

	// Função para transformar valor da bolsa em texto
	const checkBolsa = (bolsa: string) => {
		return bolsa === 'Possui bolsa' ? 'Possui bolsa' : 'Não possui bolsa'
	}

	// Função para transformar valor do tipo em texto
	const checkTipo = (tipo: string) => {
		return tipo === 'Extensão' ? 'Extensão' : 'Pesquisa'
	}

	const handleSelectProjeto = (vaga_id: string) => {
		setProjetoSelecionado((prev) => (prev === vaga_id ? null : vaga_id))
	}

	const handleDeleteProjeto = async () => {
		if (projetoSelecionado) {
			try {
				await axios.delete('http://127.0.0.1:5000/ADMIN/DELETE/VAGA', {
					data: { id: projetoSelecionado },
				})
				setProjetos((prevProjetos) =>
					prevProjetos.filter(
						(projeto) => projeto.vaga_id !== projetoSelecionado
					)
				)
				setProjetoSelecionado(null)
			} catch (error) {
				console.error('Erro ao deletar projeto:', error)
			}
		}
	}

	const handleEditProjeto = () => {
		const projetoParaEditar = projetos.find(
			(projeto) => projeto.vaga_id === projetoSelecionado
		)
		if (projetoParaEditar) {
			setDadosEdicao(projetoParaEditar)
			setIsEditando(true)
		}
	}

	const handleSaveEdicao = async () => {
		if (dadosEdicao) {
			// Ajustando para usar "id" em vez de "vaga_id"
			const dadosParaEnviar = {
				id: dadosEdicao.vaga_id, // Aqui troquei vaga_id por id
				nome: dadosEdicao.nome,
				descricao: dadosEdicao.descricao,
				bolsa: dadosEdicao.bolsa === 'Possui bolsa' ? 1 : 0, // Garantir que bolsa seja 1 ou 0
				tipo: dadosEdicao.tipo === 'Extensão' ? 1 : 0, // Garantir que tipo seja 1 ou 0
			}
			console.log('Dados enviados para o backend:', dadosParaEnviar) // Log para depuração

			try {
				const response = await axios.put(
					'http://127.0.0.1:5000/ADMIN/UPDATE/VAGA',
					dadosParaEnviar
				)
				console.log('Resposta do servidor:', response.data)
				setProjetos((prevProjetos) =>
					prevProjetos.map((projeto) =>
						projeto.vaga_id === dadosEdicao.vaga_id ? dadosEdicao : projeto
					)
				)
				setIsEditando(false)
				setProjetoSelecionado(null)
			} catch (error) {
				console.error('Erro ao editar projeto:', error)
			}
		}
	}

	const handleBolsaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (dadosEdicao) {
			setDadosEdicao({ ...dadosEdicao, bolsa: event.target.value })
		}
	}

	const handleTipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (dadosEdicao) {
			setDadosEdicao({ ...dadosEdicao, tipo: event.target.value })
		}
	}

	return (
		<div ref={tabelaRef}>
			<Table className='max-w-[600px] w-full mx-auto border mt-[10%]'>
				<TableCaption className='caption-top text-3xl font-bold mb-[2%]'>
					Lista de Projetos.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px] text-center'>ID</TableHead>
						<TableHead className='text-center'>Nome</TableHead>
						<TableHead className='text-center'>Descrição</TableHead>
						<TableHead className='text-center'>Bolsa</TableHead>
						<TableHead className='text-center'>Tipo</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{projetos.length > 0 ? (
						projetos.map((projeto) => (
							<TableRow
								key={projeto.vaga_id}
								onClick={() => handleSelectProjeto(projeto.vaga_id)}
								className={`cursor-pointer ${
									projetoSelecionado === projeto.vaga_id ? 'bg-blue-200' : ''
								}`}
							>
								<TableCell className='font-medium'>{projeto.vaga_id}</TableCell>
								<TableCell className='text-center'>{projeto.nome}</TableCell>
								<TableCell className='text-center'>
									{projeto.descricao}
								</TableCell>
								<TableCell className='text-center'>
									{checkBolsa(projeto.bolsa)}
								</TableCell>
								<TableCell className='text-center'>
									{checkTipo(projeto.tipo)}
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={5}
								className='text-center'
							>
								Nenhum projeto encontrado
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<div className='flex flex-row max-w-[600px] w-full mx-auto mt-[5%] items-center justify-center gap-x-[4%]'>
				<Button
					className='w-full'
					onClick={() => router.push('/paineldecontrole/projetos/criarProjeto')}
				>
					Adicionar Projeto
				</Button>
				<Button
					className='w-full'
					disabled={!projetoSelecionado}
					onClick={handleDeleteProjeto}
				>
					Remover Projeto
				</Button>
				<Button
					className='w-full'
					disabled={!projetoSelecionado}
					onClick={handleEditProjeto}
				>
					Editar Projeto
				</Button>
				<button
					className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
					onClick={() => router.push('/paineldecontrole')}
				>
					Voltar
				</button>
			</div>

			{isEditando && dadosEdicao && (
				<div className='max-w-[600px] w-full mx-auto mt-5 p-4 border rounded'>
					<h3 className='text-xl font-bold mb-4'>Editar Projeto</h3>
					<label className='block mb-2'>
						Nome:
						<input
							type='text'
							value={dadosEdicao.nome}
							onChange={(e) =>
								setDadosEdicao({ ...dadosEdicao, nome: e.target.value })
							}
							className='block w-full mt-1 p-2 border rounded'
						/>
					</label>
					<label className='block mb-2'>
						Descrição:
						<textarea
							value={dadosEdicao.descricao}
							onChange={(e) =>
								setDadosEdicao({ ...dadosEdicao, descricao: e.target.value })
							}
							className='block w-full mt-1 p-2 border rounded'
						/>
					</label>
					<label className='block mb-2'>
						Bolsa:
						<div className='flex items-center gap-x-4'>
							<label>
								<input
									type='radio'
									value='Possui bolsa'
									checked={dadosEdicao.bolsa === 'Possui bolsa'}
									onChange={handleBolsaChange}
								/>
								Possui bolsa
							</label>
							<label>
								<input
									type='radio'
									value='Não possui bolsa'
									checked={dadosEdicao.bolsa === 'Não possui bolsa'}
									onChange={handleBolsaChange}
								/>
								Não possui bolsa
							</label>
						</div>
					</label>
					<label className='block mb-2'>
						Tipo:
						<div className='flex items-center gap-x-4'>
							<label>
								<input
									type='radio'
									value='Pesquisa'
									checked={dadosEdicao.tipo === 'Pesquisa'}
									onChange={handleTipoChange}
								/>
								Pesquisa
							</label>
							<label>
								<input
									type='radio'
									value='Extensão'
									checked={dadosEdicao.tipo === 'Extensão'}
									onChange={handleTipoChange}
								/>
								Extensão
							</label>
						</div>
					</label>
					<Button onClick={handleSaveEdicao}>Salvar</Button>
				</div>
			)}
		</div>
	)
}

export default Projetos
