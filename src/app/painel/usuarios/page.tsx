import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FaUsers, FaUserPlus } from 'react-icons/fa';
import { Bebas_Neue, Oswald } from 'next/font/google';

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['300', '500'],
});

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
});

export default function UsersPage() {
    return (
        <div className={`my-10 mx-10 font-thin ${oswald.className}`}>
            <div className="flex justify-between items-center mb-8">
                <h1 className={`text-5xl ${bebas.className} flex items-center gap-3`}>
                    <FaUsers className="text-red-700" />
                    Gestão de Usuários
                </h1>
                <Button size="sm" className="bg-teal-800 hover:bg-teal-900 text-xl h-10 px-6">
                    Cadastrar Usuário
                </Button>
            </div>

            <Table className="text-xl">
                <TableHeader>
                    <TableRow className="font-normal text-[22px]">
                        <TableHead className="w-[100px]">Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Peso</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="max-w-[150px]">
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <div className="truncate cursor-help font-medium">
                                        João de Santo Cristo Silva Sauro Terceiro
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                    <h1>Nome Completo: </h1>
                                    <p>João de Santo Cristo Silva Sauro Terceiro</p>
                                </HoverCardContent>
                            </HoverCard>
                        </TableCell>
                        <TableCell>joao.silva@example.com</TableCell>
                        <TableCell>+55 11 97777-7777</TableCell>
                        <TableCell>82Kg</TableCell>
                        <TableCell>Administrador</TableCell>
                        <TableCell>Ativo</TableCell>
                        <TableCell className="flex justify-end gap-2 py-4">
                            <Button size="sm" variant="outline" className="text-[18px] border-blue-500 text-blue-500 hover:bg-blue-50 h-10 w-20">Editar</Button>
                            <Button size="sm" className="text-[18px] bg-red-600 hover:bg-red-700 text-white h-10 w-20">Excluir</Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Maria Oliveira</TableCell>
                        <TableCell>maria.oliveira@example.com</TableCell>
                        <TableCell>+55 21 98888-8888</TableCell>
                        <TableCell>68Kg</TableCell>
                        <TableCell>Aluno(a)</TableCell>
                        <TableCell>Pendente</TableCell>
                        <TableCell className="flex justify-end gap-2 py-4">
                            <Button size="sm" variant="outline" className="text-[18px] border-blue-500 text-blue-500 hover:bg-blue-50 h-10 w-20">Editar</Button>
                            <Button size="sm" className="text-[18px] bg-red-600 hover:bg-red-700 text-white h-10 w-20">Excluir</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Carlos Souza</TableCell>
                        <TableCell>carlos.souza@example.com</TableCell>
                        <TableCell>+55 31 99999-9999</TableCell>
                        <TableCell>90Kg</TableCell>
                        <TableCell>Aluno(a)</TableCell>
                        <TableCell>Suspenso</TableCell>
                        <TableCell className="flex justify-end gap-2 py-4">
                            <Button size="sm" variant="outline" className="text-[18px] border-blue-500 text-blue-500 hover:bg-blue-50 h-10 w-20">Editar</Button>
                            <Button size="sm" className="text-[18px] bg-red-600 hover:bg-red-700 text-white h-10 w-20">Excluir</Button>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Ana Pereira</TableCell>
                        <TableCell>ana.pereira@example.com</TableCell>
                        <TableCell>+55 41 96666-6666</TableCell>
                        <TableCell>55Kg</TableCell>
                        <TableCell>Instrutor(a)</TableCell>
                        <TableCell>Inativo</TableCell>
                        <TableCell className="flex justify-end gap-2 py-4">
                            <Button size="sm" variant="outline" className="text-[18px] border-blue-500 text-blue-500 hover:bg-blue-50 h-10 w-20">Editar</Button>
                            <Button size="sm" className="text-[18px] bg-red-600 hover:bg-red-700 text-white h-10 w-20">Excluir</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}