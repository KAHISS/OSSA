"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
    const now = new Date();

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const [
        totalStudents,
        paidPayments,
        pendingPayments,
        newRegistrations,
        overdueList
    ] = await Promise.all([
        prisma.user.count({
            where: {
                type: "Student"
            }
        }),

        prisma.payment.aggregate({
            _sum: {
                amount: true
            },
            where: {
                status: "PAID"
            }
        }),

        prisma.payment.count({
            where: {
                status: {
                    in: ["PENDING", "OVERDUE"]
                }
            }
        }),

        prisma.registration.count({
            where: {
                createdAt: {
                    gte: last30Days
                }
            }
        }),

        prisma.payment.findMany({
            where: {
                status: {
                    in: ["PENDING", "OVERDUE"]
                }
            },
            include: {
                student: true
            },
            orderBy: {
                dueDate: "asc"
            },
            take: 10
        })
    ]);

    return {
        totalStudents,
        totalRevenue: Number(
            paidPayments._sum.amount ?? 0
        ),
        pendingPayments,
        newRegistrations,
        overdueList
    };
}