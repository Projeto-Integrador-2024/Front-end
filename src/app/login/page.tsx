"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import axios from "axios"
import Link from 'next/link';
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


type CardProps = React.ComponentProps<typeof Card>

export function Login({ className, ...props }: CardProps) {
  const router = useRouter();
  return (
    <div className='min-h-screen flex flex-col'>
      <header className="w-full bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/images/Logo_PI.png" alt="Logo" className="h-20" width={80} height={80} />
            <h1 className="text-2xl font-semibold">Portal Pesquisa e Extensão</h1>
          </div>
          
          <nav className="space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/sobre" className="hover:text-gray-300">Sobre</Link>
            <Link href="/contatos" className="hover:text-gray-300">Contato</Link>
            <button
              type="button"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 rounded-md px-4 py-2 transition duration-150"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </nav>
        </div>
      </header>
      <div className="flex items-center justify-center flex-1">
        <Card className={cn("w-[380px]", className)} {...props}>
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-3xl font-bold">PPE</CardTitle>
            <CardDescription className="text-2x1 font-bold">Digite suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-4">
              <input type="text" placeholder="Registro Acadêmico" className="p-2 border rounded-md w-full" />
              <input type="password" placeholder="Senha" className="p-2 border rounded-md w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      <footer className="bg-gray-800 py-5 text-slate-200 text-sm" id="contact">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="lg:w-1/2 w-full text-center lg:text-left mb-4 lg:mb-0">
              <p className="mb-2">1233 Via Rosalina, Campo-Mourão, PR</p>
              <div className="flex flex-col sm:flex-row items-center sm:justify-start sm:space-x-4">
                <p className="mb-2">
                  <a className="hover:underline" href="mailto:suporte@ppe.com.br">suporte@ppe.com.br</a>
                </p>
                <p className="mb-0">
                  <a className="hover:underline" href="tel:+44823456788">(44) 91234-1234</a>
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full text-center lg:text-right">
              <div className="flex justify-center lg:justify-end space-x-4 mb-4">
                <a href="#" aria-label="Facebook" className="text-slate-200 hover:text-blue-500 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter" className="text-slate-200 hover:text-blue-400 transition-colors">
                  <i className="fab fa-twitter-alt"></i>
                </a>
                <a href="#" aria-label="Instagram" className="text-slate-200 hover:text-pink-500 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p className="text-sm">
                COPYRIGHT © 2024. TODOS OS DIREITOS RESERVADOS.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Login;