"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type DayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export async function deleteTrainingGroup(formData: FormData) {
    "use server";
    const trainingGroupId = formData.get("id") as string;

    await prisma.trainingGroup.delete({
        where: { id: trainingGroupId }
    });

    revalidatePath("/painel/turmas");
}

export async function createTrainingGroup(prevState: unknown, formData: FormData) {
    "use server";

    const name = (formData.get("name") as string)?.trim() || "";
    const studentCapacity = parseInt(formData.get("studentCapacity") as string) || 0;
    const instructorId = (formData.get("instructorId") as string)?.trim() || "";
    const startTime = (formData.get("startTime") as string)?.trim() || "";
    const days = formData.getAll("days") as DayOfWeek[];

    if (!name || !studentCapacity || !instructorId || !startTime || !days || days.length === 0) {
        return { message: "Todos os campos obrigatórios devem ser preenchidos.", status: "error" };
    }

    if (studentCapacity <= 0) {
        return { message: "A capacidade de alunos deve ser maior que 0.", status: "error" };
    }

    try {
        const instructor = await prisma.user.findUnique({
            where: { id: instructorId },
            include: { instructor: true }
        });

        if (!instructor) {
            return { message: "Instrutor não encontrado.", status: "error" };
        }

        if (!instructor.instructor) {
            return { message: "O usuário selecionado não é um instrutor.", status: "error" };
        }

        const schedulesCreate = days.map((day) => {
            const parsedStart = new Date(`1970-01-01T${startTime}:00`);
            return {
                dayOfWeek: day,
                startTime: parsedStart,
            };
        });

        const trainingGroup = await prisma.trainingGroup.create({
            data: {
                name,
                studentCapacity,
                instructorId,
                schedules: {
                    create: schedulesCreate,
                },
            },
            include: {
                instructor: true,
                schedules: true,
            },
        });

        return {
            message: `Turma criada com sucesso!`,
            status: "success",
            data: trainingGroup,
        };
    } catch (error) {
        console.error("Erro ao criar turma:", error);
        return { message: "Erro ao criar turma.", status: "error" };
    }
}

export async function updateTrainingGroup(prevState: unknown, formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim() || "";
    const studentCapacity = parseInt(formData.get("studentCapacity") as string) || 0;
    const instructorId = (formData.get("instructorId") as string)?.trim() || "";

    if (!id || !name || !studentCapacity || !instructorId) {
        return { message: "Todos os campos obrigatórios devem ser preenchidos.", status: "error" };
    }

    if (studentCapacity <= 0) {
        return { message: "A capacidade de alunos deve ser maior que 0.", status: "error" };
    }

    try {
        // Verifica se a turma existe
        const trainingGroup = await prisma.trainingGroup.findUnique({
            where: { id }
        });

        if (!trainingGroup) {
            return { message: "Turma não encontrada.", status: "error" };
        }

        // Verifica se o instrutor existe e é do tipo Instructor
        const instructor = await prisma.user.findUnique({
            where: { id: instructorId },
            include: { instructor: true }
        });

        if (!instructor) {
            return { message: "Instrutor não encontrado.", status: "error" };
        }

        if (!instructor.instructor) {
            return { message: "O usuário selecionado não é um instrutor.", status: "error" };
        }

        const updated = await prisma.trainingGroup.update({
            where: { id },
            data: {
                name,
                studentCapacity,
                instructorId
            },
            include: {
                branch: true,
                instructor: true
            }
        });

        return { 
            message: "Turma atualizada com sucesso!", 
            status: "success",
            data: updated 
        };
    } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        return { message: "Erro ao atualizar turma.", status: "error" };
    }
}

export async function getInstructorUsers() {
    "use server";

    return prisma.user.findMany({
        where: { type: "Instructor" },
        select: {
            id: true,
            name: true,
        },
        orderBy: { name: 'asc' }
    });
}

export async function validateData(data: { name?: string; instructorId?: string }) {
    "use server";

    const searchName = data.name?.trim() || '';
    const searchInstructorId = data.instructorId?.trim() || '';

    const query: Record<string, unknown> = {};
    if (searchName) query.name = { startsWith: searchName, mode: 'insensitive' };
    if (searchInstructorId) query.instructorId = searchInstructorId;

    const trainingGroups = await prisma.trainingGroup.findMany({
        where: query,
        include: {
            branch: true,
            instructor: true,
            schedules: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return trainingGroups;
}

export async function getTrainingGroupById(id: string) {
    "use server";

    if (!id) return null;

    return prisma.trainingGroup.findUnique({
        where: { id },
        include: {
            branch: true,
            instructor: true,
            schedules: true,
        },
    });
}

export async function deleteSchedule(formData: FormData) {
    "use server";

    const scheduleId = formData.get("scheduleId") as string;
    const trainingGroupId = formData.get("trainingGroupId") as string;

    if (!scheduleId || !trainingGroupId) {
        return { message: "Dados inválidos.", status: "error" };
    }

    try {
        await prisma.schedule.delete({
            where: { id: scheduleId }
        });

        revalidatePath(`/painel/turma/${trainingGroupId}/atualizar`);

        return {
            message: "Horário removido com sucesso!",
            status: "success"
        };
    } catch (error) {
        console.error("Erro ao deletar schedule:", error);
        return { message: "Erro ao remover horário.", status: "error" };
    }
}

export async function createSchedule(formData: FormData) {
    "use server";

    const trainingGroupId = formData.get("trainingGroupId") as string;
    const dayOfWeek = formData.get("dayOfWeek") as DayOfWeek;
    const startTime = formData.get("startTime") as string;

    if (!trainingGroupId || !dayOfWeek || !startTime) {
        return { message: "Todos os campos são obrigatórios.", status: "error" };
    }

    try {
        // Verifica se a turma existe
        const trainingGroup = await prisma.trainingGroup.findUnique({
            where: { id: trainingGroupId }
        });

        if (!trainingGroup) {
            return { message: "Turma não encontrada.", status: "error" };
        }

        // Verifica se já existe um horário para este dia
        const existingSchedule = await prisma.schedule.findFirst({
            where: {
                trainingGroupId,
                dayOfWeek
            }
        });

        if (existingSchedule) {
            return { message: `Já existe um horário para ${dayOfWeek} nesta turma.`, status: "error" };
        }

        const parsedStart = new Date(`1970-01-01T${startTime}:00`);

        const newSchedule = await prisma.schedule.create({
            data: {
                trainingGroupId,
                dayOfWeek,
                startTime: parsedStart
            }
        });

        revalidatePath(`/painel/turma/${trainingGroupId}/atualizar`);

        return {
            message: "Horário adicionado com sucesso!",
            status: "success",
            data: newSchedule
        };
    } catch (error) {
        console.error("Erro ao criar schedule:", error);
        return { message: "Erro ao adicionar horário.", status: "error" };
    }
}
