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
              <Link href="/projects" className="hover:text-gray-300">Projetos</Link>
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
      <div className="flex items-center justify-center min-h-screen">
        <Card className={cn("w-[380px]", className)} {...props}>
          <CardHeader className="flex flex-col items-center">
            <CardTitle className="text-3xl font-bold">PPE</CardTitle>
            <CardDescription className="text-2x1 font-bold ">Digite suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-col items-center space-y-4 rounded-md border p-4">
              <input type="text" placeholder="Registro Acadêmico" className="p-2 border rounded-md w-full" />
              <input type="password" placeholder="Senha" className="p-2 border rounded-md w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      <footer className="w-full bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className='text-sm'>© 2024 Portal Pesquisa e Extensão. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Login;