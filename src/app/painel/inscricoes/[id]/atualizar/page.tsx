"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { updateRegistration, FormState } from "@/services/registrations-services";
import { useActionState, useEffect, useRef, useState, use } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditRegistrationPage({ params }: PageProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Desembrulha com segurança o ID da URL no lado do cliente
    const resolvedParams = use(params);
    const registrationId = resolvedParams?.id;

    const [state, formAction, isPending] = useActionState(updateRegistration, {
        message: "",
        status: ""
    } as FormState);

    const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
    const [plans, setPlans] = useState<{ id: string; title: string; price?: number }[]>([]);

    const [formValues, setFormValues] = useState({
        id: "",
        studentId: "",
        planId: "",
        dueDate: "",
        status: "ACTIVE",
    });

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const handleConfirm = () => {
        formRef.current?.requestSubmit();
    };

    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error("Erro", { description: state.message });
            } else if (state.status === "success") {
                toast.success("Sucesso!", { description: state.message });
                router.push("/painel/inscricoes");
            }
        }
    }, [router, state]);

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

    // Busca os dados da matrícula no plano para preencher o formulário
    useEffect(() => {
        if (!registrationId) return;

        async function loadRegistration() {
            try {
                const response = await fetch(`/api/inscricoes/${registrationId}`);

                if (!response.ok) {
                    throw new Error("Matrícula no plano não encontrada no banco de dados.");
                }

                const registration = await response.json();

                setFormValues({
                    id: registration.id,
                    studentId: registration.studentId || "",
                    planId: registration.planId || "",
                    dueDate: registration.dueDate
                        ? new Date(registration.dueDate).toISOString().split("T")[0]
                        : "",
                    status: registration.status || "ACTIVE",
                });

                setLoadError(null);
            } catch (error) {
                setLoadError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRegistration();
    }, [registrationId]);

    if (isLoading) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <p className="text-gray-600 text-xl font-semibold">Carregando dados da matrícula...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <p className="text-red-600 text-xl font-semibold">{loadError}</p>
                <Button variant="outline" asChild className="mt-4">
                    <Link href="/painel/registrations">Voltar</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUserCheck className="text-red-700 text-3xl md:text-5xl" />
                    Editar Inscrição em Plano
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/inscricoes" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} key={formValues.id} className="space-y-6 md:space-y-8">
                    <input type="hidden" name="id" value={formValues.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Aluno */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaGraduationCap className="text-red-700" /> Aluno
                            </label>
                            <Select name="studentId" required defaultValue={formValues.studentId}>
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
                            <Select name="planId" required defaultValue={formValues.planId}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o plano" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Planos Disponíveis</SelectLabel>
                                        {plans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.id}>
                                                {plan.title} {plan.price ? `- R$ ${Number(plan.price).toFixed(2)}` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Data de Vencimento */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaCalendarAlt className="text-red-700" /> Data de Vencimento
                            </label>
                            <Input
                                name="dueDate"
                                type="date"
                                required
                                defaultValue={formValues.dueDate}
                                className="w-full h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaToggleOn className="text-red-700" /> Status da Inscrição
                            </label>
                            <select
                                name="status"
                                required
                                defaultValue={formValues.status}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <option value="ACTIVE">Ativo</option>
                                <option value="INACTIVE">Inativo</option>
                                <option value="SUSPENDED">Suspenso</option>
                                <option value="CANCELLED">Cancelado</option>
                            </select>
                        </div>

                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                            <Link href="/painel/inscricoes" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Edição"
                            message="Deseja salvar as alterações efetuadas nesta matrícula em plano?"
                            isPending={isPending}
                            buttonText="Atualizar Inscrição"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
