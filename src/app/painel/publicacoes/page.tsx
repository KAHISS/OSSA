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
import { FaEdit, FaSearch, FaRegNewspaper, FaPlus, FaUser, FaCalendarAlt } from 'react-icons/fa';
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
    const resolvedSearchParams = await searchParams;
    const { title, authorId, content } = resolvedSearchParams;

    const whereConditions: any = {};

    if (title) {
        whereConditions.title = {
            contains: title,
            mode: "insensitive",
        };
    }

    if (authorId && authorId !== "all") {
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
        prisma.user.findMany({
            orderBy: {
                name: 'asc'
            }
        })
    ]);

    return (
        <div className={`my-6 mx-6 pb-24 font-thin relative ${fonts.oswald.className}`}>
            
            {/* Header Limpo */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaRegNewspaper className="text-red-700 text-5xl" />
                    Gestão de Publicações
                </h1>
            </div>

            {/* Accordion de Filtros - Tudo alinhado na mesma linha */}
            <Accordion type="single" collapsible defaultValue="filtros-publicacao" className="w-full mb-8">
                <AccordionItem value="filtros-publicacao" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors rounded-lg data-[state=open]:rounded-b-none cursor-pointer bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FaSearch className="text-gray-500 text-sm" />
                            Filtros de Busca
                        </h2>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-white border rounded-b-lg">
                        <form method="GET" action="/painel/publicacoes" className="w-full">
                            {/* Grid de 4 colunas em telas grandes: 3 para os inputs, 1 para os botões */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                
                                {/* Título */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Título</label>
                                    <Input 
                                        name="title" 
                                        placeholder="Buscar por título..." 
                                        defaultValue={title || ""} 
                                        className="h-10 text-[16px]" 
                                    />
                                </div>

                                {/* Seletor de Instrutores */}
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

                                {/* Conteúdo */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Conteúdo (Palavra-chave)</label>
                                    <Input 
                                        name="content" 
                                        placeholder="Termo contido no texto..." 
                                        defaultValue={content || ""} 
                                        className="h-10 text-[16px]" 
                                    />
                                </div>

                                {/* BOTÕES ALINHADOS NA MESMA LINHA */}
                                <div className="flex gap-2 w-full">
                                    <Button variant="secondary" asChild className="w-1/2 bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 font-semibold text-base">
                                        <Link href="/painel/publicacoes" className="!no-underline flex justify-center items-center">Limpar</Link>
                                    </Button>
                                    <Button type="submit" className="w-1/2 bg-black hover:bg-[#333] text-white h-10 font-semibold text-base cursor-pointer">
                                        Filtrar
                                    </Button>
                                </div>

                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* APRESENTAÇÃO MODERNA: Cards de Publicações */}
            {publications.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border rounded-lg text-zinc-500 text-xl">
                    Nenhuma publicação encontrada com os filtros selecionados.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publications.map((publication) => (
                        <div 
                            key={publication.id} 
                            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group"
                        >
                            {/* Topo do Card: Ações flutuantes discretas */}
                            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-zinc-600 hover:text-black hover:bg-zinc-100"
                                >
                                    <Link href={`/painel/publicacoes/${publication.id}/atualizar`}>
                                        <FaEdit className="text-base" />
                                    </Link>
                                </Button>
                                <ButtonDelete
                                    id={publication.id}
                                    message={`Tem certeza que deseja apagar a publicação: "${publication.title}"?`}
                                    action={deletePublication}
                                />
                            </div>

                            {/* Detalhes do Card */}
                            <div className="space-y-3">
                                {/* Título */}
                                <h3 className={`text-2xl font-bold text-zinc-900 pr-16 line-clamp-1 ${fonts.bebas.className} tracking-wide`}>
                                    {publication.title}
                                </h3>

                                {/* Metadados (Instrutor e Datas) */}
                                <div className="space-y-1.5 text-sm text-zinc-600 font-normal">
                                    <p className="flex items-center gap-2">
                                        <FaUser className="text-red-700 text-xs" />
                                        <span className="font-semibold text-zinc-800">
                                            {publication.instructor?.name || "Não informado"}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2 text-xs text-zinc-500">
                                        <FaCalendarAlt className="text-zinc-400" />
                                        <span>
                                            Criado em: {publication.createdAt ? new Date(publication.createdAt).toLocaleDateString('pt-BR') : '---'}
                                        </span>
                                    </p>
                                    
                                    {/* Validação de Edição Segura */}
                                    {publication.updatedAt && new Date(publication.updatedAt).getTime() > new Date(publication.createdAt).getTime() && (
                                        
                                     <p className="flex items-center gap-2 text-[11px] text-zinc-600 font-bold uppercase tracking-wider pl-4">
                                        <FaCalendarAlt className="text-zinc-400" />
                                     <span>
                                      Editado em: {new Date(publication.updatedAt).toLocaleDateString('pt-BR')}
                                     </span>
                                     </p>
                                    )}
                                </div>

                                <hr className="border-gray-100 my-2" />

                                {/* Conteúdo Textual com limite de linhas */}
                                <p className="text-zinc-700 text-base font-normal leading-relaxed line-clamp-4 whitespace-pre-line">
                                    {publication.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* BOTAO NOVA PUBLICAÇÃO FIXO NO CANTO INFERIOR DIREITO */}
            <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
                <Button 
                    asChild 
                    className="rounded-full bg-red-700 hover:bg-red-800 text-white h-14 px-6 text-lg font-bold shadow-2xl transition-all hover:scale-105 flex items-center gap-2 border-2 border-white"
                >
                    <Link href="/painel/publicacoes/cadastro">
                        <FaPlus className="text-base" /> Nova Publicação
                    </Link>
                </Button>
            </div>

        </div>
    );
}