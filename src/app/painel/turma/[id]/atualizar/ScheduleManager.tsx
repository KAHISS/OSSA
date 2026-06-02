"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { deleteSchedule, createSchedule } from "@/services/training-group-services";
import { FaTrash, FaPlus } from "react-icons/fa";

interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
}

interface ScheduleManagerProps {
  trainingGroupId: string;
  schedules: Schedule[];
}

const daysOfWeek = [
  { value: "MONDAY", label: "Segunda" },
  { value: "TUESDAY", label: "Terça" },
  { value: "WEDNESDAY", label: "Quarta" },
  { value: "THURSDAY", label: "Quinta" },
  { value: "FRIDAY", label: "Sexta" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

export default function ScheduleManager({ trainingGroupId, schedules: initialSchedules }: ScheduleManagerProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [newDay, setNewDay] = useState("");
  const [newTime, setNewTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm("Deseja remover este horário?")) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("scheduleId", scheduleId);
    formData.append("trainingGroupId", trainingGroupId);

    try {
      const result = await deleteSchedule(formData);

      if (result.status === "success") {
        toast.success("Sucesso!", { description: result.message });
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      } else {
        toast.error("Erro", { description: result.message });
      }
    } catch (error) {
      toast.error("Erro", { description: "Erro ao remover horário." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDay || !newTime) {
      toast.error("Erro", { description: "Selecione dia e horário." });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("trainingGroupId", trainingGroupId);
    formData.append("dayOfWeek", newDay);
    formData.append("startTime", newTime);

    try {
      const result = await createSchedule(formData);

      if (result.status === "success") {
        toast.success("Sucesso!", { description: result.message });
        if (result.data) {
          setSchedules((prev) => [
            ...prev,
            {
              id: result.data.id,
              dayOfWeek: result.data.dayOfWeek,
              startTime: new Date(result.data.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
        setNewDay("");
        setNewTime("");
      } else {
        toast.error("Erro", { description: result.message });
      }
    } catch (error) {
      toast.error("Erro", { description: "Erro ao adicionar horário." });
    } finally {
      setIsLoading(false);
    }
  };

  const usedDays = schedules.map((s) => s.dayOfWeek);
  const availableDays = daysOfWeek.filter((day) => !usedDays.includes(day.value));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-lg font-semibold text-gray-700">Horários Cadastrados</label>
        <div className="mt-2 space-y-2">
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div key={schedule.id} className="p-3 rounded border bg-zinc-50 flex justify-between items-center">
                <div>
                  <div className="font-medium">
                    {daysOfWeek.find((d) => d.value === schedule.dayOfWeek)?.label || schedule.dayOfWeek}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(schedule.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <FaTrash /> Remover
                </Button>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Nenhum horário cadastrado.</div>
          )}
        </div>
      </div>

      {availableDays.length > 0 && (
        <form onSubmit={handleAddSchedule} className="p-4 rounded border bg-blue-50 space-y-3">
          <label className="text-lg font-semibold text-gray-700">Adicionar Novo Horário</label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Dia da Semana</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um dia</option>
                {availableDays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600">Horário</label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-10 bg-white border-gray-300 focus-visible:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <FaPlus /> Adicionar Horário
          </Button>
        </form>
      )}
    </div>
  );
}
