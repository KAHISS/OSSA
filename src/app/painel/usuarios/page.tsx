import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { fonts } from "@/utils/fonts";
import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/services/users-service";
import { createFilterLink } from "@/utils/filters";

const beltDictionary: Record<string, string> = {
    WHITE: "Branca",
    BLUE: "Azul",
    PURPLE: "Roxa",
    BROWN: "Marrom",
    BLACK: "Preta",
    CORAL: "Coral",
    RED: "Vermelha",
    GRAY: "Cinza"
};

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{
        type?: string;
        genre?: string;
        name?: string;
        email?: string;
        personalPhone?: string;
        emergencyPhone?: string;
        day?: string;
        month?: string;
        year?: string;
        weight?: string;
        commission?: string;
        belt?: string;
        stripe?: string;
    }>
}) {

    const params = await searchParams;
    const filtrotype = params.type || 'todos';
    const filtrogenre = params.genre || 'todos';
    const buscaname = params.name || '';
    const buscaEmail = params.email || '';
    const buscapersonalPhone = params.personalPhone || '';
    const buscaemergencyPhone = params.emergencyPhone || '';

    const buscaday = params.day || '';
    const buscamonth = params.month || '';
    const buscayear = params.year || '';
    const buscaweight = params.weight || '';
    const buscacommission = params.commission || '';

    const buscabelt = params.belt || 'todas';
    const buscastripe = params.stripe || 'todos';

    const queryWhere: any = {};
    if (filtrotype === 'alunos') queryWhere.type = 'Student';
    if (filtrotype === 'instrutores') queryWhere.type = 'Instructor';
    if (filtrotype === 'admins') queryWhere.type = 'Admin';
    if (filtrogenre === 'm') queryWhere.sex = 'M';
    if (filtrogenre === 'f') queryWhere.sex = 'F';
    if (buscaname) queryWhere.name = { startsWith: buscaname, mode: 'insensitive' };
    if (buscaEmail) queryWhere.email = { contains: buscaEmail, mode: 'insensitive' };
    if (buscapersonalPhone) queryWhere.phone = { contains: buscapersonalPhone };
    if (buscaemergencyPhone) queryWhere.emergency_phone = { contains: buscaemergencyPhone };
    if (buscaweight) {
        queryWhere.weight = parseFloat(buscaweight);
    }
    if (buscacommission) {
        queryWhere.instructor = {
            commissionPerStudent: parseFloat(buscacommission)
        };
    }

    if (buscabelt !== 'todas' || buscastripe !== 'todos') {
        const condicaobeltstripe: any = {};

        if (buscabelt !== 'todas') {
            const [ belt ] = Object.entries(beltDictionary).find(([key, val]) => val === buscabelt) || [buscabelt.toLocaleUpperCase()];
            condicaobeltstripe.belt = belt;
        }

        if (buscastripe !== 'todos') {
            condicaobeltstripe.stripe = parseInt(buscastripe);
        }

        queryWhere.OR = [
            { student: { is: condicaobeltstripe } },
            { instructor: { is: condicaobeltstripe } }
        ];
    }

    if (buscayear) {
        const yearNum = parseInt(buscayear);
        let startDate, endDate;

        if (buscamonth) {
            const monthNum = parseInt(buscamonth);
            if (buscaday) {
                const dayNum = parseInt(buscaday);
                startDate = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 0, 0, 0));
                endDate = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 23, 59, 59));
            } else {
                startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
                endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59));
            }
        } else {
            startDate = new Date(Date.UTC(yearNum, 0, 1, 0, 0, 0));
            endDate = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59));
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

    if (!buscayear && (buscamonth || buscaday)) {
        users = users.filter((user) => {
            if (!user.birth_date) return false;

            const dataNascimento = new Date(user.birth_date);
            const monthBanco = dataNascimento.getUTCMonth() + 1;
            const dayBanco = dataNascimento.getUTCDate();

            let passouFiltro = true;

            if (buscamonth && monthBanco !== parseInt(buscamonth)) {
                passouFiltro = false;
            }

            if (buscaday && dayBanco !== parseInt(buscaday)) {
                passouFiltro = false;
            }

            return passouFiltro;
        });
    }

    return (
        <div className={`my-10 mx-10 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUsers className="text-red-700 text-5xl" />
                    Gestão de Usuários
                </h1>

                <div className="flex items-center gap-3">
                    <Button className="bg-zinc-900 hover:bg-black text-white h-15 w-50 px-6 text-xl font-semibold flex items-center gap-2">
                        <FaUserPlus /> Cadastrar Usuário
                    </Button>
                </div>
            </div>
            <Accordion
                type="single"
                collapsible
                defaultValue="shipping"
                className="w-full bg-card p-4 rounded-lg border"
            >
                <AccordionItem value="teste">
                    <AccordionTrigger>
                        <h2 className="text-xl font-bold text-gray-800">Filtros de Busca</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form method="GET" action="/painel/usuarios" className="bg-white rounded-lg space-y-6">

                            <input type="hidden" name="type" value={filtrotype} />
                            <input type="hidden" name="genre" value={filtrogenre} />

                            <div className="flex flex-wrap items-center justify-between w-full gap-4">
                                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrotype === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'todos', params)}>Todos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrotype === 'alunos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'alunos', params)}>Alunos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrotype === 'instrutores' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'instrutores', params)}>Instrutores</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrotype === 'admins' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'admins', params)}>Admins</Link>
                                    </Button>
                                </div>

                                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrogenre === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'todos', params)}>Todos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrogenre === 'm' ? 'bg-cyan-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'm', params)}>Homens</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${filtrogenre === 'f' ? 'bg-pink-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'f', params)}>Mulheres</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">name Completo</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="name" defaultValue={buscaname} placeholder="Digite o name..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
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
                                        <Input name="personalPhone" defaultValue={buscapersonalPhone} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Telefone de Emergência</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="emergencyPhone" defaultValue={buscaemergencyPhone} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">belt</label>
                                    <Select defaultValue={buscabelt} name="belt">
                                        <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                            <SelectValue placeholder="Selecione a belt" />
                                        </SelectTrigger>
                                        <SelectContent className={fonts.oswald.className}>
                                            <SelectGroup>
                                                <SelectLabel>belts</SelectLabel>
                                                <SelectItem value="todas"><span className="ml-6">Todas as belts</span></SelectItem>
                                                <SelectItem value="Branca">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm shadow-sm"></div>
                                                        <span>belt Branca</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Azul">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                                                        <span>belt Azul</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Roxa">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-purple-600 rounded-sm shadow-sm"></div>
                                                        <span>belt Roxa</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Marrom">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-[#5C4033] rounded-sm shadow-sm"></div>
                                                        <span>belt Marrom</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Preta">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-black rounded-sm shadow-sm"></div>
                                                        <span>belt Preta</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Coral">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-sm shadow-sm bg-[linear-gradient(to_bottom_right,#ef4444_50%,#000000_50%)]"></div>
                                                        <span>belt Coral (Vermelha e Preta)</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Vermelha">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 bg-red-600 rounded-sm shadow-sm"></div>
                                                        <span>belt Vermelha</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">stripe</label>
                                    <Select defaultValue={buscastripe} name="stripe">
                                        <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                            <SelectValue placeholder="Selecione o stripe" />
                                        </SelectTrigger>
                                        <SelectContent className={fonts.oswald.className}>
                                            <SelectGroup>
                                                <SelectLabel>stripes</SelectLabel>
                                                <SelectItem value="todos">Todos os stripes</SelectItem>
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
                                            name="day"
                                            defaultValue={buscaday}
                                            type="number" min="1" max="31" placeholder="day"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="month"
                                            defaultValue={buscamonth}
                                            type="number" min="1" max="12" placeholder="Mês"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="year"
                                            defaultValue={buscayear}
                                            type="number" min="1900" placeholder="year"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">weight</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="weight" defaultValue={buscaweight} placeholder="Digite o weight..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Comissão</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="commission" defaultValue={buscacommission} placeholder="Digite a comissão..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
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
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Table className="text-base">
                <TableHeader>
                    <TableRow className="font-bold text-[20px]">
                        <TableHead className="w-[150px]">Usuário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>genre</TableHead>
                        <TableHead>Telefone Pessoal</TableHead>
                        <TableHead>Telefone Emergencia</TableHead>
                        <TableHead>Nascimento</TableHead>
                        <TableHead>weight</TableHead>
                        <TableHead>belt</TableHead>
                        <TableHead>stripe</TableHead>
                        <TableHead>type</TableHead>
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
                                            <h1 className="font-bold">name Completo: </h1>
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
                                        action={deleteUser}
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