'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface CreateProjectProps {
  className?: string
  [key: string]: any
}

export const CriarProjeto: React.FC<CreateProjectProps> = ({ className, ...props }) => {
  const router = useRouter()
  const [projects, setProjects] = useState([
    { nome: '', descricao: '', bolsa: 'sem-bolsa', tipo: 'extensao' },
  ])

  const handleCreateProjects = async () => {
    try {
      // Envia todos os projetos em um único request
      const formattedProjects = projects.map((project) => ({
        nome: project.nome,
        descricao: project.descricao,
        bolsa: project.bolsa === 'com-bolsa' ? 'true' : 'false',
        tipo: project.tipo,
        criador_id: 'p0000002', // ID do criador (fixo para este exemplo)
      }))

      const response = await axios.post('http://127.0.0.1:5000/PROFESSOR/CREATE/VAGA', {
        projetos: formattedProjects, // Envia como um array de objetos
      })

      toast.success('Projetos criados com sucesso!')
      setProjects([{ nome: '', descricao: '', bolsa: 'sem-bolsa', tipo: 'extensao' }]) // Reseta o formulário
    } catch (error) {
      toast.error('Erro ao criar projetos!')
      console.error('Erro ao criar projetos:', error)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleCreateProjects()
  }

  const handleAddForm = () => {
    setProjects([...projects, { nome: '', descricao: '', bolsa: 'sem-bolsa', tipo: 'extensao' }])
  }

  const handleRemoveForm = (index: number) => {
    if (projects.length > 1) {
      const updatedProjects = projects.filter((_, i) => i !== index)
      setProjects(updatedProjects)
    } else {
      toast.error('Não é possível remover esta ocorrência!')
    }
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setProjects(newProjects)
  }

  // Verifica se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    return projects.every(
      (project) =>
        project.nome.trim() !== '' &&
        project.descricao.trim() !== '' &&
        (project.bolsa === 'sem-bolsa' || project.bolsa === 'com-bolsa') &&
        (project.tipo === 'extensao' || project.tipo === 'iniciacao-cientifica')
    )
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center min-h-screen flex-col w-[30%] mx-auto"
      >
        {projects.map((project, index) => (
          <div key={index} className="space-y-12 w-full px-4">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base leading-7 text-center mt-[5%] text-2xl font-bold">
                Adicionar Projeto {index + 1}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
                Preencha os seguintes campos:
              </p>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Nome
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={project.nome}
                      onChange={(e) => handleInputChange(index, 'nome', e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Descrição
                  </label>
                  <div className="mt-2">
                    <textarea
                      value={project.descricao}
                      onChange={(e) => handleInputChange(index, 'descricao', e.target.value)}
                      className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 border border-gray-300 p-4 rounded-md">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Bolsa
                  </label>
                  <div className="mt-2 flex flex-col gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`bolsa-${index}`}
                        value="sem-bolsa"
                        checked={project.bolsa === 'sem-bolsa'}
                        onChange={() => handleInputChange(index, 'bolsa', 'sem-bolsa')}
                        className="mr-2"
                      />
                      Sem Bolsa
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`bolsa-${index}`}
                        value="com-bolsa"
                        checked={project.bolsa === 'com-bolsa'}
                        onChange={() => handleInputChange(index, 'bolsa', 'com-bolsa')}
                        className="mr-2"
                      />
                      Com Bolsa
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-3 border border-gray-300 p-4 rounded-md">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Tipo
                  </label>
                  <div className="mt-2 flex flex-col gap-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`tipo-${index}`}
                        value="extensao"
                        checked={project.tipo === 'extensao'}
                        onChange={() => handleInputChange(index, 'tipo', 'extensao')}
                        className="mr-2"
                      />
                      Extensão
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`tipo-${index}`}
                        value="iniciacao-cientifica"
                        checked={project.tipo === 'iniciacao-cientifica'}
                        onChange={() => handleInputChange(index, 'tipo', 'iniciacao-cientifica')}
                        className="mr-2"
                      />
                      Iniciação Científica
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <button
                type="button"
                className="w-[5%] font-semibold bg-transparent rounded-md border border-blue-600 hover:bg-blue-100 hover:text-blue-700 text-blue-600 transition ease-in-out delay-150"
                onClick={handleAddForm}
              >
                +
              </button>

              <button
                type="button"
                className="w-[5%] font-semibold bg-transparent rounded-md border border-red-600 hover:bg-red-100 hover:text-red-700 text-red-600 transition ease-in-out delay-150"
                onClick={() => handleRemoveForm(index)}
              >
                -
              </button>
            </div>
          </div>
        ))}

        <div className="mt-4 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => router.push('/paineldecontrole/projetos')}
          >
            Cancelar
          </button>
          <Button
            className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
            type="submit"
            disabled={!isFormValid()}
          >
            Adicionar
          </Button>
        </div>
      </form>
      <ToastContainer />
    </>
  )
}

export default CriarProjeto
