"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useRef, useState, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTrainingGroup } from "@/services/training-group-services";
import Confirmation from "@/components/ui/confirmation";
import Link from "next/link";
import { FaPlus, FaTrash } from "react-icons/fa";

const daysOfWeek = [
  { value: "MONDAY", label: "Segunda" },
  { value: "TUESDAY", label: "Terça" },
  { value: "WEDNESDAY", label: "Quarta" },
  { value: "THURSDAY", label: "Quinta" },
  { value: "FRIDAY", label: "Sexta" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

interface Instructor {
  id: string;
  name: string;
}

interface TrainingGroupCreateFormProps {
  instructors: Instructor[];
}

export default function TrainingGroupCreateForm({ instructors }: TrainingGroupCreateFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [schedules, setSchedules] = useState<{ dayOfWeek: string; startTime: string }[]>([]);
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [state, formAction, isPending] = useActionState(createTrainingGroup, {
    message: "",
    status: "",
  });

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
  };

  const handleAddSchedule = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!newDay || !newTime) {
      toast.error("Selecione dia e horário.");
      return;
    }

    setSchedules((current) => [...current, { dayOfWeek: newDay, startTime: newTime }]);
    setNewDay("");
    setNewTime("");
  };

  const handleRemoveSchedule = (scheduleKey: string) => {
    setSchedules((current) => current.filter((schedule) => `${schedule.dayOfWeek}-${schedule.startTime}` !== scheduleKey));
  };

  useEffect(() => {
    if (!state?.message) return;

    if (state.status === "error") {
      toast.error("Erro", { description: state.message });
      return;
    }

    if (state.status === "success") {
      toast.success("Sucesso!", { description: state.message });
      router.push("/painel/turma");
    }
  }, [router, state]);

  return (
    <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
          <span className="text-red-700 text-3xl md:text-5xl">+</span>
          Nova Turma
        </h1>

        <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
          <Link href="/painel/turma" className="flex items-center justify-center gap-2">
            Voltar
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6 md:p-8 shadow-sm">
        <form ref={formRef} action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Instrutor</label>
              <select
                name="instructorId"
                required
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Nome da Turma</label>
              <Input
                name="name"
                type="text"
                required
                placeholder="Ex: Turma A"
                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Capacidade Máxima de Alunos</label>
              <Input
                name="studentCapacity"
                type="number"
                min={1}
                required
                placeholder="Ex: 20"
                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
              />
            </div>

            <div></div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2 col-span-full">
              <label className="text-lg font-semibold text-gray-700">Horários da Turma</label>

              <div className="space-y-2 mb-3">
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <div key={`${schedule.dayOfWeek}-${schedule.startTime}`} className="flex items-center justify-between rounded-md border border-gray-300 bg-zinc-50 p-3">
                      <div>
                        <div className="font-medium text-gray-700">
                          {daysOfWeek.find((day) => day.value === schedule.dayOfWeek)?.label || schedule.dayOfWeek}
                        </div>
                        <div className="text-sm text-gray-600">{schedule.startTime}</div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRemoveSchedule(`${schedule.dayOfWeek}-${schedule.startTime}`)}
                        className="bg-gray-200 text-gray-900 hover:bg-gray-300"
                      >
                        <FaTrash /> Remover
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Adicione ao menos um horário para esta turma.</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 rounded-md border border-gray-300 bg-white p-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Dia da Semana</label>
                  <select
                    value={newDay}
                    onChange={(event) => setNewDay(event.target.value)}
                    className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="">Selecione um dia</option>
                    {daysOfWeek.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Horário</label>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(event) => setNewTime(event.target.value)}
                    className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddSchedule}
                    className="w-full bg-zinc-900 text-white h-12 px-6 text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Adicionar horário
                  </Button>
                </div>
              </div>

              {schedules.map((schedule, index) => (
                <div key={`hidden-${index}`} className="hidden">
                  <input type="hidden" name="days" value={schedule.dayOfWeek} />
                  <input type="hidden" name="startTimes" value={schedule.startTime} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
            <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
              <Link href="/painel/turma" className="flex justify-center">
                Cancelar
              </Link>
            </Button>
            <Confirmation
              title="Confirmar Cadastro"
              message="Deseja salvar a nova turma no sistema?"
              isPending={isPending}
              buttonText="Cadastrar Turma"
              handleConfirm={handleConfirm}
              classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
