import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function professores() {
  return (
    <Table className="max-w-[600px] w-full mx-auto border mt-[10%]">
      <TableCaption className="caption-top text-3xl font-bold mb-[2%]">Lista de professores.</TableCaption>
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
            <TableCell className="font-medium">p0000001</TableCell>
            <TableCell className="text-center">rag do grau</TableCell>
            <TableCell className="text-center">020.030.040-19</TableCell>
            <TableCell className="text-center">Ciência da Computação</TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">p0000002</TableCell>
            <TableCell className="text-center">fofoleiss</TableCell>
            <TableCell className="text-center">122.295.590-49</TableCell>
            <TableCell className="text-center">Ciência da Computação</TableCell>
          </TableRow>

        </TableBody>
    </Table>
)
}

export default professores;