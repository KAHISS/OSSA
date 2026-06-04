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
import { Button } from "@/components/ui/button";
import { ButtonDelete } from "@/components/ui/ButtonDelete";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    FaSearch,
    FaEdit,
    FaTh,
    FaPlus,
    FaClock
} from 'react-icons/fa';
import { fonts } from "@/utils/fonts";
import { deleteTrainingGroup, getInstructorUsers, validateData } from "@/services/training-group-services";


export default async function TrainingGroupsPage({
    searchParams
}: {
    searchParams: Promise<{
        name?: string;
        instructorId?: string;
    }>
}) {

    // data
    const params = await searchParams;
    const [trainingGroups, instructors] = await Promise.all([
        validateData(params),
        getInstructorUsers(),
    ]);
    
    // interface
    const columns = ["Nome da Turma", "Instrutor", "Filial", "Capacidade", "Horários", "Ações"]

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaTh className="text-red-700 text-5xl" />
                    Gestão de Turmas
                </h1>

                <div className="flex items-center gap-3">
                    <Button className="bg-zinc-900 hover:bg-black text-white h-11 w-50 px-6 text-xl font-semibold flex items-center gap-2">     
                        <Link href="/painel/turma/cadastrar" className="flex items-center gap-2">
                            <FaPlus /> Nova Turma
                        </Link>
                    </Button>
                </div>
            </div>
            <Accordion
                type="single"
                collapsible
                defaultValue="shipping"
                className="w-full bg-card p-4 rounded-lg border "
            >
                <AccordionItem value="teste">
                    <AccordionTrigger className="no-underline hover:no-underline cursor-pointer">
                        <h2 className="text-xl font-bold text-gray-800 ">Filtros de Busca</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form method="GET" action="/painel/turma" className="bg-white rounded-lg space-y-6 p-2">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome da Turma</label>
                                    <Input
                                        name="name"
                                        defaultValue={params.name || ""}
                                        placeholder="Pesquisar pelo nome"
                                        className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 focus-visible:ring-zinc-900 text-[16px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Instrutor</label>
                                    <div className="relative w-full mt-2">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            name="instructorId"
                                            defaultValue={params.instructorId || ""}
                                            className="pl-10 pr-3 w-full h-10 bg-white border border-gray-300 rounded-md focus-visible:ring-zinc-900 text-[16px]"
                                        >
                                            <option value="">Todos os instrutores</option>
                                            {instructors.map((instructor) => (
                                                <option key={instructor.id} value={instructor.id}>
                                                    {instructor.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                                    <Link href="/painel/turma" className="!no-underline">Limpar</Link>
                                </Button>
                                <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                    Filtrar Turmas
                                </Button>
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Table className="text-base mt-6">
                <TableHeader>
                    <TableRow className="font-bold text-[20px]">
                        {columns.map((column) => (
                            <TableHead 
                                key={column} 
                                className={
                                    column === "ID Turma" ? "w-[15%]" : 
                                    column === "Ações" ? "text-right" : 
                                    "w-[15%]"
                                }
                            >
                                {column}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trainingGroups.length > 0 ? (
                        trainingGroups.map((trainingGroup) => (
                            <TableRow key={trainingGroup.id}>
                                <TableCell className="max-w-[150px] font-bold">
                                    {trainingGroup.name}
                                </TableCell>

                                <TableCell>{trainingGroup.instructor.name}</TableCell>

                                <TableCell>{trainingGroup.branch?.city ?? "Sem filial"}</TableCell>

                                <TableCell>{trainingGroup.studentCapacity} alunos</TableCell>

                                <TableCell>
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-blue-50 hover:border-blue-500 flex items-center gap-2"
                                        asChild
                                    >
                                        <Link href={`/painel/turma/${trainingGroup.id}/atualizar`} prefetch={false} className="flex items-center gap-2">
                                            <FaClock className="text-red-700" />
                                            {trainingGroup.schedules.length > 0 ? (
                                                <span>{trainingGroup.schedules.length} hor{trainingGroup.schedules.length === 1 ? 'ário' : 'ários'}</span>
                                            ) : (
                                                <span className="text-gray-400">Sem horários</span>
                                            )}
                                        </Link>
                                    </Button>
                                </TableCell>

                                <TableCell className="flex justify-end items-center gap-2 py-4">

                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                        asChild
                                    >                                        
                                        <Link href={`/painel/turma/${trainingGroup.id}/atualizar`} prefetch={false} className="flex items-center gap-2">
                                            <FaEdit /> Editar
                                        </Link>


                                    </Button>

                                    <ButtonDelete
                                        id={trainingGroup.id}
                                        message={`Tem certeza que deseja apagar a turma do instrutor ${trainingGroup.instructor.name}?`}
                                        action={deleteTrainingGroup}
                                    />

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} className="h-24 text-center text-gray-500 text-lg">
                                Não há turmas cadastradas no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}