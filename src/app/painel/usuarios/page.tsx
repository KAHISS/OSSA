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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    FaUsers,
    FaUserPlus,
    FaSearch,
    FaEdit,
    FaTrashAlt
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";

import { Bebas_Neue, Oswald } from 'next/font/google';

import { prisma } from "@/lib/prisma";

const oswald = Oswald({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
});

const bebas = Bebas_Neue({
    subsets: ['latin'],
    weight: ['400'],
});

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        include: {
            student: true,
            instructor: true,
        }
    });

    return (
        <div className={`my-10 mx-10 font-thin ${oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${bebas.className} flex items-center gap-3`}>
                    <FaUsers className="text-red-700" />
                    Gestão de Usuários
                </h1>
            </div>

            {users && (
                <div>
                    <div className="mb-8 space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button className="bg-zinc-900 hover:bg-black text-white h-15 w-50 px-6 text-lg font-semibold flex items-center gap-2">
                                    <FaUserPlus /> Cadastrar Usuário
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">

                            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                                <Button variant="ghost" className="bg-white shadow-sm h-9 px-5 rounded-md text-[16px] font-medium text-black hover:bg-white">
                                    Todos
                                </Button>
                                <Button variant="ghost" className="h-9 px-5 rounded-md text-[16px] font-medium text-gray-500 hover:text-black">
                                    Alunos
                                </Button>
                                <Button variant="ghost" className="h-9 px-5 rounded-md text-[16px] font-medium text-gray-500 hover:text-black">
                                    Instrutores
                                </Button>
                                <Button variant="ghost" className="h-9 px-5 rounded-md text-[16px] font-medium text-gray-500 hover:text-black">
                                    Admins
                                </Button>
                            </div>

                            {/* Barra de Pesquisa com Filtro de Categoria */}
                            <div className="flex items-center gap-2 w-full sm:w-auto">

                                {/* Dropdown de "Pesquisar por..." */}
                                <Select defaultValue="name">
                                    <SelectTrigger className="w-[160px] h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                        <SelectValue placeholder="Pesquisar por..." />
                                    </SelectTrigger>
                                    <SelectContent className={oswald.className}>
                                        {/* "optgroup" 1: Dados Pessoais */}
                                        <SelectGroup>
                                            <SelectLabel>Filtros</SelectLabel>
                                            <SelectItem value="name">Nome</SelectItem>
                                            <SelectItem value="last_name">Sobrenome</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="birth_date">Nascimento</SelectItem>
                                            <SelectItem value="belt">Faixa</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                {/* O Input de texto */}
                                <div className="relative w-full sm:w-64">
                                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Digite sua busca..."
                                        className="pl-10 h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table className="text-base">
                        <TableHeader>
                            <TableRow className="font-bold text-[20px]">
                                <TableHead className="w-[150px]">Usuário</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Nascimento</TableHead>
                                <TableHead>Peso</TableHead>
                                <TableHead>Faixa</TableHead>
                                <TableHead>Grau</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Comissão</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="max-w-[150px]">
                                            <HoverCard>
                                                <HoverCardTrigger className="truncate cursor-help font-bold block">
                                                    {user.name} {user.last_name}
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-80">
                                                    <h1>Nome Completo: </h1>
                                                    <p>{user.name} {user.last_name}</p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </TableCell>

                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>

                                        <TableCell>
                                            {user.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '-'}
                                        </TableCell>

                                        <TableCell>{user.weight ? `${user.weight.toString()}Kg` : '-'}</TableCell>

                                        <TableCell>{user.student?.belt || '-'}</TableCell>

                                        <TableCell>
                                            {user.student?.stripe || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {user.type === 'Student'
                                                ? 'Aluno'
                                                : user.type === 'Instructor'
                                                    ? 'Instrutor'
                                                    : 'Administrador'}
                                        </TableCell>

                                        <TableCell>
                                            {user.instructor?.commissionPerStudent ? `${user.instructor.commissionPerStudent.toString()}%` : '-'}
                                        </TableCell>

                                        <TableCell className="flex justify-end gap-2 py-4">
                                            <Button size="sm" variant="outline" className="text-[16px] text-black hover:bg-red-50 hover:border-red-500 h-10 px-3 flex items-center gap-2">
                                                <FaEdit /> Editar
                                            </Button>
                                            <Button size="sm" className="text-[16px] bg-red-600 hover:bg-red-700 text-white h-10 px-3 flex items-center gap-2">
                                                <FaTrashAlt /> Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center text-gray-500 text-lg">
                                        Não há usuários cadastrados no momento.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div >
            )}
        </div>
    )
}