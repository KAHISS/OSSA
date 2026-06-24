"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateDueDate } from "@/utils/registration-utils";

export interface FormState {
  message: string;
  status: "success" | "error" | "";
}

// Remover matrícula no plano
export async function deleteRegistration(formData: FormData) {
  "use server";
  const registrationId = formData.get("id") as string;

  await prisma.registration.delete({
    where: { id: registrationId },
  });

  revalidatePath("/painel/registrations");
}

/**
 * Server Action para criação de uma nova matrícula de Aluno em um Plano (Registration)
 * A data de vencimento (dueDate) NÃO é informada pelo usuário: ela é calculada
 * automaticamente com base na data de hoje + duração (period) do plano escolhido.
 */
export async function createRegistration(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const studentId = formData.get("studentId") as string;
  const planId = formData.get("planId") as string;
  const status = formData.get("status") as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "CANCELLED";

  if (!studentId || !planId) {
    return {
      status: "error",
      message: "Todos os campos obrigatórios devem ser preenchidos. Escolha o aluno e o plano.",
    };
  }

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!plan) {
      return {
        status: "error",
        message: "O plano selecionado não foi encontrado.",
      };
    }

    // Evita que o mesmo aluno tenha duas matrículas ATIVAS para o mesmo plano
    const existingActiveRegistration = await prisma.registration.findFirst({
      where: {
        studentId,
        planId,
        status: "ACTIVE",
      },
    });

    if (existingActiveRegistration) {
      return {
        status: "error",
        message: "Este aluno já possui uma matrícula ativa para este plano.",
      };
    }

    const startDate = new Date();
    const dueDate = calculateDueDate(plan.period, startDate);

    await prisma.registration.create({
      data: {
        studentId,
        planId,
        startDate,
        dueDate,
        status: status || "ACTIVE",
      },
    });

    revalidatePath("/painel/registrations");

    return {
      status: "success",
      message: `Matrícula no plano realizada com sucesso! Vencimento calculado para ${dueDate.toLocaleDateString("pt-BR")}.`,
    };
  } catch (error) {
    console.error("Erro crítico no servidor:", error);
    return {
      status: "error",
      message: "Ocorreu um erro interno no servidor ao processar a matrícula no plano.",
    };
  }
}

/**
 * Server Action para ATUALIZAÇÃO de uma Registration existente
 */
export async function updateRegistration(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const studentId = formData.get("studentId") as string;
  const planId = formData.get("planId") as string;
  const dueDate = formData.get("dueDate") as string;
  const status = formData.get("status") as "ACTIVE" | "INACTIVE" | "SUSPENDED" | "CANCELLED";

  if (!id || !studentId || !planId || !dueDate) {
    return {
      status: "error",
      message: "Erro de integridade: Dados obrigatórios ausentes.",
    };
  }

  try {
    // Verifica se a alteração colide com outra matrícula ativa do mesmo aluno/plano
    if (status === "ACTIVE") {
      const conflictingRegistration = await prisma.registration.findFirst({
        where: {
          studentId,
          planId,
          status: "ACTIVE",
          NOT: { id },
        },
      });

      if (conflictingRegistration) {
        return {
          status: "error",
          message: "Já existe outra matrícula ativa para este aluno neste mesmo plano.",
        };
      }
    }

    await prisma.registration.update({
      where: { id },
      data: {
        studentId,
        planId,
        dueDate: new Date(dueDate),
        status,
      },
    });

    revalidatePath("/painel/registrations");

    return {
      status: "success",
      message: "Matrícula no plano atualizada com sucesso!",
    };
  } catch (error) {
    console.error("Erro crítico ao atualizar matrícula no plano:", error);
    return {
      status: "error",
      message: "Ocorreu um erro interno no servidor ao atualizar a matrícula no plano.",
    };
  }
}

/**
 * Busca e filtra as matrículas em planos (utilizado na listagem)
 */
export async function validateRegistrationData(data: any) {
  const searchStatus = data.status || "";
  const searchStudentName = data.studentName || "";
  const searchPlanTitle = data.planTitle || "";
  const searchDay = data.day || "";
  const searchMonth = data.month || "";
  const searchYear = data.year || "";

  const query: any = {};

  // Filtro de Status
  if (searchStatus && searchStatus !== "todos") {
    query.status = searchStatus;
  }

  // Filtro por Nome do Aluno (Relacional)
  if (searchStudentName.trim() !== "") {
    query.student = {
      name: { contains: searchStudentName.trim(), mode: "insensitive" },
    };
  }

  // Filtro por Título do Plano (Relacional)
  if (searchPlanTitle.trim() !== "") {
    query.plan = {
      title: { contains: searchPlanTitle.trim(), mode: "insensitive" },
    };
  }

  // Filtro por data de vencimento (mesmo comportamento espelhado do enrollmentDate)
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

    query.dueDate = { gte: startDate, lte: endDate };
  }

  // Busca no Prisma incluindo as relações exigidas pelo frontend
  let registrations = await prisma.registration.findMany({
    where: query,
    include: {
      student: true,
      plan: true,
    },
    orderBy: { dueDate: "desc" },
  });

  // Filtro adicional em memória (dia/mês sem ano)
  if (!searchYear && (searchMonth || searchDay)) {
    registrations = registrations.filter((registration) => {
      if (!registration.dueDate) return false;

      const dataVencimento = new Date(registration.dueDate);
      const monthBanco = dataVencimento.getUTCMonth() + 1;
      const dayBanco = dataVencimento.getUTCDate();

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

  return { query, registrations };
}
