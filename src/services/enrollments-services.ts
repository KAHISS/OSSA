"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
 * Server Action para criação de uma nova Matrícula (Enrollment).
 *
 * REGRA: o aluno só pode ser matriculado em uma turma se ele possuir ao
 * menos uma Inscrição em Plano (Registration) com status ACTIVE. Caso
 * contrário, a operação é bloqueada com uma mensagem explicativa.
 */
export async function createEnrollment(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  const studentId = formData.get("studentId") as string;
  const trainingGroupId = formData.get("trainingGroupId") as string;
  const status = formData.get("status") as "ACTIVE" | "INACTIVE"; 
  
  const scheduleIdsRaw = formData.get("scheduleIds") as string;
  
  let scheduleIds: string[] = [];
  try {
    scheduleIds = scheduleIdsRaw ? JSON.parse(scheduleIdsRaw) : [];
  } catch (e) {
    return { status: "error", message: "Erro de integridade no formato dos horários." };
  }

  if (!studentId || !trainingGroupId || scheduleIds.length === 0) {
    return {
      status: "error",
      message: "Todos os campos obrigatórios devem ser preenchidos. Escolha o aluno, a turma e pelo menos 1 horário.",
    };
  }

  try {
    // ----------------------------------------------------------------
    // REGRA DE NEGÓCIO: aluno precisa ter inscrição ativa em um plano
    // ----------------------------------------------------------------
    const activeRegistration = await prisma.registration.findFirst({
      where: {
        studentId,
        status: "ACTIVE",
      },
      include: {
        plan: true,
      },
    });

    if (!activeRegistration) {
      // Busca o nome do aluno só para personalizar a mensagem
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        select: { name: true },
      });

      return {
        status: "error",
        message: `Não é possível matricular ${student?.name ?? "este aluno"} em uma turma pois ele não possui nenhuma inscrição ativa em um plano. Cadastre uma inscrição em plano antes de criar a matrícula.`,
      };
    }
    // ----------------------------------------------------------------

    let matriculasCriadas = 0;

    for (const scheduleId of scheduleIds) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_trainingGroupId_scheduleId: {
            studentId,
            trainingGroupId,
            scheduleId,
          },
        },
      });

      if (existingEnrollment) continue;

      await prisma.enrollment.create({
        data: {
          studentId,
          trainingGroupId,
          scheduleId,
          status,
        },
      });
      matriculasCriadas++;
    }

    if (matriculasCriadas === 0) {
      return {
        status: "error",
        message: "O aluno já está matriculado em todos os horários selecionados para esta turma.",
      };
    }

    revalidatePath("/painel/matriculas");

    return {
      status: "success",
      message: `${matriculasCriadas} matrícula(s) realizada(s) com sucesso!`,
    };

  } catch (error) {
    console.error("Erro crítico no servidor:", error);
    return {
      status: "error",
      message: "Ocorreu um erro interno no servidor ao processar a matrícula.",
    };
  }
}

/**
 * Server Action para ATUALIZAÇÃO de uma Matrícula existente
 */
export async function updateEnrollment(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const studentId = formData.get("studentId") as string;
  const trainingGroupId = formData.get("trainingGroupId") as string;
  const scheduleId = formData.get("scheduleId") as string;
  const status = formData.get("status") as "ACTIVE" | "INACTIVE";

  if (!id || !studentId || !trainingGroupId || !scheduleId) {
    return {
      status: "error",
      message: "Erro de integridade: Dados obrigatórios ausentes.",
    };
  }

  try {
    const conflictingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        trainingGroupId,
        scheduleId,
        NOT: {
          id: id,
        },
      },
    });

    if (conflictingEnrollment) {
      return {
        status: "error",
        message: "A combinação escolhida de Aluno, Turma e Horário já existe em outra matrícula.",
      };
    }

    await prisma.enrollment.update({
      where: { id },
      data: {
        studentId,
        trainingGroupId,
        scheduleId,
        status,
      },
    });

    revalidatePath("/painel/matriculas");

    return {
      status: "success",
      message: "Matrícula atualizada com sucesso!",
    };

  } catch (error) {
    console.error("Erro crítico ao atualizar matrícula no servidor:", error);
    return {
      status: "error",
      message: "Ocorreu um erro interno no servidor ao atualizar a matrícula.",
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
    
    if (searchStatus && searchStatus !== 'todos') {
        query.status = searchStatus;
    }

    if (searchStudentName.trim() !== '') {
        query.student = {
            name: { contains: searchStudentName.trim(), mode: 'insensitive' }
        };
    }

    if (searchGroupName.trim() !== '') {
        query.trainingGroup = {
            name: { contains: searchGroupName.trim(), mode: 'insensitive' }
        };
    }

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

    let enrollments = await prisma.enrollment.findMany({
        where: query,
        include: {
            student: true,
            trainingGroup: true,
            schedule: true,
        },
        orderBy: { enrollmentDate: 'desc' }
    });

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

    query.searchDay = searchDay;
    query.searchMonth = searchMonth;
    query.searchYear = searchYear;

    return { query, enrollments };
}
