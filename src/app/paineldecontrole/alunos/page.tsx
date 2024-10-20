import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function alunos() {
  return (
    <div>
        <Table className="max-w-[600px] w-full mx-auto border mt-[10%]">
          <TableCaption className="caption-top text-3xl font-bold mb-[2%]">Lista de alunos.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-center">Registro Acadêmico</TableHead>
                <TableHead className="text-center">Nome Completo</TableHead>
                <TableHead className="text-center">CPF</TableHead>
                <TableHead className="text-center">Curso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">a0000001</TableCell>
                <TableCell className="text-center">Guilherme Inoe</TableCell>
                <TableCell className="text-center">090.090.090-09</TableCell>
                <TableCell className="text-center">Ciência da Computação</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">a0000002</TableCell>
                <TableCell className="text-center">João Pedro Inoe</TableCell>
                <TableCell className="text-center">192.195.790-19</TableCell>
                <TableCell className="text-center">Ciência da Computação</TableCell>
              </TableRow>

            </TableBody>
        </Table>
        <div className="flex flex-row max-w-[10%] max-w-[600px] w-full mx-auto mt-[5%] items-center justify-center gap-x-[4%]">
          <Button className="w-full">
              Adicionar Aluno
          </Button>

          <Button className="w-full" >
              Remover Aluno
          </Button>

          <Button className="w-full" >
              Editar Aluno
          </Button>
        </div>
    </div>
  )
}

export default alunos;