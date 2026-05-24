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
    searchParams: {
        title?: string;
        period?: string;
        description?: string;
        price?: string;
    };
}) {
    const params: any = searchParams;
    const { query, users }: any = await validateData(params);
    console.log(query);

    // Converte o Decimal do banco em um número comum do JS antes de enviar para os Client Components
    const sanitizedQuery = query.map((plan: any) => ({
        ...plan,
        price: plan.price ? plan.price.toNumber() : 0
    }));

    const columns = [ "Título", "Período", "Descrição", "Preço", "Ações" ];

    return (
     <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
                 <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                     <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                         <FaThLarge className="text-red-700 text-5xl" />
                         Gestão de Planos
                     </h1>
                 
                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/plano/cadastrar" className="hover:!bg-zinc-700">
                            <FaTh /> Cadastrar Plano
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Input name="title" placeholder="Título do Plano" defaultValue={searchParams.title || ""} />
                            <Input name="period" placeholder="Período (ex: Mensal, Anual)" defaultValue={searchParams.period || ""} />
                            <Input name="description" placeholder="Descrição do Plano" defaultValue={searchParams.description || ""} />
                            <Input name="price" placeholder="Preço (ex: 29.99)" defaultValue={searchParams.price || ""} />
                        </div>
                        <Button type="submit" variant="outline">
                            <FaSearch className="mr-2" />
                            Buscar
                        </Button>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

            <Table className="text-xl">
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sanitizedQuery.map((plan: any) => (
                        <TableRow key={plan.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>{plan.title}</TableCell>
                            
                            {/* Tratamento seguro convertendo o valor retornado para caixa baixa antes de buscar no dicionário */}
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
                                        <Link
                                            href={`/painel/plano/${plan.id}`}
                                        >
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