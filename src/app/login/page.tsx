'use client'

import axios from 'axios'
import { useState } from 'react'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'

export default function Login() {
    const router = useRouter()

    const [ra, setRa] = useState('') // Estado para armazenar o Registro Acadêmico
    const [password, setPassword] = useState('') // Estado para armazenar a senha

    const handleLogin = async () => {
    if (!ra || !password) {
        toast.error('Por favor, preencha todos os campos.')
        return
    }

    const isSIAPE = /^[0-9]{7}$/.test(ra)

    try {
        const response = await axios.post(`${baseURL}/login`, {
            username: ra,
            senha: password,
            isSIAPE: isSIAPE,
        }, {
            withCredentials: true // Incluir cookies na requisição
        })

        if (response.status === 200) {
            const nome = response.data.sucesso || 'usuário!'
            const tipo = response.data.tipo
            toast.success(`Bem-vindo, ${nome}`)
            console.log(`Login realizado com sucesso!`)
            if (tipo === 'professor') {
                router.push('/professor-dashboard')
            } else if (tipo === 'aluno') {
                router.push('/aluno')
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                toast.error(error.response.data.erro || 'Erro ao realizar login. Verifique suas credenciais.')
                console.error('Erro no servidor:', error.response.data.erro || 'Erro desconhecido')
            } else {
                toast.error('Erro na conexão com o servidor.')
                console.error('Erro na conexão com o servidor.')
            }
        } else {
            toast.error('Erro desconhecido.')
            console.error('Erro desconhecido:', error)
        }
    }
}


    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <div className="mb-4">
                    <label htmlFor="ra" className="block text-sm font-medium text-gray-700">Registro Acadêmico (RA)</label>
                    <input type="text" id="ra" className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={ra} onChange={(e) => setRa(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                    <input type="password" id="password" className="mt-1 p-2 w-full border border-gray-300 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Login</button>
                <p className="mt-4 text-sm text-gray-600">Não possui uma conta? <Link href="/cadastro" className="text-blue-500 hover:text-blue-600">Cadastre-se</Link></p>
            </div>
        </div>
    )
}
