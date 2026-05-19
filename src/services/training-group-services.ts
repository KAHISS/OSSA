"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTrainingGroup(formData: FormData) {
    "use server";
    const trainingGroupId = formData.get("id") as string;

    await prisma.trainingGroup.delete({
        where: { id: trainingGroupId }
    });

    revalidatePath("/painel/turmas");
}

export async function createTrainingGroup(prevState: any, formData: FormData) {
    "use server";

    const studentCapacity = parseInt(formData.get("studentCapacity") as string) || 0;
    const branchId = (formData.get("branchId") as string)?.trim() || "";
    const instructorId = (formData.get("instructorId") as string)?.trim() || "";

    if (!studentCapacity || !branchId || !instructorId) {
        return { message: "Todos os campos obrigatórios devem ser preenchidos.", status: "error" };
    }

    if (studentCapacity <= 0) {
        return { message: "A capacidade de alunos deve ser maior que 0.", status: "error" };
    }

    try {
        // Verifica se a branch existe
        const branch = await prisma.branch.findUnique({
            where: { id: branchId }
        });

        if (!branch) {
            return { message: "Filial não encontrada.", status: "error" };
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

        const trainingGroup = await prisma.trainingGroup.create({
            data: {
                studentCapacity,
                branchId,
                instructorId
            },
            include: {
                branch: true,
                instructor: true
            }
        });

        return { 
            message: `Turma criada com sucesso!`, 
            status: "success",
            data: trainingGroup 
        };
    } catch (error) {
        console.error("Erro ao criar turma:", error);
        return { message: "Erro ao criar turma.", status: "error" };
    }
}

export async function updateTrainingGroup(prevState: any, formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const studentCapacity = parseInt(formData.get("studentCapacity") as string) || 0;
    const branchId = (formData.get("branchId") as string)?.trim() || "";
    const instructorId = (formData.get("instructorId") as string)?.trim() || "";

    if (!id || !studentCapacity || !branchId || !instructorId) {
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

        // Verifica se a branch existe
        const branch = await prisma.branch.findUnique({
            where: { id: branchId }
        });

        if (!branch) {
            return { message: "Filial não encontrada.", status: "error" };
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
                studentCapacity,
                branchId,
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

export async function validateData(data: any) {
    "use server";

    const searchName = data.name || '';
    const searchBranchId = data.branchId || '';
    const searchInstructorId = data.instructorId || '';

    const query: any = {};
    if (searchBranchId) query.branchId = searchBranchId;
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
