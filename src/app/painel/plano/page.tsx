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
    FaPlus,
    FaGem
} from 'react-icons/fa';
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";
import { createFilterLink } from "@/utils/filters";
import { deletePlan, validateData } from "@/services/plan-services";
import { prisma } from "@/lib/prisma";

// Dicionário padronizado em minúsculas para evitar conflito de maiúsculas/minúsculas ou idioma
const periodTranslations: Record<string, string> = {
    "month": "Mensal",
    "mensal": "Mensal",
    "quarter": "Trimestral",
    "trimestral": "Trimestral",
    "semester": "Semestral",
    "semestral": "Semestral",
    "year": "Anual",
    "anual": "Anual"
};

async function handleDelete(formData: FormData) {
    "use server";

    const id = formData.get("id");
    if (typeof id !== "string") return;

    await deletePlan(formData);
    revalidatePath("/painel/plano");
}

export default async function PlanPage({
    searchParams,
}: {
    searchParams: Promise<{ 
        title?: string;
        period?: string;
        description?: string;
        price?: string;
    }>;
}) {
    const resolvedSearchParams = await searchParams; 
    const params: any = { ...resolvedSearchParams };

    if (params.period && params.period !== "todos") {
        const p = params.period.toLowerCase().trim();
        if (p === "mensal" || p === "mes" || p === "mês") params.dbPeriod = "month";
        if (p === "trimestral") params.dbPeriod = "quarter";
        if (p === "semestral") params.dbPeriod = "semester";
        if (p === "anual" || p === "ano") params.dbPeriod = "year";
    }

    const { query }: any = await validateData(params);

    const sanitizedQuery = query.map((plan: any) => ({
        ...plan,
        price: plan.price ? plan.price.toNumber() : 0
    }));

    const columns = [ "Título", "Duração", "Benefícios", "Preço", "Ações" ];

    return (
     <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaGem className="text-red-700 text-5xl" />
                    Gestão de Planos
                </h1>
                 
                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/plano/cadastrar" className="hover:!bg-zinc-700">
                            <FaGem /> Cadastrar Plano
                        </Link>
                    </Button>
                </div>
            </div>

        <Accordion type="single" collapsible className="w-full mb-6">
            <AccordionItem value="teste" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors rounded-lg data-[state=open]:rounded-b-none cursor-pointer bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaSearch className="text-gray-500 text-sm" />
                        Filtros de Busca
                    </h2>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white border rounded-b-lg">
                    <form method="GET" action="/painel/plano" className="space-y-6">
                        {/* CORREÇÃO: Adicionado items-end para manter a base de todos os elementos alinhados horizontalmente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            
                            {/* Título */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Título do Plano</label>
                                <Input name="title" placeholder="Ex: Premium" defaultValue={resolvedSearchParams.title || ""} className="h-10 text-[16px]" />
                            </div>

                            {/* Período (Select) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Duração</label>
                                {/* CORREÇÃO: Alterado name de 'stripe' para 'period' para casar com sua API/Busca */}
                                <Select defaultValue={resolvedSearchParams.period || "todos"} name="period">
                                    <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                                        <SelectValue placeholder="Selecione o período" />  
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-300">
                                        <SelectItem value="todos">Todos</SelectItem>
                                        <SelectItem value="Mensal">Mensal</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Benefícios */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Benefícios</label>
                                <Input name="description" placeholder="Palavra-chave..." defaultValue={resolvedSearchParams.description || ""} className="h-10 text-[16px]" />
                            </div>

                            {/* Preço */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Preço Máximo</label>
                                <Input name="price" placeholder="Ex: 29.99" defaultValue={resolvedSearchParams.price || ""} className="h-10 text-[16px]" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
                                <Link href="/painel/plano" className="!no-underline">Limpar</Link>
                            </Button>
                            <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                Filtrar Plano
                            </Button>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

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
                    {sanitizedQuery.map((plan: any) => (
                        <TableRow key={plan.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>{plan.title}</TableCell>
                            
                            <TableCell>
                                {plan.period 
                                    ? (periodTranslations[plan.period.toLowerCase().trim()] || plan.period) 
                                    : "Não informado"}
                            </TableCell>
                            
                            <TableCell>{plan.description}</TableCell>
                            <TableCell>R$ {plan.price.toFixed(2)}</TableCell>
                                 <TableCell className="flex justify-end items-center gap-2 py-4">

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/plano/${plan.id}/atualizar`}>
                                            <FaEdit /> Editar
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={plan.id}
                                        message={`Tem certeza que deseja apagar o registro de ${plan.title}?`}
                                        action={deletePlan}
                                    />

                                </TableCell>
                            </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}