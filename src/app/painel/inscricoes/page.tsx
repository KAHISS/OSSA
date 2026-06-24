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
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { ButtonDelete } from "@/components/ui/ButtonDelete";
import Link from "next/link";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    FaIdCardAlt,
    FaPlus,
    FaSearch,
    FaEdit
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";
import { deleteRegistration, validateRegistrationData } from "@/services/registrations-services";
import { createFilterLink } from "@/utils/filters";

const statusDictionary: Record<string, string> = {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    SUSPENDED: "Suspensa",
    CANCELLED: "Cancelada"
};

export default async function RegistrationsPage({
    searchParams
}: {
    searchParams: Promise<{
        status?: string;
        studentName?: string;
        planTitle?: string;
        day?: string;
        month?: string;
        year?: string;
    }>
}) {
    // data
    const params: any = await searchParams;
    const { registrations }: any = await validateRegistrationData(params);

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaIdCardAlt className="text-red-700 text-5xl" />
                    Inscrições em Planos
                </h1>

                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/inscricoes/cadastrar" className="hover:!bg-zinc-700">
                            <FaPlus /> Nova Inscrição em Plano
                        </Link>
                    </Button>
                </div>
            </div>

            <Accordion
                type="single"
                collapsible
                defaultValue="filters"
                className="w-full bg-card p-4 rounded-lg border"
            >
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors rounded-lg data-[state=open]:rounded-b-none cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800">Filtros de Busca</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form method="GET" action="/painel/registrations" className="bg-white rounded-lg space-y-6 m-2">

                            {(() => {
                                const currentStatus = params.status || 'todos';

                                return (
                                    <div className="flex flex-wrap items-center justify-between w-full gap-4">
                                        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'todos', params)} className="!no-underline hover:no-underline">Todas</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'ACTIVE' ? 'bg-green-500 shadow-sm text-white hover:bg-green-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'ACTIVE', params)} className="!no-underline hover:no-underline">Ativas</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'SUSPENDED' ? 'bg-amber-500 shadow-sm text-white hover:bg-amber-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'SUSPENDED', params)} className="!no-underline hover:no-underline">Suspensas</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'INACTIVE' ? 'bg-gray-400 shadow-sm text-white hover:bg-gray-500' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'INACTIVE', params)} className="!no-underline hover:no-underline">Inativas</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'CANCELLED' ? 'bg-red-500 shadow-sm text-white hover:bg-red-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'CANCELLED', params)} className="!no-underline hover:no-underline">Canceladas</Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome do Aluno</label>
                                    <div className="relative w-full mt-2">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="studentName" defaultValue={params.studentName || ""} placeholder="Buscar por aluno..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Plano</label>
                                    <div className="relative w-full mt-2">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="planTitle" defaultValue={params.planTitle || ""} placeholder="Buscar por plano..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Data de Vencimento</label>
                                    <div className="flex gap-2 mt-2">
                                        <Input
                                            name="day"
                                            defaultValue={params.day || ""}
                                            type="number" min="1" max="31" placeholder="Dia"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="month"
                                            defaultValue={params.month || ""}
                                            type="number" min="1" max="12" placeholder="Mês"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                        <Input
                                            name="year"
                                            defaultValue={params.year || ""}
                                            type="number" min="2000" max={new Date().getFullYear() + 5} placeholder="Ano"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                                    <a href="/painel/inscricoes" className="!no-underline">Limpar</a>
                                </Button>
                                <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                    Filtrar inscrições
                                </Button>
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Table className="text-xl">
                <TableHeader>
                    <TableRow className="font-normal text-[20px]">
                        <TableHead className="w-[200px]">Aluno</TableHead>
                        <TableHead>Plano</TableHead>
                        <TableHead>Início</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {registrations.length > 0 ? (
                        registrations.map((registration: any) => (
                            <TableRow key={registration.id}>
                                <TableCell className="max-w-[200px]">
                                    <HoverCard>
                                        <HoverCardTrigger className="truncate cursor-help font-bold block">
                                            {registration.student?.name || "Desconhecido"}
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 h-auto">
                                            <h1 className="font-bold text-gray-700">Detalhes do Aluno</h1>
                                            <p className="mb-2">{registration.student?.name}</p>

                                            <h2 className="font-bold text-gray-700">Plano: </h2>
                                            <p className="mb-2">{registration.plan?.title || "N/A"}</p>

                                            <h2 className="font-bold text-gray-700">Preço: </h2>
                                            <p className="text-sm text-gray-500">
                                                {registration.plan?.price
                                                    ? `R$ ${Number(registration.plan.price).toFixed(2)}`
                                                    : "N/A"}
                                            </p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>

                                <TableCell>{registration.plan?.title || "N/A"}</TableCell>

                                <TableCell>
                                    {new Date(registration.startDate).toLocaleDateString('pt-BR')}
                                </TableCell>

                                <TableCell>
                                    {new Date(registration.dueDate).toLocaleDateString('pt-BR')}
                                </TableCell>

                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        registration.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        registration.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' :
                                        registration.status === 'SUSPENDED' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {statusDictionary[registration.status] || registration.status}
                                    </span>
                                </TableCell>

                                <TableCell className="flex justify-end items-center gap-2 py-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/inscricoes/${registration.id}/atualizar`}>
                                            <FaEdit /> Editar
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={registration.id}
                                        message={`Tem certeza que deseja cancelar a Inscrição de ${registration.student?.name || "este aluno"} no plano "${registration.plan?.title || ""}"?`}
                                        action={deleteRegistration}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500 text-lg">
                                Não há Inscrições em planos cadastradas no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
