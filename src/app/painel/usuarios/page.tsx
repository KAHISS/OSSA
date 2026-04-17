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

import Link from "next/link";

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

export default async function UsersPage({ searchParams }: { searchParams: { tipo?: string } }) {
    const users = await prisma.user.findMany({
        include: {
            student: true,
            instructor: true,
        }
    });

    const params = await searchParams;

    const filtroAtual = params.tipo || 'todos';

    return (
        <div className={`my-10 mx-10 font-thin ${oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${bebas.className} flex items-center gap-3`}>
                    <FaUsers className="text-red-700 text-5xl" />
                    Gestão de Usuários
                </h1>

                <div className="flex items-center gap-3">
                    <Button className="bg-zinc-900 hover:bg-black text-white h-15 w-50 px-6 text-xl font-semibold flex items-center gap-2">
                        <FaUserPlus /> Cadastrar Usuário
                    </Button>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Filtros de Busca</h2>

                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit mx-auto">
                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroAtual === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                        <Link href="?tipo=todos">Todos</Link>
                    </Button>
                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroAtual === 'alunos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                        <Link href="?tipo=alunos">Alunos</Link>
                    </Button>
                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroAtual === 'instrutores' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                        <Link href="?tipo=instrutores">Instrutores</Link>
                    </Button>
                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroAtual === 'admins' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                        <Link href="?tipo=admins">Admins</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Faixa</label>
                        <Select defaultValue="todas">
                            <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                <SelectValue placeholder="Selecione a faixa" />
                            </SelectTrigger>
                            <SelectContent className={oswald.className}>
                                <SelectGroup>
                                    <SelectLabel>Graduação</SelectLabel>
                                    <SelectItem value="todas">Todas as faixas</SelectItem>
                                    <SelectItem value="branca">Faixa Branca</SelectItem>
                                    <SelectItem value="azul">Faixa Azul</SelectItem>
                                    <SelectItem value="roxa">Faixa Roxa</SelectItem>
                                    <SelectItem value="marrom">Faixa Marrom</SelectItem>
                                    <SelectItem value="preta">Faixa Preta</SelectItem>
                                    <SelectItem value="coral">Faixa Coral (Vermelha e Preta)</SelectItem>
                                    <SelectItem value="vermelha">Faixa Vermelha</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Data de Nascimento</label>

                        <Input
                            type="date"
                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Buscar por</label>
                        <Select defaultValue="name">
                            <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                <SelectValue placeholder="Pesquisar por..." />
                            </SelectTrigger>
                            <SelectContent className={oswald.className}>
                                <SelectGroup>
                                    <SelectItem value="name">Nome Completo</SelectItem>
                                    <SelectItem value="email">E-mail</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Termo da busca</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Digite sua busca..."
                                className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                            />
                        </div>
                    </div>

                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                        Limpar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold">
                        Filtrar usuários
                    </Button>
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
        </div>
    )
}