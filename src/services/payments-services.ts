"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@generated/prisma/client";

//    export async function generateMonthlyPaymentForStudent(studentId: string) {
//        const student = await prisma.user.findUnique({
//            where: { id: studentId },
//            include: { plan: true },
//        });
//
//        if (!student?.plan) return null;
//
//        const now = new Date();
//        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
//
//        const existingPayment = await prisma.payment.findFirst({
//            where: {
//                studentId,
//                type: "PLAN",
//                dueDate: { gte: startOfMonth, lt: endOfMonth },
//            },
//        });
//
//        if (existingPayment) return existingPayment;
//
//        const payment = await prisma.payment.create({
//            data: {
//                studentId,
//                type: "PLAN",
//                amount: student.plan.valor,
//                dueDate: now,
//                status: "PENDING",
//            },
//        });
//
//        revalidatePath("/painel/pagamentos");
//        return payment;
//    }

interface PaymentFilters {
    studentName?: string;
    status?: string;
    type?: string;
    method?: string;
    month?: string;
    year?: string;
}

export async function validatePaymentData(params: PaymentFilters) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.studentName) {
        where.student = {
            name: {
                contains: params.studentName,
                mode: "insensitive",
            },
        };
    }

    if (params.status && params.status !== "todos") {
        where.status = params.status as Prisma.PaymentWhereInput["status"];
    }

    if (params.type && params.type !== "todos") {
        where.type = params.type as Prisma.PaymentWhereInput["type"];
    }

    if (params.method && params.method !== "todos") {
        where.paymentMethod = params.method as Prisma.PaymentWhereInput["paymentMethod"];
    }

    if (params.month || params.year) {
        const year = params.year ? parseInt(params.year) : new Date().getFullYear();
        const month = params.month ? parseInt(params.month) - 1 : undefined;

        if (month !== undefined && !isNaN(month)) {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 1);
            where.dueDate = { gte: start, lt: end };
        } else if (params.year) {
            const start = new Date(year, 0, 1);
            const end = new Date(year + 1, 0, 1);
            where.dueDate = { gte: start, lt: end };
        }
    }

    const payments = await prisma.payment.findMany({
        where,
        include: { student: true },
        orderBy: { dueDate: "desc" },
    });

    return { query: where, payments };
}

export async function getPaymentsKpis() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [totalPendenteAgg, totalRecebidoAgg, pagamentosAtrasados, pagamentosDoMes] =
        await Promise.all([
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: { status: "PENDING" },
            }),
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    status: "PAID",
                    paymentDate: { gte: startOfMonth, lt: endOfMonth },
                },
            }),
            prisma.payment.count({
                where: {
                    status: "PENDING",
                    dueDate: { lt: now },
                },
            }),
            prisma.payment.count({
                where: { dueDate: { gte: startOfMonth, lt: endOfMonth } },
            }),
        ]);

    return {
        totalPendente: Number(totalPendenteAgg._sum.amount ?? 0),
        totalRecebidoMes: Number(totalRecebidoAgg._sum.amount ?? 0),
        pagamentosAtrasados,
        pagamentosDoMes,
    };
}

export async function deletePayment(formData: FormData) {
    const id = formData.get("id") as string;

    if (!id) return;

    await prisma.payment.delete({ where: { id } });
    revalidatePath("/painel/pagamentos");
}

export async function getPaymentById(id: string) {
    return prisma.payment.findUnique({
        where: { id },
        include: { student: true },
    });
}