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
    FaCalendarDay,
    FaCheckSquare,
    FaSquare,
    FaExclamationTriangle,
    FaCheckCircle
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
import { createEnrollment, FormState } from "@/services/enrollments-services";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";

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

export default function CreateEnrollmentPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(createEnrollment, {
        message: "",
        status: ""
    } as FormState);

    const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
    const [trainingGroups, setTrainingGroups] = useState<{ id: string; name: string }[]>([]);
    
    const [selectedGroupId, setSelectedGroupId] = useState<string>("");
    const [availableSchedules, setAvailableSchedules] = useState<{ id: string; dayOfWeek: string; startTime: string }[]>([]);
    const [loadingSchedules, setLoadingSchedules] = useState<boolean>(false);
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);

    // --- NOVO: controle da inscrição ativa do aluno ---
    const [selectedStudentId, setSelectedStudentId] = useState<string>("");
    // null = ainda não verificado, true/false = resultado da verificação
    const [hasActiveRegistration, setHasActiveRegistration] = useState<boolean | null>(null);
    const [activeRegistrationPlan, setActiveRegistrationPlan] = useState<string | null>(null);
    const [checkingRegistration, setCheckingRegistration] = useState<boolean>(false);
    // --------------------------------------------------

    const handleConfirm = () => {
        formRef.current?.requestSubmit();
    };

    const toggleSchedule = (id: string) => {
        setSelectedScheduleIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const allIds = availableSchedules.map((s) => s.id);
        setSelectedScheduleIds(allIds);
    };

    const handleClearAll = () => {
        setSelectedScheduleIds([]);
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
        async function loadTrainingGroups() {
            try {
                const response = await fetch("/api/turma");
                if (!response.ok) throw new Error("Erro ao carregar turmas");
                const data = await response.json();
                setTrainingGroups(data);
            } catch (error) {
                console.error(error);
            }
        }
        loadTrainingGroups();
    }, []);

    // Monitorar mudança de turma
    useEffect(() => {
        if (!selectedGroupId) {
            setAvailableSchedules([]);
            setSelectedScheduleIds([]);
            return;
        }

        async function loadGroupSchedules() {
            setLoadingSchedules(true);
            setSelectedScheduleIds([]);
            try {
                const response = await fetch(`/api/turma/${selectedGroupId}`);
                if (!response.ok) throw new Error("Erro ao carregar horários");
                const data = await response.json();
                setAvailableSchedules(data.schedules || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingSchedules(false);
            }
        }

        loadGroupSchedules();
    }, [selectedGroupId]);

    // --- NOVO: verificar inscrição ativa ao selecionar um aluno ---
    useEffect(() => {
        if (!selectedStudentId) {
            setHasActiveRegistration(null);
            setActiveRegistrationPlan(null);
            return;
        }

        async function checkActiveRegistration() {
            setCheckingRegistration(true);
            setHasActiveRegistration(null);
            setActiveRegistrationPlan(null);

            try {
                const response = await fetch(`/api/inscricoes?studentId=${selectedStudentId}`);
                if (!response.ok) throw new Error();

                const registrations: { status: string; plan?: { title?: string } }[] = await response.json();
                const active = registrations.find((r) => r.status === "ACTIVE");

                setHasActiveRegistration(!!active);
                setActiveRegistrationPlan(active?.plan?.title ?? null);
            } catch {
                // Se falhar a consulta, deixa o servidor decidir na hora do submit
                setHasActiveRegistration(null);
            } finally {
                setCheckingRegistration(false);
            }
        }

        checkActiveRegistration();
    }, [selectedStudentId]);
    // ------------------------------------------------------------

    // O botão de confirmar fica desabilitado se: nenhum horário selecionado,
    // processando, ou o aluno não tem inscrição ativa (verificado no front)
    const isSubmitDisabled = isPending || selectedScheduleIds.length === 0 || hasActiveRegistration === false;

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUserCheck className="text-red-700 text-3xl md:text-5xl" />
                    Nova Matrícula
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/matriculas" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>
            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">

                    <input type="hidden" name="scheduleIds" value={JSON.stringify(selectedScheduleIds)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                        {/* Aluno */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaGraduationCap className="text-red-700" /> Aluno
                            </label>
                            <Select
                                name="studentId"
                                required
                                onValueChange={(value) => setSelectedStudentId(value)}
                            >
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

                            {/* --- Feedback de inscrição em plano --- */}
                            {selectedStudentId && (
                                <div className="mt-2">
                                    {checkingRegistration && (
                                        <p className="text-sm text-gray-500 animate-pulse">
                                            Verificando inscrição em plano...
                                        </p>
                                    )}

                                    {!checkingRegistration && hasActiveRegistration === false && (
                                        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-500" />
                                            <span>
                                                Este aluno <strong>não possui inscrição ativa em nenhum plano</strong>.
                                                Cadastre uma inscrição antes de criar a matrícula.{" "}
                                                <Link
                                                    href="/painel/inscricoes/cadastrar"
                                                    className="underline font-semibold hover:text-red-900"
                                                >
                                                    Ir para Inscrições
                                                </Link>
                                            </span>
                                        </div>
                                    )}

                                    {!checkingRegistration && hasActiveRegistration === true && (
                                        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            <FaCheckCircle className="shrink-0 text-green-500" />
                                            <span>
                                                Inscrição ativa encontrada
                                                {activeRegistrationPlan && (
                                                    <> — plano <strong>{activeRegistrationPlan}</strong></>
                                                )}
                                                . Matrícula liberada.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* -------------------------------------- */}
                        </div>

                        {/* Turma */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaLayerGroup className="text-red-700" /> Turma
                            </label>
                            <Select name="trainingGroupId" required onValueChange={(value) => setSelectedGroupId(value)}>
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

                        {/* Horários */}
                        <div className="md:col-span-2 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaClock className="text-red-700" /> Selecione os Horários do Aluno
                                </label>
                                
                                {selectedGroupId && availableSchedules.length > 0 && !loadingSchedules && (
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" size="sm" onClick={handleSelectAll} className="h-8 border-gray-300 text-sm">
                                            Selecionar Todos
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={handleClearAll} className="h-8 border-gray-300 text-sm text-red-600 hover:text-red-700">
                                            Limpar
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {!selectedGroupId ? (
                                <div className="p-6 border border-dashed rounded-lg bg-zinc-50 text-center text-gray-500 text-lg">
                                    Selecione uma turma primeiro para visualizar os horários disponíveis.
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
                                        const isSelected = selectedScheduleIds.includes(schedule.id);
                                        const timeDisplay = schedule.startTime.includes("T") 
                                            ? new Date(schedule.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                                            : schedule.startTime;

                                        return (
                                            <button
                                                key={schedule.id}
                                                type="button"
                                                onClick={() => toggleSchedule(schedule.id)}
                                                className={`flex flex-col items-start p-4 border rounded-xl transition-all text-left shadow-sm relative group ${
                                                    isSelected 
                                                        ? "border-zinc-900 bg-zinc-900 text-white ring-2 ring-zinc-950" 
                                                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-800"
                                                }`}
                                            >
                                                <div className="absolute top-3 right-3 text-sm">
                                                    {isSelected ? <FaCheckSquare className="text-red-400" /> : <FaSquare className="text-gray-300 group-hover:text-gray-400" />}
                                                </div>

                                                <div className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase mb-1 pr-6">
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
                                <FaToggleOn className="text-red-700" /> Status Inicial das Matrículas
                            </label>
                            <select
                                name="status"
                                required
                                defaultValue="ACTIVE"
                                className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                            >
                                <option value="ACTIVE">Ativo</option>
                                <option value="INACTIVE">Inativo</option>
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                            <Link href="/painel/matriculas" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Matrículas"
                            message={`Deseja efetuar a matrícula do aluno em todos os ${selectedScheduleIds.length} horários selecionados?`}
                            isPending={isSubmitDisabled}
                            buttonText={`Efetivar (${selectedScheduleIds.length}) Matrículas`}
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
