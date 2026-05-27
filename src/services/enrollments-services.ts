"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EnrollmentStatus } from "@prisma/client"; 

export interface FormState {
    message: string;
    status: "success" | "error" | "";
}

/**
 * Server Action para criação de uma nova Matrícula (Enrollment)
 */
export async function createEnrollment(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const studentId = formData.get("studentId") as string;
    const trainingGroupId = formData.get("trainingGroupId") as string;
    const scheduleId = formData.get("scheduleId") as string;
    const status = formData.get("status") as EnrollmentStatus;

    if (!studentId || !trainingGroupId || !scheduleId) {
        return {
            status: "error",
            message: "Todos os campos obrigatórios devem ser preenchidos.",
        };
    }

    try {
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                studentId_trainingGroupId_scheduleId: {
                    studentId,
                    trainingGroupId,
                    scheduleId,
                },
            },
        });

        if (existingEnrollment) {
            return {
                status: "error",
                message: "Este aluno já está matriculado nesta turma com este exato horário.",
            };
        }

        await prisma.enrollment.create({
            data: {
                studentId,
                trainingGroupId,
                scheduleId,
                status
            },
        });

        revalidatePath("/painel/matriculas");

        return {
            status: "success",
            message: "Matrícula realizada com sucesso!",
        };

    } catch (error) {
        console.error("Erro crítico ao criar matrícula no servidor:", error);
        return {
            status: "error",
            message: "Ocorreu um erro interno no servidor ao processar a matrícula.",
        };
    }
}