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
import { Button } from "@/components/ui/button";
import { fonts } from "@/utils/fonts";
import Link from "next/link";

// Mock de dados
const stats = [
    {
        title: "Usuários Ativos",
        value: "1.284",
        icon: <FaUsers className="text-red-600" />,
        description: "+12% este mês"
    },
    {
        title: "Total Arrecadado",
        value: "R$ 45.230",
        icon: <FaDollarSign className="text-red-600" />,
        description: "Faturamento bruto"
    },
    {
        title: "Pendências",
        value: "1",
        icon: <FaExclamationTriangle className="text-red-600" />,
        description: "Mensalidades atrasadas"
    },
    {
        title: "Novas Matrículas",
        value: "+48",
        icon: <FaChartLine className="text-red-600" />,
        description: "Últimos 30 dias"
    }
];

export default async function DashboardPage() {
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
                            <TableHead className="text-right text-zinc-900 px-6">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Exemplo de Linha */}
                        <TableRow className="hover:bg-zinc-50/80 transition-colors border-b">
                            <TableCell className="font-bold py-4">Ricardo Almeida</TableCell>
                            <TableCell>Mensal VIP</TableCell>
                            <TableCell className="font-medium text-red-700">R$ 180,00</TableCell>
                            <TableCell>25/04/2026</TableCell>
                            <TableCell className="text-right px-6">
                                <Badge className="bg-red-600 text-white border-none px-3 py-1 uppercase text-[10px] tracking-widest">
                                    Atrasado
                                </Badge>
                            </TableCell>
                        </TableRow>
                        {/* Adicionar mais linhas aqui via map */}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}