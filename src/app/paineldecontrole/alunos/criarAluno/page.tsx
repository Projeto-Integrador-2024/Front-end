"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"

export function criarAluno(){
    const router = useRouter();

    return(
    <form className="flex items-center justify-center min-h-screen flex-col">
        <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base leading-7 text-center mt-[5%] text-2xl font-bold">Adicionar Aluno</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600 text-center">Preencha os seguintes campos:</p>
            </div>
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Informações Pessoais</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">Digite as informações do aluno.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Nome</label>
                            <div className="mt-2">
                                <input type="text" name="first-name" id="first-name"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Sobrenome</label>
                            <div className="mt-2">
                                <input type="text" name="last-name" id="last-name"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium leading-6 text-gray-900">CPF</label>
                            <div className="mt-2">
                                <input className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div className="sm:col-span-5">
                            <label  className="block text-sm font-medium leading-6 text-gray-900 ">Curso</label>
                            <div className="mt-2">
                                <select id="country" name="country"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                <option>Ciência da Computação</option>
                                </select>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6 mb-[4%]">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => router.push("/paineldecontrole/alunos")}>Cancelar</button>
            <Button>Adicionar</Button>
        </div>
    </form>
    );
} 
export default criarAluno