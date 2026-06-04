"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTrainingGroup } from "@/services/training-group-services";
import Confirmation from "@/components/ui/confirmation";
import Link from "next/link";

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
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(createTrainingGroup, {
    message: "",
    status: "",
  });

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
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

  const toggleDay = (day: string) => {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  };

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
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Horário de Início</label>
              <Input
                name="startTime"
                type="time"
                required
                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Horário de Fim</label>
              <Input
                name="endTime"
                type="time"
                required
                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Dias da Semana</label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-gray-300 bg-white p-3">
                {daysOfWeek.map((day) => (
                  <label key={day.value} className="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input
                      name="days"
                      type="checkbox"
                      value={day.value}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      onChange={() => toggleDay(day.value)}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500">Selecionados: {selectedDays.length}</p>
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
