"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardKpis {
    activeStudents: number;
    totalRevenueMonth: number;
    pendingPaymentsCount: number;
    pendingPaymentsAmount: number;
    newRegistrations: number;
}

export interface RevenueByMonth {
    month: string; // ex: "jan/26"
    total: number;
}

export interface PaymentStatusBreakdown {
    status: string;
    label: string;
    count: number;
    total: number;
}

export interface OverduePaymentRow {
    id: string;
    studentName: string;
    planTitle: string | null;
    amount: number;
    dueDate: Date;
    status: string;
}

export interface DashboardData {
    kpis: DashboardKpis;
    revenueByMonth: RevenueByMonth[];
    statusBreakdown: PaymentStatusBreakdown[];
    overdueList: OverduePaymentRow[];
}

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    OVERDUE: "Atrasado",
    CANCELLED: "Cancelado",
};

/**
 * Busca todos os dados reais utilizados na tela de Dashboard:
 * - KPIs (cards do topo)
 * - Série de faturamento dos últimos 6 meses (gráfico de barras)
 * - Distribuição de pagamentos por status (gráfico de pizza)
 * - Lista de alunos com pagamentos pendentes/atrasados (tabela)
 */
export async function getDashboardData(): Promise<DashboardData> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    // Janela de 6 meses (incluindo o mês atual) para o gráfico de evolução de faturamento
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
        activeRegistrationsDistinct,
        revenueMonthAgg,
        pendingPaymentsAgg,
        newRegistrations,
        pendingPaymentsList,
        revenueLast6MonthsPayments,
        statusBreakdownRaw,
        activeRegistrationsWithPlan,
    ] = await Promise.all([
        // Alunos distintos que possuem ao menos uma inscrição ativa em um plano
        prisma.registration.findMany({
            where: { status: "ACTIVE" },
            select: { studentId: true },
            distinct: ["studentId"],
        }),

        // Soma de tudo que foi efetivamente pago dentro do mês atual
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: "PAID",
                paymentDate: { gte: startOfMonth, lt: endOfMonth },
            },
        }),

        // Quantidade e valor total de pagamentos pendentes/atrasados (em aberto)
        prisma.payment.aggregate({
            _sum: { amount: true },
            _count: true,
            where: { status: { in: ["PENDING", "OVERDUE"] } },
        }),

        // Novas inscrições (aluno x plano) nos últimos 30 dias
        prisma.registration.count({
            where: { createdAt: { gte: last30Days } },
        }),

        // Lista detalhada de pagamentos em aberto, para a tabela
        prisma.payment.findMany({
            where: { status: { in: ["PENDING", "OVERDUE"] } },
            include: { student: true },
            orderBy: { dueDate: "asc" },
            take: 10,
        }),

        // Pagamentos pagos nos últimos 6 meses, para montar o gráfico de evolução
        prisma.payment.findMany({
            where: {
                status: "PAID",
                paymentDate: { gte: sixMonthsAgo, lt: endOfMonth },
            },
            select: { amount: true, paymentDate: true },
        }),

        // Contagem/soma de pagamentos agrupados por status, para o gráfico de pizza
        prisma.payment.groupBy({
            by: ["status"],
            _count: { _all: true },
            _sum: { amount: true },
        }),

        // Inscrições ativas com o plano, usadas para descobrir o plano de cada aluno pendente
        prisma.registration.findMany({
            where: { status: "ACTIVE" },
            include: { plan: true },
        }),
    ]);

    // --------------------------- KPIs ---------------------------
    const activeStudents = activeRegistrationsDistinct.length;
    const totalRevenueMonth = Number(revenueMonthAgg._sum.amount ?? 0);
    const pendingPaymentsCount = pendingPaymentsAgg._count;
    const pendingPaymentsAmount = Number(pendingPaymentsAgg._sum.amount ?? 0);

    // ----------------- Gráfico: Faturamento (6 meses) -----------------
    const monthBuckets: RevenueByMonth[] = [];
    for (let i = 5; i >= 0; i--) {
        const refDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthBuckets.push({
            month: refDate.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
            total: 0,
        });
    }

    revenueLast6MonthsPayments.forEach((payment) => {
        if (!payment.paymentDate) return;

        const paymentDate = new Date(payment.paymentDate);
        const diffMonths =
            (now.getFullYear() - paymentDate.getFullYear()) * 12 +
            (now.getMonth() - paymentDate.getMonth());

        const bucketIndex = 5 - diffMonths;
        if (bucketIndex >= 0 && bucketIndex < monthBuckets.length) {
            monthBuckets[bucketIndex].total += Number(payment.amount);
        }
    });

    // ------------- Gráfico: Distribuição por Status -------------
    const statusBreakdown: PaymentStatusBreakdown[] = statusBreakdownRaw.map((item) => ({
        status: item.status,
        label: STATUS_LABELS[item.status] ?? item.status,
        count: item._count._all,
        total: Number(item._sum.amount ?? 0),
    }));

    // ---------- Tabela: Alunos com pagamentos pendentes ----------
    // O modelo Payment não tem uma FK direta para Registration/Plan, então
    // usamos a inscrição ATIVA do aluno (se existir) para exibir o nome do plano.
    const planByStudentId = new Map(
        activeRegistrationsWithPlan.map((registration) => [registration.studentId, registration.plan])
    );

    const overdueList: OverduePaymentRow[] = pendingPaymentsList.map((payment) => ({
        id: payment.id,
        studentName: payment.student?.name ?? "Desconhecido",
        planTitle: planByStudentId.get(payment.studentId)?.title ?? null,
        amount: Number(payment.amount),
        dueDate: payment.dueDate,
        status: payment.status,
    }));

    return {
        kpis: {
            activeStudents,
            totalRevenueMonth,
            pendingPaymentsCount,
            pendingPaymentsAmount,
            newRegistrations,
        },
        revenueByMonth: monthBuckets,
        statusBreakdown,
        overdueList,
    };
}
