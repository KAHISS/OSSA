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
    FaThLarge,
    FaSearch,
    FaEdit,
    FaTrashAlt,
    FaTh,
    FaPlus
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";
import { createFilterLink } from "@/utils/filters";
import { deleteCategory, validateData } from "@/services/categories-services";


export default async function CategoriesPage({
    searchParams
}: {
    searchParams: Promise<{
        name?: string;
        description?: string;
        start_age_group?: string;
        finis_age_group?: string;
        start_weight_range?: string;
        finish_weight_range?: string;
    }>
}) {

    // data
    const params: any = await searchParams;
    const {query, categories}: any = await validateData(params)
    console.log(categories, "fdgfgdfgdfgdfgdg")

    // interface
    const columns = ["Nome", "Descrição", "Faixa etária", "Faixa de peso", "Ações"]

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaTh className="text-red-700 text-5xl" />
                    Gestão de Categorias
                </h1>

                <div className="flex items-center gap-3">
                    <Button className="bg-zinc-900 hover:bg-black text-white h-11 w-50 px-6 text-xl font-semibold flex items-center gap-2">     
                        <Link href="/painel/categorias/cadastrar" className="flex items-center gap-2">
                            <FaPlus /> Nova Categoria
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
                    <AccordionTrigger className="no-underline hover:no-underline">
                        <h2 className="text-xl font-bold text-gray-800 ">Filtros de Busca</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                        <form method="GET" action="/painel/categorias" className="bg-white rounded-lg space-y-6 p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome da categoria</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="name" defaultValue={query.name?.startsWith} placeholder="Digite o name..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Descrição</label>
                                    <div className="relative w-full">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="email" defaultValue={query.description?.contains} placeholder="Digite a descrição..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Faixa etária</label>
                                    <Select defaultValue={query.age_group?.contains} name="belt">
                                        <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                            <SelectValue placeholder="Selecione a faixa etária" />
                                        </SelectTrigger>
                                        <SelectContent className={fonts.oswald.className}>
                                            <SelectGroup>
                                                <SelectLabel>Faixas etárias</SelectLabel>
                                                <SelectItem value="todas"><span className="ml-6">Todas as Faixas Etárias</span></SelectItem>
                                                {
                                                    categories.map((category: any) => (
                                                        <SelectItem value={category.age_group} key={category.id}>
                                                                <span>{category.age_group}</span>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Faixa de Peso</label>
                                    <Select defaultValue={query.weight_range?.contains} name="stripe">
                                        <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                            <SelectValue placeholder="Selecione a faixa de peso"/>
                                        </SelectTrigger>
                                        <SelectContent className={`${fonts.oswald.className}`}>
                                            <SelectGroup>
                                                <SelectLabel>Faixas de Peso</SelectLabel>
                                                <SelectItem value="todas"><span className="ml-6">Todas as Faixas de Peso</span></SelectItem>
                                                {
                                                    categories.map((category: any) => (
                                                        <SelectItem value={category.weight_range} key={category.id}>
                                                                <span>{category.weight_range}</span>
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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

            <Table className="text-base mt-6">
                <TableHeader>
                    <TableRow className="font-bold text-[20px]">
                        {
                            columns.map(column => (
                                column === "Usuario" ? (
                                    <TableHead key={column} className="w-[150px]">{column}</TableHead>
                                ) : (
                                    <TableHead key={column}>{column}</TableHead>
                                )
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length > 0 ? (
                        categories.map((category: any) => (
                            <TableRow key={category.id}>
                                <TableCell className="max-w-[150px] font-bold">
                                    {category.name}
                                </TableCell>

                                <TableCell>{category.description}</TableCell>

                                <TableCell>{category.age_group}</TableCell>

                                <TableCell>{category.weight_range}</TableCell>

                                <TableCell className="flex justify-end items-center gap-2 py-4">

                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/categorias/${category.id}/atualizar`} className="flex items-center gap-2">
                                            <button className="btn btn-warning">Editar</button>
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={category.id}
                                        message={`Tem certeza que deseja apagar o registro de ${category.name}?`}
                                        action={deleteCategory}
                                    />

                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={12} className="h-24 text-center text-gray-500 text-lg">
                                Não há categorias cadastradas no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div >
    )
}