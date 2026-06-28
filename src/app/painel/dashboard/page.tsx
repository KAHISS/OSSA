import {
    FaUsers,
    FaDollarSign,
    FaUserClock,
    FaExclamationTriangle,
    FaChartLine
} from 'react-icons/fa';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fonts } from "@/utils/fonts";
import { getDashboardData } from "@/services/dashboard-services";
import DashboardCharts from "./DashboardCharts";

const STATUS_BADGE_STYLES: Record<string, string> = {
    PENDING: "bg-amber-500",
    OVERDUE: "bg-red-600",
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pendente",
    OVERDUE: "Atrasado",
};

export default async function DashboardPage() {
    const { kpis, revenueByMonth, statusBreakdown, overdueList } = await getDashboardData();

    const stats = [
        {
            title: "Alunos com Plano Ativo",
            value: kpis.activeStudents.toLocaleString("pt-BR"),
            icon: <FaUsers className="text-red-600" />,
            description: "Inscrições ativas no momento",
        },
        {
            title: "Faturamento do Mês",
            value: `R$ ${kpis.totalRevenueMonth.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            icon: <FaDollarSign className="text-red-600" />,
            description: "Pagamentos recebidos neste mês",
        },
        {
            title: "Pendências",
            value: kpis.pendingPaymentsCount.toLocaleString("pt-BR"),
            icon: <FaExclamationTriangle className="text-red-600" />,
            description: `R$ ${kpis.pendingPaymentsAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em aberto`,
        },
        {
            title: "Novas Inscrições",
            value: `+${kpis.newRegistrations}`,
            icon: <FaChartLine className="text-red-600" />,
            description: "Últimos 30 dias",
        },
    ];

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className={`text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaChartLine className="text-red-700" />
                    Dashboard
                </h1>
            </div>

            {/* Cards Pretos com Destaque */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-zinc-900 border-none shadow-xl transition-transform hover:scale-[1.02]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-white">
                                {stat.title}
                            </CardTitle>
                            <div className="text-xl bg-zinc-800 p-2 rounded-md">
                                {stat.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="h-[2px] w-8 bg-red-600" />
                                <p className="text-xs text-white font-medium italic">
                                    {stat.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Gráficos com dados reais */}
            <DashboardCharts revenueByMonth={revenueByMonth} statusBreakdown={statusBreakdown} />

            {/* Tabela de Pendências */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="bg-zinc-50 px-6 py-4 border-b flex items-center justify-between">
                    <h2 className={`text-2xl ${fonts.bebas.className} text-zinc-800 flex items-center gap-2`}>
                        <FaUserClock className="text-red-600" />
                        Alunos com Pagamentos Pendentes
                    </h2>
                </div>

                <Table className="text-base">
                    <TableHeader>
                        <TableRow className="font-bold text-[18px] hover:bg-transparent">
                            <TableHead className="text-zinc-900">Aluno</TableHead>
                            <TableHead className="text-zinc-900">Plano</TableHead>
                            <TableHead className="text-zinc-900">Valor</TableHead>
                            <TableHead className="text-zinc-900">Vencimento</TableHead>
                            <TableHead className="text-right text-zinc-900 px-6">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {overdueList.length > 0 ? (
                            overdueList.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-zinc-50/80 transition-colors border-b">
                                    <TableCell className="font-bold py-4">{payment.studentName}</TableCell>
                                    <TableCell>{payment.planTitle ?? "—"}</TableCell>
                                    <TableCell className="font-medium text-red-700">
                                        R$ {payment.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(payment.dueDate).toLocaleDateString("pt-BR")}
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <Badge className={`${STATUS_BADGE_STYLES[payment.status] ?? "bg-zinc-500"} text-white border-none px-3 py-1 uppercase text-[10px] tracking-widest`}>
                                            {STATUS_LABELS[payment.status] ?? payment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500 text-lg">
                                    Nenhum pagamento pendente. 🎉
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}