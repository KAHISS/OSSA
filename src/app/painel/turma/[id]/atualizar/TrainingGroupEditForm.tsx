"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateTrainingGroup } from "@/services/training-group-services";
import Confirmation from "@/components/ui/confirmation";
import ScheduleManager from "./ScheduleManager";
import Link from "next/link";

interface Instructor { id: string; name: string }
interface Schedule { id: string; dayOfWeek: string; startTime: string }

interface Props {
  trainingGroup: {
    id: string;
    studentCapacity: number;
    instructorId: string;
    instructor?: { id: string; name: string } | null;
    schedules: Schedule[];
  };
  instructors: Instructor[];
}

export default function TrainingGroupEditForm({ trainingGroup, instructors }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(updateTrainingGroup, { message: "", status: "" });
  const [studentCapacity, setStudentCapacity] = useState(trainingGroup.studentCapacity || 0);
  const [instructorId, setInstructorId] = useState(trainingGroup.instructorId || "");

  useEffect(() => {
    if (!state?.message) return;
    if (state.status === "error") {
      toast.error("Erro", { description: state.message });
    } else if (state.status === "success") {
      toast.success("Sucesso!", { description: state.message });
      router.push("/painel/turma");
    }
  }, [state, router]);

  const handleConfirm = () => formRef.current?.requestSubmit();

  return (
    <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
          <span className="text-red-700 text-3xl md:text-5xl">✎</span>
          Editar Turma
        </h1>

        <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
          <Link href="/painel/turma" className="flex items-center justify-center gap-2">Voltar</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border p-6 md:p-8 shadow-sm space-y-6">
        <form ref={formRef} action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={trainingGroup.id} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Instrutor</label>
              <select
                name="instructorId"
                required
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 text-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              >
                <option value="">Selecione um instrutor</option>
                {instructors.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Capacidade de alunos</label>
              <Input
                name="studentCapacity"
                type="number"
                min={1}
                required
                value={studentCapacity}
                onChange={(e) => setStudentCapacity(parseInt(e.target.value || "0"))}
                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
            <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
              <Link href="/painel/turma" className="flex justify-center">Cancelar</Link>
            </Button>
            <Confirmation
              title="Confirmar Atualização"
              message="Deseja salvar as alterações desta turma?"
              isPending={isPending}
              buttonText="Atualizar Turma"
              handleConfirm={handleConfirm}
              classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
            />
          </div>
        </form>

        <div className="border-t pt-6">
          <ScheduleManager trainingGroupId={trainingGroup.id} schedules={trainingGroup.schedules} />
        </div>
      </div>
    </div>
  );
}
