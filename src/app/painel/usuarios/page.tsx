import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";

import { ButtonDelete } from "@/components/ui/ButtonDelete";

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
import { DELETE } from "@/app/api/usuarios/[id]/route";

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

async function deletarUsuario(formData: FormData) {
    "use server";
    const idDoUsuario = formData.get("id") as string;

    await prisma.user.delete({
        where: { id: idDoUsuario }
    });

    revalidatePath("/painel/usuarios");
}

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{
        tipo?: string;
        sexo?: string;
        nome?: string;
        email?: string;
        telefonePessoal?: string;
        telefoneEmergencia?: string;
        dia?: string;
        mes?: string;
        ano?: string;
        peso?: string;
        comissao?: string;
        faixa?: string;
        grau?: string;
    }>
}) {

    const reverseBeltDictionary: Record<string, string> = {
        branca: 'WHITE',
        azul: 'BLUE',
        roxa: 'PURPLE',
        marrom: 'BROWN',
        preta: 'BLACK',
        coral: 'CORAL',
        vermelha: 'RED'
    };

    const params = await searchParams;
    const filtroTipo = params.tipo || 'todos';
    const filtroSexo = params.sexo || 'todos';
    const buscaNome = params.nome || '';
    const buscaEmail = params.email || '';
    const buscaTelefonePessoal = params.telefonePessoal || '';
    const buscaTelefoneEmergencia = params.telefoneEmergencia || '';

    const buscaDia = params.dia || '';
    const buscaMes = params.mes || '';
    const buscaAno = params.ano || '';
    const buscaPeso = params.peso || '';
    const buscaComissao = params.comissao || '';

    const buscaFaixa = params.faixa || 'todas';
    const buscaGrau = params.grau || 'todos';

    const criarLinkFiltro = (nomeDoFiltro: string, valor: string) => {
        const novosParametros = new URLSearchParams(params as Record<string, string>);
        novosParametros.set(nomeDoFiltro, valor);
        return `?${novosParametros.toString()}`;
    };

    const queryWhere: any = {};
    if (filtroTipo === 'alunos') queryWhere.type = 'Student';
    if (filtroTipo === 'instrutores') queryWhere.type = 'Instructor';
    if (filtroTipo === 'admins') queryWhere.type = 'Admin';
    if (filtroSexo === 'm') queryWhere.sex = 'M';
    if (filtroSexo === 'f') queryWhere.sex = 'F';
    if (buscaNome) queryWhere.name = { startsWith: buscaNome, mode: 'insensitive' };
    if (buscaEmail) queryWhere.email = { contains: buscaEmail, mode: 'insensitive' };
    if (buscaTelefonePessoal) queryWhere.phone = { contains: buscaTelefonePessoal };
    if (buscaTelefoneEmergencia) queryWhere.emergency_phone = { contains: buscaTelefoneEmergencia };
    if (buscaPeso) {
        queryWhere.weight = parseFloat(buscaPeso);
    }
    if (buscaComissao) {
        queryWhere.instructor = {
            commissionPerStudent: parseFloat(buscaComissao)
        };
    }

    if (buscaFaixa !== 'todas' || buscaGrau !== 'todos') {
        const condicaoFaixaGrau: any = {};

        if (buscaFaixa !== 'todas') {
            condicaoFaixaGrau.belt = reverseBeltDictionary[buscaFaixa] || buscaFaixa.toUpperCase();
        }

        if (buscaGrau !== 'todos') {
            condicaoFaixaGrau.stripe = parseInt(buscaGrau);
        }

        queryWhere.OR = [
            { student: { is: condicaoFaixaGrau } },
            { instructor: { is: condicaoFaixaGrau } }
        ];
    }

    if (buscaAno) {
        const anoNum = parseInt(buscaAno);
        let startDate, endDate;

        if (buscaMes) {
            const mesNum = parseInt(buscaMes);
            if (buscaDia) {
                const diaNum = parseInt(buscaDia);
                startDate = new Date(Date.UTC(anoNum, mesNum - 1, diaNum, 0, 0, 0));
                endDate = new Date(Date.UTC(anoNum, mesNum - 1, diaNum, 23, 59, 59));
            } else {
                startDate = new Date(Date.UTC(anoNum, mesNum - 1, 1, 0, 0, 0));
                endDate = new Date(Date.UTC(anoNum, mesNum, 0, 23, 59, 59));
            }
        } else {
            startDate = new Date(Date.UTC(anoNum, 0, 1, 0, 0, 0));
            endDate = new Date(Date.UTC(anoNum, 11, 31, 23, 59, 59));
        }

        queryWhere.birth_date = { gte: startDate, lte: endDate };
    }

    let users = await prisma.user.findMany({
        where: queryWhere,
        include: {
            student: true,
            instructor: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!buscaAno && (buscaMes || buscaDia)) {
        users = users.filter((user) => {
            if (!user.birth_date) return false;

            const dataNascimento = new Date(user.birth_date);
            const mesBanco = dataNascimento.getUTCMonth() + 1;
            const diaBanco = dataNascimento.getUTCDate();

            let passouFiltro = true;

            if (buscaMes && mesBanco !== parseInt(buscaMes)) {
                passouFiltro = false;
            }

            if (buscaDia && diaBanco !== parseInt(buscaDia)) {
                passouFiltro = false;
            }

            return passouFiltro;
        });
    }

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

            <form method="GET" action="/painel/usuarios" className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8 space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Filtros de Busca</h2>

                <input type="hidden" name="tipo" value={filtroTipo} />
                <input type="hidden" name="sexo" value={filtroSexo} />

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
                            <Input name="nome" defaultValue={buscaNome} placeholder="Digite o nome..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">E-mail</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input name="email" defaultValue={buscaEmail} placeholder="Digite o e-mail..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Telefone Pessoal</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input name="telefonePessoal" defaultValue={buscaTelefonePessoal} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Telefone de Emergência</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input name="telefoneEmergencia" defaultValue={buscaTelefoneEmergencia} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Faixa</label>
                        <Select defaultValue={buscaFaixa} name="faixa">
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
                        <Select defaultValue={buscaGrau} name="grau">
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
                        <div className="flex gap-2">
                            <Input
                                name="dia"
                                defaultValue={buscaDia}
                                type="number" min="1" max="31" placeholder="Dia"
                                className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                            />
                            <Input
                                name="mes"
                                defaultValue={buscaMes}
                                type="number" min="1" max="12" placeholder="Mês"
                                className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                            />
                            <Input
                                name="ano"
                                defaultValue={buscaAno}
                                type="number" min="1900" placeholder="Ano"
                                className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Peso</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input name="peso" defaultValue={buscaPeso} placeholder="Digite o peso..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Comissão</label>
                        <div className="relative w-full">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input name="comissao" defaultValue={buscaComissao} placeholder="Digite a comissão..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                        <Link href="/painel/usuarios">Limpar</Link>
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold">
                        Filtrar usuários
                    </Button>
                </div>
            </form>
            <Table className="text-base">
                <TableHeader>
                    <TableRow className="font-bold text-[20px]">
                        <TableHead className="w-[150px]">Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Telefone Pessoal</TableHead>
                        <TableHead>Telefone Emergencia</TableHead>
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

                                <TableCell>{user.emergency_phone}</TableCell>

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

                                <TableCell className="flex justify-end items-center gap-2 py-4">

                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <FaEdit /> Editar
                                    </Button>

                                    <ButtonDelete
                                        id={user.id}
                                        message={`Tem certeza que deseja apagar o registro de ${user.name}?`}
                                        action={deletarUsuario}
                                    />

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} className="h-24 text-center text-gray-500 text-lg">
                                Não há usuários cadastrados no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}