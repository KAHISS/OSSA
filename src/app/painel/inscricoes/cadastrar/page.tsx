"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import {
    FaUserCheck,
    FaArrowLeft,
    FaGraduationCap,
    FaMoneyCheckAlt,
    FaCalendarAlt,
    FaToggleOn
} from 'react-icons/fa';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createRegistration, FormState } from "@/services/registrations-services";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";
import { calculateDueDate } from "@/utils/registration-utils";

export default function CreateRegistrationPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(createRegistration, {
        message: "",
        status: ""
    } as FormState);

    const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
    const [plans, setPlans] = useState<{ id: string; title: string; price?: number; period: string }[]>([]);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("");

    const handleConfirm = () => {
        formRef.current?.requestSubmit();
    };

    // Plano selecionado, usado apenas para exibir o vencimento calculado (preview)
    const selectedPlan = useMemo(
        () => plans.find((plan) => plan.id === selectedPlanId),
        [plans, selectedPlanId]
    );

    // A data de vencimento real é sempre calculada no servidor; aqui é só uma prévia visual
    const dueDatePreview = useMemo(() => {
        if (!selectedPlan) return null;
        return calculateDueDate(selectedPlan.period, new Date());
    }, [selectedPlan]);

    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error("Erro", { description: state.message });
            } else if (state.status === "success") {
                toast.success("Sucesso!", { description: state.message });
                router.push("/painel/inscricoes");
            }
        }
    }, [state, router]);

    useEffect(() => {
        async function loadStudents() {
            try {
                const response = await fetch("/api/usuarios");
                if (!response.ok) throw new Error("Erro ao carregar alunos");
                const data = await response.json();
                setStudents(data.filter((user: any) => user.type === "Student"));
            } catch (error) {
                console.error(error);
            }
        }
        loadStudents();
    }, []);

    useEffect(() => {
        async function loadPlans() {
            try {
                const response = await fetch("/api/plano");
                if (!response.ok) throw new Error("Erro ao carregar planos");
                const data = await response.json();
                setPlans(data);
            } catch (error) {
                console.error(error);
            }
        }
        loadPlans();
    }, []);

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUserCheck className="text-red-700 text-3xl md:text-5xl" />
                    Nova Matrícula em Plano
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/inscricoes" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>
            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Aluno */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaGraduationCap className="text-red-700" /> Aluno
                            </label>
                            <Select name="studentId" required>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o aluno" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Alunos</SelectLabel>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Plano */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaMoneyCheckAlt className="text-red-700" /> Plano
                            </label>
                            <Select name="planId" required onValueChange={(value) => setSelectedPlanId(value)}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o plano" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Planos Disponíveis</SelectLabel>
                                        {plans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.title} ({plan.period}) {plan.price ? `- R$ ${Number(plan.price).toFixed(2)}` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Vencimento calculado automaticamente (somente leitura) */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaCalendarAlt className="text-red-700" /> Vencimento Calculado Automaticamente
                            </label>

                            {!selectedPlan ? (
                                <div className="p-4 border border-dashed rounded-lg bg-zinc-50 text-gray-500 text-lg">
                                    Selecione um plano para visualizar a data de vencimento da primeira mensalidade.
                                </div>
                            ) : (
                                <div className="p-4 border rounded-lg bg-zinc-50 text-lg">
                                    Início hoje, em <strong>{new Date().toLocaleDateString("pt-BR")}</strong>. Como o plano{" "}
                                    <strong>{selectedPlan.title}</strong> é <strong>{selectedPlan.period}</strong>, o vencimento
                                    será em <strong>{dueDatePreview?.toLocaleDateString("pt-BR")}</strong>.
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaToggleOn className="text-red-700" /> Status Inicial da Matrícula
                            </label>
                            <select
                                name="status"
                                required
                                defaultValue="ACTIVE"
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <option value="ACTIVE">Ativo</option>
                                <option value="INACTIVE">Inativo</option>
                                <option value="SUSPENDED">Suspenso</option>
                                <option value="CANCELLED">Cancelado</option>
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                            <Link href="/painel/inscricoes" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Matrícula"
                            message="Deseja efetuar a matrícula deste aluno no plano selecionado? O vencimento será calculado automaticamente."
                            isPending={isPending}
                            buttonText="Efetivar Matrícula"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
