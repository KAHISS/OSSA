"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaMoneyBillWave, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import { fonts } from "@/utils/fonts";

interface SelectionTarget {
    id: string; // studentId
    name: string; // label exibido no select
    planValue?: string; // Plan.price, quando vindo de uma inscrição ativa
    planTitle?: string; // Plan.title, para a mensagem informativa
}

// Helpers tolerantes a nomes de campo diferentes, já que ainda não temos
// certeza do formato exato que /api/inscricoes está retornando.
function getStudent(r: any) {
    return r.student ?? r.aluno ?? r.usuario ?? null;
}
function getPlan(r: any) {
    return r.plan ?? r.plano ?? null;
}
function getStudentId(r: any) {
    return r.studentId ?? r.student_id ?? getStudent(r)?.id ?? null;
}
function getStudentName(r: any) {
    return getStudent(r)?.name ?? getStudent(r)?.nome ?? null;
}
function getPlanTitle(r: any) {
    const plan = getPlan(r);
    return plan?.title ?? plan?.titulo ?? plan?.name ?? plan?.nome ?? null;
}
function getPlanPrice(r: any) {
    const plan = getPlan(r);
    const value = plan?.price ?? plan?.valor ?? plan?.preco;
    return value !== undefined && value !== null ? String(value) : undefined;
}
function getRegistrationStatus(r: any) {
    return (r.status ?? r.situacao ?? "").toString().toUpperCase();
}

export default function CadastrarPagamentoPage() {
    const router = useRouter();

    const [targets, setTargets] = useState<SelectionTarget[]>([]);
    const [loadingTargets, setLoadingTargets] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [type, setType] = useState("PLAN");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [paymentDate, setPaymentDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [status, setStatus] = useState("PENDING");

    const [planHint, setPlanHint] = useState<string | null>(null);

    // Sempre busca a lista de alunos (fonte confiável). Quando o Tipo for
    // "Plano", busca também as inscrições e anexa o plano/valor de quem
    // tiver uma inscrição ativa, sem nunca deixar o select vazio.
    useEffect(() => {
        async function loadTargets() {
            setLoadingTargets(true);
            setSelectedStudentId("");
            setAmount("");
            setPlanHint(null);
            setError(null);

            try {
                const usersRes = await fetch("/api/usuarios");
                if (!usersRes.ok) throw new Error("Erro ao carregar alunos");
                const usersData = await usersRes.json();
                const users = Array.isArray(usersData)
                    ? usersData
                    : usersData.users || usersData.usuarios || [];

                const students = users.filter((user: any) => user.type === "Student");

                let mapped: SelectionTarget[] = students.map((student: any) => ({
                    id: student.id,
                    name: student.name,
                }));

                if (type === "PLAN") {
                    const regRes = await fetch("/api/inscricoes");
                    if (!regRes.ok) throw new Error("Erro ao carregar inscrições");
                    const regData = await regRes.json();
                    const registrations = Array.isArray(regData)
                        ? regData
                        : regData.registrations || regData.inscricoes || [];

                    // Ajuda a depurar o formato real da API sem quebrar a tela
                    console.log("Inscrições recebidas de /api/inscricoes:", registrations);

                    const planByStudentId = new Map<string, { title?: string; price?: string }>();

                    registrations
                        .filter((r: any) => getRegistrationStatus(r) === "ACTIVE")
                        .forEach((r: any) => {
                            const studentId = getStudentId(r);
                            if (!studentId) return;

                            planByStudentId.set(studentId, {
                                title: getPlanTitle(r) || undefined,
                                price: getPlanPrice(r),
                            });
                        });

                    mapped = mapped.map((target) => {
                        const planInfo = planByStudentId.get(target.id);
                        if (!planInfo) return target;

                        return {
                            ...target,
                            name: planInfo.title ? `${target.name} — Plano: ${planInfo.title}` : target.name,
                            planValue: planInfo.price,
                            planTitle: planInfo.title,
                        };
                    });
                }

                setTargets(mapped);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os dados de seleção do formulário.");
                setTargets([]);
            } finally {
                setLoadingTargets(false);
            }
        }

        loadTargets();
    }, [type]);

    function handleTargetChange(studentId: string) {
        setSelectedStudentId(studentId);

        if (type !== "PLAN" || !studentId) {
            setPlanHint(null);
            return;
        }

        const target = targets.find((t) => t.id === studentId);

        if (target?.planValue) {
            setAmount(target.planValue);
            setPlanHint(
                `Valor sugerido com base no plano "${target.planTitle}". Você pode alterá-lo, se necessário (ex: para aplicar um desconto).`
            );
        } else {
            setAmount("");
            setPlanHint("Esta inscrição não possui um valor de plano definido. Informe o valor manualmente.");
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!selectedStudentId || !type || !amount || !dueDate) {
            setError("Preencha todos os campos obrigatórios!");
            return;
        }

        if (Number(amount) < 0) {
            setError("O valor do pagamento não pode ser negativo.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/pagamentos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: selectedStudentId,
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
                throw new Error(data.error || "Erro ao cadastrar pagamento");
            }

            router.push("/painel/pagamentos");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Erro ao cadastrar pagamento. Tente novamente mais tarde.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <h1 className={`text-4xl flex items-center gap-3 ${fonts.bebas.className}`}>
                        <FaMoneyBillWave className="text-red-700 text-4xl" />
                        Novo Pagamento
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
                            <label className="text-sm font-semibold text-gray-700">
                                {type === "PLAN" ? "Aluno (inscrição ativa) *" : "Aluno *"}
                            </label>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => handleTargetChange(e.target.value)}
                                disabled={loadingTargets}
                                className="w-full h-10 bg-white border border-gray-300 rounded-md px-3 text-[16px] focus-visible:ring-zinc-900"
                            >
                                <option value="">
                                    {loadingTargets ? "Carregando..." : "Selecione um aluno"}
                                </option>
                                {targets.map((target) => (
                                    <option key={target.id} value={target.id}>
                                        {target.name}
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
                                <option value="GRADUATION">Graduação</option>
                                <option value="PLAN">Plano</option>
                                <option value="OTHER">Outro</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-gray-700">Valor (R$) *</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Ex: 150.00"
                                className="h-10 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[16px]"
                            />
                            {planHint && (
                                <p className="text-sm text-blue-600 flex items-start gap-1 mt-1">
                                    <FaInfoCircle className="mt-0.5 shrink-0" /> {planHint}
                                </p>
                            )}
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
                            {submitting ? "Salvando..." : "Cadastrar Pagamento"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}