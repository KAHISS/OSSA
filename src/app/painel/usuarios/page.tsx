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

const beltDictionary: Record<string, string> = {
    WHITE: "Branca",
    BLUE: "Azul",
    PURPLE: "Roxa",
    BROWN: "Marrom",
    BLACK: "Preta",
    CORAL: "Coral",
    RED: "Vermelha"
};

export default async function UsersPage({ searchParams }: { searchParams: { tipo?: string, sexo?: string } }) {
    const users = await prisma.user.findMany({
        include: {
            student: true,
            instructor: true,
        }
    });

    const params = await searchParams;

    const filtroTipo = params.tipo || 'todos';
    const filtroSexo = params.sexo || 'todos';

    const criarLinkFiltro = (nomeDoFiltro: string, valor: string) => {
        const novosParametros = new URLSearchParams(params as Record<string, string>);
        novosParametros.set(nomeDoFiltro, valor);
        return `?${novosParametros.toString()}`;
    };

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

                <div className="flex flex-wrap items-center justify-between w-full gap-4">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroTipo === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('tipo', 'todos')}>Todos</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroTipo === 'alunos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('tipo', 'alunos')}>Alunos</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroTipo === 'instrutores' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('tipo', 'instrutores')}>Instrutores</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroTipo === 'admins' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('tipo', 'admins')}>Admins</Link>
                        </Button>
                    </div>

                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroSexo === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('sexo', 'todos')}>Todos</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroSexo === 'm' ? 'bg-cyan-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('sexo', 'm')}>Homens</Link>
                        </Button>
                        <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtroSexo === 'f' ? 'bg-pink-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                            <Link href={criarLinkFiltro('sexo', 'f')}>Mulheres</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o nome..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">E-mail</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o e-mail..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Telefone Pessoal</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>
                
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Telefone de Emergência</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Faixa</label>
                        <Select defaultValue="todas">
                            <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                <SelectValue placeholder="Selecione a faixa" />
                            </SelectTrigger>
                            <SelectContent className={oswald.className}>
                                <SelectGroup>
                                    <SelectLabel>Faixas</SelectLabel>
                                    <SelectItem value="todas"><span className="ml-6">Todas as faixas</span></SelectItem>
                                    <SelectItem value="branca">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm shadow-sm"></div>
                                            <span>Faixa Branca</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="azul">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                                            <span>Faixa Azul</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="roxa">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-purple-600 rounded-sm shadow-sm"></div>
                                            <span>Faixa Roxa</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="marrom">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-[#5C4033] rounded-sm shadow-sm"></div>
                                            <span>Faixa Marrom</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="preta">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-black rounded-sm shadow-sm"></div>
                                            <span>Faixa Preta</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="coral">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-sm shadow-sm bg-[linear-gradient(to_bottom_right,#ef4444_50%,#000000_50%)]"></div>
                                            <span>Faixa Coral (Vermelha e Preta)</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="vermelha">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-red-600 rounded-sm shadow-sm"></div>
                                            <span>Faixa Vermelha</span>
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Grau</label>
                        <Select defaultValue="todos">
                            <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                <SelectValue placeholder="Selecione o grau" />
                            </SelectTrigger>
                            <SelectContent className={oswald.className}>
                                <SelectGroup>
                                    <SelectLabel>Graus</SelectLabel>
                                    <SelectItem value="todos">Todos os graus</SelectItem>
                                    <SelectItem value="0">0</SelectItem>
                                    <SelectItem value="1">1</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Data de Nascimento</label>
                        <Input type="date" className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                    </div>


                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Peso</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o peso..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Comissão</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
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
                        <TableHead>Sexo</TableHead>
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
                                            <h1 className="font-bold">Nome Completo: </h1>
                                            <p>{user.name} {user.last_name}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.sex === 'M' ? 'Masc.' : user.sex === 'F' ? 'Fem.' : '-'}</TableCell>

                                <TableCell>{user.phone}</TableCell>

                                <TableCell>
                                    {user.birth_date ? new Date(user.birth_date).toLocaleDateString('pt-BR') : '-'}
                                </TableCell>

                                <TableCell>{user.weight ? `${user.weight.toString()}Kg` : '-'}</TableCell>

                                <TableCell className="capitalize">
                                    {(() => {
                                        const userBelt = user.student?.belt || user.instructor?.belt;

                                        return userBelt ? beltDictionary[userBelt] || userBelt : '-';
                                    })()}
                                </TableCell>

                                <TableCell>
                                    {user.student?.stripe ?? user.instructor?.stripe ?? '-'}
                                </TableCell>

                                <TableCell>
                                    {user.type === 'Student'
                                        ? 'Aluno'
                                        : user.type === 'Instructor'
                                            ? 'Instrutor'
                                            : 'Administrador'}
                                </TableCell>

                                <TableCell>
                                    {user.instructor?.commissionPerStudent ? `R$ ${user.instructor.commissionPerStudent.toString()}` : '-'}
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
                            <TableCell colSpan={11} className="h-24 text-center text-gray-500 text-lg">
                                Não há usuários cadastrados no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}