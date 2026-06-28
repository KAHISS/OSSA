"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fonts } from "@/utils/fonts";
import type { RevenueByMonth, PaymentStatusBreakdown } from "@/services/dashboard-services";

interface DashboardChartsProps {
    revenueByMonth: RevenueByMonth[];
    statusBreakdown: PaymentStatusBreakdown[];
}

const STATUS_COLORS: Record<string, string> = {
    PAID: "#16a34a",
    PENDING: "#f59e0b",
    OVERDUE: "#dc2626",
    CANCELLED: "#71717a",
};

const formatBRL = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function DashboardCharts({ revenueByMonth, statusBreakdown }: DashboardChartsProps) {
    const hasPaymentData = statusBreakdown.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Gráfico de Faturamento (últimos 6 meses) */}
            <Card className="lg:col-span-2 border shadow-sm">
                <CardHeader>
                    <CardTitle className={`text-xl ${fonts.bebas.className} text-zinc-800`}>
                        Faturamento dos Últimos 6 Meses
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value: number) => `R$ ${Number(value).toLocaleString("pt-BR")}`}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatBRL(Number(value)), "Faturamento"]}
                                labelFormatter={(label: string) => `Período: ${label}`}
                            />
                            <Bar dataKey="total" fill="#dc2626" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gráfico de distribuição de pagamentos por status */}
            <Card className="border shadow-sm">
                <CardHeader>
                    <CardTitle className={`text-xl ${fonts.bebas.className} text-zinc-800`}>
                        Pagamentos por Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    {!hasPaymentData ? (
                        <p className="text-gray-500 text-sm text-center px-4">
                            Ainda não há pagamentos cadastrados no sistema.
                        </p>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusBreakdown}
                                    dataKey="count"
                                    nameKey="label"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {statusBreakdown.map((entry) => (
                                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#a1a1aa"} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string) => [`${value} pagamento(s)`, name]}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
