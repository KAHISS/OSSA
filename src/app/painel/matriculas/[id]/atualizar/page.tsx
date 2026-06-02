"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import {
    FaUserCheck,
    FaArrowLeft,
    FaGraduationCap,
    FaLayerGroup,
    FaClock,
    FaToggleOn
} from 'react-icons/fa';
import Link from "next/link";
import { updateEnrollment, FormState } from "@/services/enrollments-services";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function UpdateEnrollmentPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const params = useParams();

    const [state, formAction, isPending] = useActionState(updateEnrollment, {
        message: "",
        status: ""
    } as FormState);

    const [formValues, setFormValues] = useState({
        id: "",
        studentId: "",
        trainingGroupId: "",
        scheduleId: "",
        status: "ACTIVE",
    });

    const [students, setStudents] = useState<{ id: string; name: string }[]>([]);

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
                router.push("/painel/matriculas");
            }
        }
    }, [router, state]);

    useEffect(() => {
        const enrollmentId = params?.id;
        if (!enrollmentId) return;

        async function loadEnrollment() {
            try {
                const response = await fetch(`/api/matriculas/${enrollmentId}`);
                if (!response.ok) {
                    throw new Error("Matrícula não encontrada.");
                }

                const enrollment = await response.json();

                setFormValues({
                    id: enrollment.id,
                    studentId: enrollment.studentId || "",
                    trainingGroupId: enrollment.trainingGroupId || "",
                    scheduleId: enrollment.scheduleId || "",
                    status: enrollment.status || "ACTIVE",
                });
            } catch (error) {
                setLoadError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        loadEnrollment();
    }, [params]);

    if (isLoading) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <p className="text-gray-600 animate-pulse text-lg">Carregando dados da matrícula...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <div className="bg-white rounded-lg border p-6 shadow-sm">
                    <p className="text-red-600 text-lg font-semibold">{loadError}</p>
                    <Button asChild className="mt-4 bg-zinc-900 text-white">
                        <Link href="/painel/matriculas">Voltar para Listagem</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUserCheck className="text-red-700 text-3xl md:text-5xl" />
                    Editar Matrícula
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/matriculas" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            {/* Formulário de Edição */}
            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                {/* Utilizamos a prop `key={formValues.id}` para forçar o Shadcn Select 
                  a remontar e renderizar os valores padrões corretos assim que a API responder 
                */}
                <form ref={formRef} action={formAction} key={formValues.id} className="space-y-6 md:space-y-8">

                    {/* Input oculto crucial para que a Server Action saiba qual ID atualizar */}
                    <input type="hidden" name="id" value={formValues.id} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Campo: Aluno (Obrigatório) */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaGraduationCap className="text-red-700" /> Aluno
                            </label>
                            <Select name="studentId" required defaultValue={formValues?.studentId}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o aluno" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Alunos Ativos</SelectLabel>

                                        {/* Renderização Dinâmica */}
                                        {students.length === 0 ? (
                                            <SelectItem value="none" disabled>Nenhum aluno encontrado</SelectItem>
                                        ) : (
                                            students.map((student) => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.name}
                                                </SelectItem>
                                            ))
                                        )}

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Campo: Turma (Obrigatório) */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaLayerGroup className="text-red-700" /> Turma
                            </label>
                            <Select name="trainingGroupId" required defaultValue={formValues.trainingGroupId}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione a turma" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Turmas Disponíveis</SelectLabel>
                                        <SelectItem value="id_exemplo_turma_1">Turma A - Carlos Gracie</SelectItem>
                                        <SelectItem value="id_exemplo_turma_2">Turma B - Renzo Silva</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Campo: Horário (Obrigatório) */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaClock className="text-red-700" /> Horário
                            </label>
                            <Select name="scheduleId" required defaultValue={formValues.scheduleId}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o horário" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Grades de Horários</SelectLabel>
                                        <SelectItem value="id_exemplo_horario_1">Seg/Qua/Sex - 07:00</SelectItem>
                                        <SelectItem value="id_exemplo_horario_2">Ter/Qui - 19:00</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Campo: Status (Ativo ou Inativo; Obrigatório) */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaToggleOn className="text-red-700" /> Status da Matrícula
                            </label>
                            <select
                                name="status"
                                required
                                defaultValue={formValues.status}
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <option value="ACTIVE">Ativo</option>
                                <option value="INACTIVE">Inativo</option>
                            </select>
                        </div>

                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                            <Link href="/painel/matriculas" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Edição"
                            message="Deseja salvar as alterações efetuadas nesta matrícula?"
                            isPending={isPending}
                            buttonText="Atualizar Matrícula"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}