import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import axios from "axios"
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
  return (
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
  )
}

export default Login;