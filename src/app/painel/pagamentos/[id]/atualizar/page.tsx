"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaMoneyBillWave, FaArrowLeft } from "react-icons/fa";
import { fonts } from "@/utils/fonts";

interface Student {
    id: string;
    name: string;
}

function toDateInputValue(value: string | null | undefined) {
    if (!value) return "";
    return new Date(value).toISOString().split("T")[0];
}

export default function AtualizarPagamentoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const [studentId, setStudentId] = useState("");
    const [type, setType] = useState("PLAN");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState("PENDING");

    useEffect(() => {
        async function fetchData() {
            try {
                const [studentsRes, paymentRes] = await Promise.all([
                    fetch("/api/usuarios"),
                    fetch(`/api/pagamentos/${id}`),
                ]);

                const studentsData = await studentsRes.json();
                setStudents(Array.isArray(studentsData) ? studentsData : studentsData.users || []);

                if (paymentRes.status === 404) {
                    setNotFound(true);
                    return;
                }

                const payment = await paymentRes.json();

                setStudentId(payment.studentId || "");
                setType(payment.type || "PLAN");
                setAmount(String(payment.amount ?? ""));
                setDueDate(toDateInputValue(payment.dueDate));
                setPaymentDate(toDateInputValue(payment.paymentDate));
                setPaymentMethod(payment.paymentMethod || "");
                setStatus(payment.status || "PENDING");
            } catch {
                setError("Não foi possível carregar os dados do pagamento.");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchData();
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!studentId || !type || !amount || !dueDate) {
            setError("Preencha todos os campos obrigatórios!");
            return;
        }

        if (Number(amount) < 0) {
            setError("O valor do pagamento não pode ser negativo.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`/api/pagamentos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId,
                    type,
                    amount: Number(amount),
                    dueDate,
                    paymentDate: paymentDate || null,
                    paymentMethod: paymentMethod || null,
                    status,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erro ao atualizar pagamento");
            }

            router.push("/painel/pagamentos");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar pagamento. Tente novamente mais tarde.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className={`my-6 mx-6 text-gray-500 ${fonts.oswald.className}`}>
                Carregando pagamento...
            </div>
        );
    }

    if (notFound) {
        return (
            <div className={`my-6 mx-6 ${fonts.oswald.className}`}>
                <p className="text-gray-500 mb-4">Pagamento não encontrado.</p>
                <Button asChild variant="outline">
                    <Link href="/painel/pagamentos">
                        <FaArrowLeft /> Voltar para a listagem
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className={`text-4xl flex items-center gap-3 ${fonts.bebas.className}`}>
                        <FaMoneyBillWave className="text-red-700 text-4xl" />
                        Atualizar Pagamento
                    </h1>

                    <Button asChild variant="outline" className="h-10 px-4 flex items-center gap-2">
                        <Link href="/painel/pagamentos">
                            <FaArrowLeft /> Voltar
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Aluno *</label>
                        <select
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                        >
                            <option value="">Selecione um aluno</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tipo *</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                        >
                            <option value="PLAN">Plano</option>
                            <option value="GRADUATION">Graduação</option>
                            <option value="OTHER">Outro</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Valor (R$) *</label>
                        <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Método de Pagamento</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                        >
                            <option value="">Não informado</option>
                            <option value="PIX">PIX</option>
                            <option value="BOLETO">Boleto</option>
                            <option value="CREDIT_CARD">Crédito</option>
                            <option value="DEBIT_CARD">Débito</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Data de Vencimento *</label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Data de Pagamento</label>
                        <Input
                            type="date"
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                        >
                            <option value="PENDING">Pendente</option>
                            <option value="PAID">Pago</option>
                            <option value="OVERDUE">Atrasado</option>
                            <option value="CANCELLED">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="secondary"
                        className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold"
                        onClick={() => router.push("/painel/pagamentos")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-black hover:bg-[#333] text-white h-10 px-6 font-semibold cursor-pointer"
                    >
                        {submitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
            </div>
        </div>
    );
}