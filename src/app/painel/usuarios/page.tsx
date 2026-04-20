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
import { User } from "@generated/prisma/client";
import { deleteUser, validateData } from "@/services/users-service";
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

    // data
    const params: any = await searchParams;
    const {query, users}: any = await validateData(params)

    // interface
    const columns = ["Usuario", "Email", "Sexo", "Telefone", "Tipo", "Faixa", "Grau", "Comissão", "Ações"]

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
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

                            <input type="hidden" name="type" value={query.type} />
                            <input type="hidden" name="genre" value={query.genre} />

                            <div className="flex flex-wrap items-center justify-between w-full gap-4">
                                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${!query.type ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'todos', params)}>Todos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.type === 'Student' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'Student', params)}>Alunos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.type === 'Instructor' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'Instructor', params)}>Instrutores</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.type === 'Admin' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('type', 'Admin', params)}>Admins</Link>
                                    </Button>
                                </div>

                                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.genre === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'todos', params)}>Todos</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.genre === 'M' ? 'bg-cyan-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'M', params)}>Homens</Link>
                                    </Button>
                                    <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${query.genre === 'F' ? 'bg-pink-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                        <Link href={createFilterLink('genre', 'F', params)}>Mulheres</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="name" defaultValue={query.name} placeholder="Digite o name..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">E-mail</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="email" defaultValue={query.email} placeholder="Digite o e-mail..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Telefone Pessoal</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="personalPhone" defaultValue={query.personal_phone} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Telefone de Emergência</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="emergencyPhone" defaultValue={query.emergency_phone} placeholder="Digite o telefone..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Faixa</label>
                                    <Select defaultValue={query.belt} name="belt">
                                        <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                            <SelectValue placeholder="Selecione a belt" />
                                        </SelectTrigger>
                                        <SelectContent className={fonts.oswald.className}>
                                            <SelectGroup>
                                                <SelectLabel>Faixas</SelectLabel>
                                                <SelectItem value="todas"><span className="ml-6">Todas as Faixas</span></SelectItem>
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
                                    <Select defaultValue={query.stripe} name="stripe">
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
                                            defaultValue={query.searchDay}
                                            type="number" min="1" max="31" placeholder="day"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="month"
                                            defaultValue={query.searchMonth}
                                            type="number" min="1" max="12" placeholder="Mês"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="year"
                                            defaultValue={query.searchYear}
                                            type="number" min="1900" placeholder="year"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">weight</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="weight" defaultValue={query.weight} placeholder="Digite o weight..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Comissão</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="commission" defaultValue={query.instructor?.commissionPerStudent} placeholder="Digite a comissão..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
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

            <Table className="text-xl">
                <TableHeader>
                    <TableRow className="font-normal text-[20px]">
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
                    {users.length > 0 ? (
                        users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="max-w-[150px]">
                                    <HoverCard>
                                        <HoverCardTrigger className="truncate cursor-help font-bold block">
                                            {user.name}
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                            <h1 className="font-bold">name Completo: </h1>
                                            <p>{user.name}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>

                                <TableCell>{user.email}</TableCell>

                                <TableCell>{user.genre === 'M' ? 'Masc.' : user.genre === 'F' ? 'Fem.' : '-'}</TableCell>

                                <TableCell>{user.phone}</TableCell>

                                <TableCell>
                                    {user.type === 'Student'
                                        ? 'Aluno'
                                        : user.type === 'Instructor'
                                            ? 'Instrutor'
                                            : 'Administrador'}
                                </TableCell>

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