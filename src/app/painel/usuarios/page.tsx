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
import { GET } from "@/app/api/usuarios/route";

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
});

interface User {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    weight?: number;
    type?: string;
    status?: string;
}

export default async function UsersPage() {
    const users = await (await GET()).json();

    return (
        <div className={`my-10 mx-10 font-thin ${oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${bebas.className} flex items-center gap-3`}>
                    <FaUsers className="text-red-700" />
                    Gestão de Usuários
                </h1>

                <div className="w-full sm:w-auto flex justify-center">
                    <Button size="sm" className=" hover:bg-teal-900 text-xl h-10 px-6">
                        Cadastrar Usuário
                    </Button>
                </div>
            </div>

            {users &&
                <Table className="text-base">
                    <TableHeader>
                        <TableRow className="font-bold text-[20px]">
                            <TableHead className="w-[100px]">Usuário</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Peso</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Ação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: User) => (
                            <TableRow key={user.id}>
                                <TableCell className="max-w-[150px]">
                                    <HoverCard>
                                        <HoverCardTrigger asChild className="truncate cursor-help font-bold">
                                            <div>
                                                {user.name}
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <h1>Nome Completo: </h1>
                                            <p>{user.name}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.weight}Kg</TableCell>
                                <TableCell>
                                    {user.type === 'Student'
                                        ? 'Aluno'
                                        : user.type === 'Instructor'
                                            ? 'Instrutor'
                                            : 'Administrador'}
                                </TableCell>
                                <TableCell className="flex justify-end gap-2 py-4">
                                    <Button size="sm" variant="outline" className="text-[18px] text-black hover:bg-red-50 hover:border-red-500 h-10 w-20">Editar</Button>
                                    <Button size="sm" className="text-[18px] bg-red-600 hover:bg-red-700 text-white h-10 w-20">Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>}
        </div>
    );
}