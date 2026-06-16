"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import {
    FaUserCheck,
    FaArrowLeft,
    FaGraduationCap,
    FaLayerGroup,
    FaClock,
    FaToggleOn,
    FaCalendarDay
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

const translateDay = (day: string) => {
    const days: Record<string, string> = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };
    return days[day] || day;
};

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
    const [trainingGroups, setTrainingGroups] = useState<{ id: string; name: string }[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [availableSchedules, setAvailableSchedules] = useState<{ id: string; dayOfWeek: string; startTime: string }[]>([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
    const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);

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
        async function loadInitialLists() {
            try {
                const [resStudents, resGroups] = await Promise.all([
                    fetch("/api/usuarios"),
                    fetch("/api/turma")
                ]);

                if (!resStudents.ok || !resGroups.ok) throw new Error("Erro ao carregar listas.");

                const dataStudents = await resStudents.json();
                const dataGroups = await resGroups.json();

                setStudents(dataStudents.filter((user: any) => user.type === "Student"));
                setTrainingGroups(dataGroups);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            }
        }
        loadInitialLists();
    }, []);

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

                setSelectedGroupId(enrollment.trainingGroupId || "");
                setSelectedScheduleId(enrollment.scheduleId || "");
            } catch (error) {
                setLoadError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        loadEnrollment();
    }, [params]);

    useEffect(() => {
        if (!selectedGroupId) {
            setAvailableSchedules([]);
            return;
        }

        async function loadGroupSchedules() {
            setLoadingSchedules(true);
            try {
                const response = await fetch(`/api/turma/${selectedGroupId}`);
                if (!response.ok) throw new Error("Erro ao carregar horários");
                const data = await response.json();
                setAvailableSchedules(data.schedules || []);

                if (selectedGroupId !== formValues.trainingGroupId) {
                    setSelectedScheduleId("");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingSchedules(false);
            }
        }

        loadGroupSchedules();
    }, [selectedGroupId, formValues.trainingGroupId]);

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

            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} key={formValues.id} className="space-y-6 md:space-y-8">
                    <input type="hidden" name="id" value={formValues.id} />
                    <input type="hidden" name="scheduleId" value={selectedScheduleId} />

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
                                        <SelectLabel>Alunos Ativos</SelectLabel>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Turma */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaLayerGroup className="text-red-700" /> Turma
                            </label>
                            <Select name="trainingGroupId" required defaultValue={formValues.trainingGroupId} onValueChange={(value) => setSelectedGroupId(value)}>
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione a turma" />
                                </SelectTrigger>
                                <SelectContent className={fonts.oswald.className}>
                                    <SelectGroup>
                                        <SelectLabel>Turmas Disponíveis</SelectLabel>
                                        {trainingGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Horarios */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaClock className="text-red-700" /> Novo Horário Disponível nesta Turma
                            </label>

                            {!selectedGroupId ? (
                                <div className="p-6 border border-dashed rounded-lg bg-zinc-50 text-center text-gray-500 text-lg">
                                    Selecione uma turma para carregar os horários.
                                </div>
                            ) : loadingSchedules ? (
                                <div className="text-gray-600 animate-pulse text-lg py-2">Carregando horários...</div>
                            ) : availableSchedules.length === 0 ? (
                                <div className="p-6 border border-dashed border-red-200 rounded-lg bg-red-50/50 text-center text-red-600 text-lg">
                                    Esta turma não possui nenhum horário configurado.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {availableSchedules.map((schedule) => {
                                        // SELEÇÃO ÚNICA: Só fica ativo se bater exatamente o ID selecionado
                                        const isSelected = selectedScheduleId === schedule.id;
                                        const timeDisplay = schedule.startTime.includes("T") 
                                            ? new Date(schedule.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
                                            : schedule.startTime;

                                        return (
                                            <button
                                                key={schedule.id}
                                                type="button"
                                                onClick={() => setSelectedScheduleId(schedule.id)}
                                                className={`flex flex-col items-start p-4 border rounded-xl transition-all text-left shadow-sm group ${
                                                    isSelected 
                                                        ? "border-zinc-900 bg-zinc-900 text-white ring-2 ring-zinc-950" 
                                                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-800"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase mb-1">
                                                    <FaCalendarDay className={isSelected ? "text-red-400" : "text-red-700"} />
                                                    {translateDay(schedule.dayOfWeek)}
                                                </div>
                                                <div className={`text-2xl font-extrabold ${fonts.bebas.className}`}>
                                                    {timeDisplay} h
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2 md:col-span-2">
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
                            isPending={isPending || !selectedScheduleId}
                            buttonText="Atualizar Matrícula"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}