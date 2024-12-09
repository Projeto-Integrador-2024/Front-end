'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDropzone } from 'react-dropzone'

interface CreateProjectProps {
	className?: string
	[key: string]: any
}

export const CriarProjeto: React.FC<CreateProjectProps> = ({
	className,
	...props
}) => {
	const router = useRouter()
	const [nome, setNome] = useState<string>('')
	const [descricao, setDescricao] = useState<string>('')
	const [bolsa, setBolsa] = useState<string>('sem-bolsa')
	const [tipo, setTipo] = useState<string>('extensao')
	const [files, setFiles] = useState<File[]>([])

	const onDrop = (acceptedFiles: File[]) => {
		setFiles([...files, ...acceptedFiles])
		toast.success(`${acceptedFiles.length} arquivo(s) adicionado(s) com sucesso!`)
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
			'application/pdf': ['.pdf'],
		},
	})

	const handleCreateProject = async () => {
		try {
			const formData = new FormData()
			formData.append('nome', nome)
			formData.append('descricao', descricao)
			formData.append('bolsa', bolsa === 'com-bolsa' ? 'true' : 'false')
			formData.append('tipo', tipo === 'extensao' ? 'extensao' : 'iniciacao-cientifica')
			formData.append('criador_id', 'p0000002')

			files.forEach((file) => formData.append('files', file))

			const response = await axios.post(
				'http://127.0.0.1:5000/ADMIN/CREATE/VAGA',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)

			toast.success('Projeto criado com sucesso!')

			setNome('')
			setDescricao('')
			setBolsa('sem-bolsa')
			setTipo('extensao')
			setFiles([])
		} catch (error) {
			toast.error('Erro ao criar projeto!')
			console.error('Erro ao criar projeto:', error)
		}
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		handleCreateProject()
	}

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='flex items-center justify-center min-h-screen flex-col'
			>
				<div className='space-y-12'>
					<div className='border-b border-gray-900/10 pb-12'>
						<h2 className='text-base leading-7 text-center mt-[5%] text-2xl font-bold'>
							Adicionar Projeto
						</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600 text-center'>
							Preencha os seguintes campos:
						</p>
					</div>
					<div className='border-b border-gray-900/10 pb-12'>
						
						<div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
							<div className='sm:col-span-6'>
								<label className='block text-sm font-medium leading-6 text-gray-900'>
									Nome
								</label>
								<div className='mt-2'>
									<input
										type='text'
										value={nome}
										onChange={(e) => setNome(e.target.value)}
										className='block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>
							<div className='sm:col-span-6'>
								<label className='block text-sm font-medium leading-6 text-gray-900'>
									Descrição
								</label>
								<div className='mt-2'>
									<textarea
										value={descricao}
										onChange={(e) => setDescricao(e.target.value)}
										className='block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
									/>
								</div>
							</div>

							<div className='sm:col-span-3 border border-gray-300 p-4 rounded-md'>
								<label className='block text-sm font-medium leading-6 text-gray-900'>
									Bolsa
								</label>
								<div className='mt-2 flex flex-col gap-2'>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											name='bolsa'
											value='sem-bolsa'
											checked={bolsa === 'sem-bolsa'}
											onChange={() => setBolsa('sem-bolsa')}
											className='mr-2'
										/>
										Sem Bolsa
									</label>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											name='bolsa'
											value='com-bolsa'
											checked={bolsa === 'com-bolsa'}
											onChange={() => setBolsa('com-bolsa')}
											className='mr-2'
										/>
										Com Bolsa
									</label>
								</div>
							</div>

							<div className='sm:col-span-3 border border-gray-300 p-4 rounded-md'>
								<label className='block text-sm font-medium leading-6 text-gray-900'>
									Tipo
								</label>
								<div className='mt-2 flex flex-col gap-2'>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											name='tipo'
											value='extensao'
											checked={tipo === 'extensao'}
											onChange={() => setTipo('extensao')}
											className='mr-2'
										/>
										Extensão
									</label>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											name='tipo'
											value='iniciacao-cientifica'
											checked={tipo === 'iniciacao-cientifica'}
											onChange={() => setTipo('iniciacao-cientifica')}
											className='mr-2'
										/>
										Iniciação Científica
									</label>
								</div>
							</div>
						</div>
						<div className='text-center mt-[5%] cursor-pointer'>
							<div
								{...getRootProps()}
								className={`p-6 border-2 border-dashed rounded-lg ${
									isDragActive ? 'border-indigo-600 bg-gray-50' : 'border-gray-300'
								}`}
							>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p className='text-indigo-600'>Solte os arquivos aqui...</p>
								) : (
									<p className='text-slate-400'>Arraste e solte arquivos aqui, ou clique para selecionar.</p>
								)}
								<ul className='mt-4'>
									{files.map((file, index) => (
										<li key={index}>
											{file.name}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className='mt-[2%] flex items-center justify-end gap-x-6 mb-[4%]'>
					<button
						type='button'
						className='text-sm font-semibold leading-6 text-gray-900'
						onClick={() => router.push('/paineldecontrole/projetos')}
					>
						Cancelar
					</button>
					<Button type='submit'>Adicionar</Button>
				</div>
					
			</form>
			<ToastContainer />
		</>
	)
}

export default CriarProjeto
