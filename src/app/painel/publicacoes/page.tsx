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
import { Input } from "@/components/ui/input";
import { FaEdit, FaSearch, FaRegNewspaper, FaPlus } from 'react-icons/fa';
import { fonts } from "@/utils/fonts";
import { deletePublication } from "@/services/publication-services";
import { prisma } from "@/lib/prisma";

export default async function PublicationsPage({
    searchParams,
}: {
    searchParams: Promise<{
        title?: string;
        authorId?: string;
        content?: string;
    }>;
}) {
    // Desembrulha os parâmetros de busca passados pela URL no servidor
    const resolvedSearchParams = await searchParams;
    const { title, authorId, content } = resolvedSearchParams;

    // Constrói dinamicamente o objeto de condições (filtros) do Prisma
    const whereConditions: any = {};

    if (title) {
        whereConditions.title = {
            contains: title,
            mode: "insensitive",
        };
    }

    if (authorId && authorId !== "all") {
        // Filtra exatamente pelo ID do instrutor selecionado no select
        whereConditions.instructorId = {
            equals: authorId, 
        };
    }

    if (content) {
        whereConditions.content = {
            contains: content,
            mode: "insensitive",
        };
    }

    // Executa as buscas no banco de dados em paralelo no servidor
    const [publications, instructors] = await Promise.all([
        prisma.publication.findMany({
            where: whereConditions,
            include: {
                instructor: true, 
            },
            orderBy: {
                createdAt: 'desc' 
            }
        }),
        // Busca todos os usuários para alimentar o select do filtro
        prisma.user.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    ]);

    const columns = ["Título", "Conteúdo", "Instrutor Responsável", "Data de Criação", "Ações"];

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            
            {/* Header Responsivo */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaRegNewspaper className="text-red-700 text-5xl" />
                    Gestão de Publicações
                </h1>
                 
                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/publicacoes/cadastro" className="hover:!bg-zinc-700">
                            <FaPlus /> Nova Publicação
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Accordion de Filtros */}
            <Accordion type="single" collapsible className="w-full mb-6">
                <AccordionItem value="filtros-publicacao" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors rounded-lg data-[state=open]:rounded-b-none cursor-pointer bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaSearch className="text-gray-500 text-sm" />
                            Filtros de Busca
                        </h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white border rounded-b-lg">
                        <form method="GET" action="/painel/publicacoes" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                
                                {/* Título da Publicação */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Título</label>
                                    <Input 
                                        name="title" 
                                        placeholder="Buscar por título..." 
                                        defaultValue={title || ""} 
                                        className="h-10 text-[16px]" 
                                    />
                                </div>

                                {/* CORREÇÃO AQUI: Mudado de Input de ID para Select de Nome do Instrutor */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Instrutor Responsável</label>
                                    <select 
                                        name="authorId"
                                        defaultValue={authorId || "all"}
                                        className="h-10 text-[16px] w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                                    >
                                        <option value="all">Todos os instrutores</option>
                                        {instructors.map((instructor) => (
                                            <option key={instructor.id} value={instructor.id}>
                                                {instructor.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Conteúdo Informativo */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Conteúdo (Palavra-chave)</label>
                                    <Input 
                                        name="content" 
                                        placeholder="Termo contido no texto..." 
                                        defaultValue={content || ""} 
                                        className="h-10 text-[16px]" 
                                    />
                                </div>
                            </div>

                            {/* Botões do Filtro */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                                    <Link href="/painel/publicacoes" className="!no-underline">Limpar</Link>
                                </Button>
                                <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                    Filtrar
                                </Button>
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Tabela de Resultados */}
            <Table className="text-xl">
              <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead 
                                key={column} 
                                className={column === "Ações" ? "text-right pr-6" : ""}
                            >
                                {column}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {publications.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                Nenhuma publicação encontrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        publications.map((publication) => (
                            <TableRow key={publication.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium max-w-[200px] truncate">
                                    {publication.title}
                                </TableCell>
                                
                                <TableCell className="max-w-[300px] text-zinc-600 text-base font-normal truncate">
                                    {publication.content}
                                </TableCell>
                                
                                <TableCell>
                                    <span className="font-semibold text-zinc-800">
                                        {publication.instructor?.name || "Não informado"}
                                    </span>
                                </TableCell>
                                
                                <TableCell>
                                    {publication.createdAt
                                        ? new Date(publication.createdAt).toLocaleDateString('pt-BR')
                                        : '---'}
                                </TableCell>
                                <TableCell className="flex justify-end items-center gap-2 py-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/publicacoes/${publication.id}/atualizar`}>
                                            <FaEdit /> Editar
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={publication.id}
                                        message={`Tem certeza que deseja apagar a publicação: "${publication.title}"?`}
                                        action={deletePublication}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}