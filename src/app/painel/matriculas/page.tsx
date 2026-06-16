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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FaAddressCard,
    FaPlus,
    FaSearch,
    FaEdit
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";
import { deleteEnrollment, validateEnrollmentData } from "@/services/enrollments-services";
import { createFilterLink } from "@/utils/filters";

const statusDictionary: Record<string, string> = {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    SUSPENDED: "Suspensa",
    CANCELLED: "Cancelada"
};

export default async function EnrollmentsPage({
    searchParams
}: {
    searchParams: Promise<{
        status?: string;
        studentName?: string;
        groupName?: string;
        day?: string;
        month?: string;
        year?: string;
    }>
}) {
    // data
    const params: any = await searchParams;
    const { query, enrollments }: any = await validateEnrollmentData(params);
    console.log(query);

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaAddressCard className="text-red-700 text-5xl" />
                    Gestão de Matrículas
                </h1>

                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/matriculas/cadastrar" className="hover:!bg-zinc-700">
                            <FaPlus /> Nova Matrícula
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
                        <form method="GET" action="/painel/matriculas" className="bg-white rounded-lg space-y-6 m-2">

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
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'INACTIVE' ? 'bg-gray-400 shadow-sm text-white hover:bg-gray-500' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'INACTIVE', params)} className="!no-underline hover:no-underline">Inativas</Link>
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
                                    <label className="text-sm font-semibold text-gray-700">Turma (Training Group)</label>
                                    <div className="relative w-full mt-2">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="groupName" defaultValue={params.groupName || ""} placeholder="Buscar por turma..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Data de Matrícula</label>
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
                                            type="number" min="2000" max={new Date().getFullYear()} placeholder="Ano"
                                            className="w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px] text-center px-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                                    <a href="/painel/matriculas" className="!no-underline">Limpar</a>
                                </Button>
                                <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                    Filtrar matrículas
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
                        <TableHead>Turma</TableHead>
                        <TableHead>Horário</TableHead>
                        <TableHead>Data da Matrícula</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {enrollments.length > 0 ? (
                        enrollments.map((enrollment: any) => (
                            <TableRow key={enrollment.id}>
                                <TableCell className="max-w-[200px]">
                                    <HoverCard>
                                        <HoverCardTrigger className="truncate cursor-help font-bold block">
                                            {enrollment.student?.name || "Desconhecido"}
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80 h-auto">
                                            <h1 className="font-bold text-gray-700">Detalhes do Aluno</h1>
                                            <p className="mb-2">{enrollment.student?.name}</p>
                                            
                                            <h2 className="font-bold text-gray-700">Turma: </h2>
                                            <p className="mb-2">{enrollment.trainingGroup?.name || "N/A"}</p>
                                            
                                            <h2 className="font-bold text-gray-700">Horário ID: </h2>
                                            <p className="text-sm text-gray-500 truncate">{enrollment.scheduleId}</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                </TableCell>

                                <TableCell>{enrollment.trainingGroup?.name || "N/A"}</TableCell>

                                {/* Assumindo que seu schedule tenha um campo 'name' ou 'time'. Ajuste conforme necessário */}
                                <TableCell>{enrollment.schedule?.name || "N/A"}</TableCell>

                                <TableCell>
                                    {new Date(enrollment.enrollmentDate).toLocaleDateString('pt-BR')}
                                </TableCell>

                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                        enrollment.status === 'INACTIVE' ? 'bg-gray-100 text-gray-700' : 
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {statusDictionary[enrollment.status] || enrollment.status}
                                    </span>
                                </TableCell>

                                <TableCell className="flex justify-end items-center gap-2 py-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/matriculas/${enrollment.id}/atualizar`}>
                                            <FaEdit /> Editar
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={enrollment.id}
                                        message={`Tem certeza que deseja cancelar a matrícula de ${enrollment.student?.name || "este aluno"}?`}
                                        action={deleteEnrollment}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-gray-500 text-lg">
                                Não há matrículas cadastradas no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}