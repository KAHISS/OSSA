"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { EnrollmentStatus } from "@prisma/client"; 

export interface FormState {
    message: string;
    status: "success" | "error" | "";
}

export async function deleteEnrollment(formData: FormData) {
    "use server";
    const enrollmentId = formData.get("id") as string;

    await prisma.enrollment.delete({
        where: { id: enrollmentId }
    });

    revalidatePath("/painel/matriculas");
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

export async function validateEnrollmentData(data: any) {
    const searchStatus = data.status || '';
    const searchStudentName = data.studentName || '';
    const searchGroupName = data.groupName || '';
    const searchDay = data.day || '';
    const searchMonth = data.month || '';
    const searchYear = data.year || '';

    const query: any = {};
    
    // Filtro de Status
    if (searchStatus && searchStatus !== 'todos') {
        query.status = searchStatus;
    }

    // Filtro por Nome do Aluno (Relacional)
    if (searchStudentName.trim() !== '') {
        query.student = {
            name: { contains: searchStudentName.trim(), mode: 'insensitive' }
        };
    }

    // Filtro por Nome da Turma (Relacional)
    // Assumindo que o model TrainingGroup possui um campo "name"
    if (searchGroupName.trim() !== '') {
        query.trainingGroup = {
            name: { contains: searchGroupName.trim(), mode: 'insensitive' }
        };
    }

    // Filtro por data de matrícula (comportamento espelhado do birth_date)
    if (searchYear) {
        const yearNum = parseInt(searchYear);
        let startDate, endDate;

        if (searchMonth) {
            const monthNum = parseInt(searchMonth);

            if (searchDay) {
                const dayNum = parseInt(searchDay);
                startDate = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 0, 0, 0));
                endDate = new Date(Date.UTC(yearNum, monthNum - 1, dayNum, 23, 59, 59));
            } else {
                startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
                endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59));
            }
        } else {
            startDate = new Date(Date.UTC(yearNum, 0, 1, 0, 0, 0));
            endDate = new Date(Date.UTC(yearNum, 11, 31, 23, 59, 59));
        }

        query.enrollmentDate = { gte: startDate, lte: endDate };
    }

    // Busca no Prisma incluindo as relações exigidas pelo frontend
    let enrollments = await prisma.enrollment.findMany({
        where: query,
        include: {
            student: true,
            trainingGroup: true,
            schedule: true,
        },
        orderBy: { enrollmentDate: 'desc' }
    });

    // Filtro adicional de memória (dia/mês sem ano)
    if (!searchYear && (searchMonth || searchDay)) {
        enrollments = enrollments.filter((enrollment) => {
            if (!enrollment.enrollmentDate) return false;

            const dataMatricula = new Date(enrollment.enrollmentDate);
            const monthBanco = dataMatricula.getUTCMonth() + 1;
            const dayBanco = dataMatricula.getUTCDate();

            let filterOk = true;

            if (searchMonth && monthBanco !== parseInt(searchMonth)) {
                filterOk = false;
            }

            if (searchDay && dayBanco !== parseInt(searchDay)) {
                filterOk = false;
            }

            return filterOk;
        });
    }

    // Retorna a query reconstruída para debug/persistência se necessário
    query.searchDay = searchDay;
    query.searchMonth = searchMonth;
    query.searchYear = searchYear;

    return { query, enrollments };
}