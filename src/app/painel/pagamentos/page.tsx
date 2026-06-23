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
    FaMoneyBillWave,
    FaPlus,
    FaSearch,
    FaEdit,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCalendarAlt,
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";
import { validatePaymentData, deletePayment, getPaymentsKpis } from "@/services/payments-services";
import { createFilterLink } from "@/utils/filters";

const statusDictionary: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    OVERDUE: "Atrasado",
    CANCELLED: "Cancelado",
};

const typeDictionary: Record<string, string> = {
    PLAN: "Plano",
    GRADUATION: "Graduação",
    OTHER: "Outro",
};

const methodDictionary: Record<string, string> = {
    PIX: "PIX",
    BOLETO: "Boleto",
    CREDIT_CARD: "Crédito",
    DEBIT_CARD: "Débito",
};

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function PaymentsPage({
    searchParams
}: {
    searchParams: Promise<{
        status?: string;
        type?: string;
        method?: string;
        studentName?: string;
        month?: string;
        year?: string;
    }>
}) {
    const params: any = await searchParams;
    const { payments }: any = await validatePaymentData(params);
    const kpis = await getPaymentsKpis();

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaMoneyBillWave className="text-red-700 text-5xl" />
                    Gestão de Pagamentos
                </h1>

                <div className="flex items-center gap-3">
                    <Button asChild className="text-white h-15 px-6 text-xl font-semibold flex items-center gap-2 transition-colors">
                        <Link href="/painel/pagamentos/cadastrar" className="hover:!bg-zinc-700">
                            <FaPlus /> Novo Pagamento
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-yellow-100 text-yellow-700 p-3 rounded-full">
                        <FaMoneyBillWave />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Pendente</p>
                        <p className="text-xl font-bold">{formatCurrency(kpis.totalPendente)}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-green-100 text-green-700 p-3 rounded-full">
                        <FaCheckCircle />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Recebido (mês)</p>
                        <p className="text-xl font-bold">{formatCurrency(kpis.totalRecebidoMes)}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-red-100 text-red-700 p-3 rounded-full">
                        <FaExclamationTriangle />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pagamentos Atrasados</p>
                        <p className="text-xl font-bold">{kpis.pagamentosAtrasados}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
                        <FaCalendarAlt />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pagamentos do Mês</p>
                        <p className="text-xl font-bold">{kpis.pagamentosDoMes}</p>
                    </div>
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
                        <form method="GET" action="/painel/pagamentos" className="bg-white rounded-lg space-y-6 m-2">

                            {(() => {
                                const currentStatus = params.status || 'todos';
                                return (
                                    <div className="flex flex-wrap items-center justify-between w-full gap-4">
                                        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit flex-wrap">
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'todos' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'todos', params)} className="!no-underline hover:no-underline">Todos</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'PENDING' ? 'bg-yellow-500 shadow-sm text-white hover:bg-yellow-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'PENDING', params)} className="!no-underline hover:no-underline">Pendentes</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'PAID' ? 'bg-green-500 shadow-sm text-white hover:bg-green-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'PAID', params)} className="!no-underline hover:no-underline">Pagos</Link>
                                            </Button>
                                            <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentStatus === 'OVERDUE' ? 'bg-red-500 shadow-sm text-white hover:bg-red-600' : 'text-gray-500 hover:text-black'}`}>
                                                <Link href={createFilterLink('status', 'OVERDUE', params)} className="!no-underline hover:no-underline">Atrasados</Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Nome do Aluno</label>
                                    <div className="relative w-full mt-2">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <Input name="studentName" defaultValue={params.studentName || ""} placeholder="Buscar por aluno..." className="pl-10 w-full h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Tipo</label>
                                    <select
                                        name="type"
                                        defaultValue={params.type || "todos"}
                                        className="w-full h-10 mt-2 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="PLAN">Plano</option>
                                        <option value="GRADUATION">Graduação</option>
                                        <option value="OTHER">Outro</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Método de Pagamento</label>
                                    <select
                                        name="method"
                                        defaultValue={params.method || "todos"}
                                        className="w-full h-10 mt-2 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="PIX">PIX</option>
                                        <option value="BOLETO">Boleto</option>
                                        <option value="CREDIT_CARD">Crédito</option>
                                        <option value="DEBIT_CARD">Débito</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Vencimento (Mês/Ano)</label>
                                    <div className="flex gap-2 mt-2">
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
                                    <a href="/painel/pagamentos" className="!no-underline">Limpar</a>
                                </Button>
                                <Button type="submit" className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer">
                                    Filtrar pagamentos
                                </Button>
                            </div>
                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Table className="text-xl mt-6">
                <TableHeader>
                    <TableRow className="font-normal text-[20px]">
                        <TableHead className="w-[200px]">Aluno</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.length > 0 ? (
                        payments.map((payment: any) => (
                            <TableRow key={payment.id}>
                                <TableCell className="font-bold max-w-[200px] truncate">
                                    {payment.student?.name || "Desconhecido"}
                                </TableCell>

                                <TableCell>{typeDictionary[payment.type] || payment.type}</TableCell>

                                <TableCell>{formatCurrency(Number(payment.amount))}</TableCell>

                                <TableCell>
                                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                                </TableCell>

                                <TableCell>
                                    {payment.paymentDate
                                        ? new Date(payment.paymentDate).toLocaleDateString('pt-BR')
                                        : "—"}
                                </TableCell>

                                <TableCell>
                                    {payment.paymentMethod ? methodDictionary[payment.paymentMethod] : "—"}
                                </TableCell>

                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        payment.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {statusDictionary[payment.status] || payment.status}
                                    </span>
                                </TableCell>

                                <TableCell className="flex justify-end items-center gap-2 py-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-9 px-4 text-[15px] font-medium text-black hover:bg-red-50 hover:border-red-500 flex items-center gap-2"
                                    >
                                        <Link href={`/painel/pagamentos/${payment.id}/atualizar`}>
                                            <FaEdit /> Editar
                                        </Link>
                                    </Button>

                                    <ButtonDelete
                                        id={payment.id}
                                        message={`Tem certeza que deseja excluir o pagamento de ${payment.student?.name || "este aluno"}?`}
                                        action={deletePayment}
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-gray-500 text-lg">
                                Não há pagamentos cadastrados no momento.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}