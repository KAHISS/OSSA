import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(formData: FormData) {
    "use server";
    const userId = formData.get("id") as string;

    await prisma.user.delete({
        where: { id: userId }
    });

    revalidatePath("/painel/usuarios");
}

export async function validateData(data: any) {

    const beltDictionary: Record<string, string> = {
        Branca: "WHITE",
        Cinza: "Gray",
        Amarela: "YELLOW",
        Laranja: "ORANGE",
        Verde: "GREEN",
        Azul: "BLUE",
        Roxa: "PURPLE",
        Marrom: "BROWN",
        Preta: "BLACK",
        Coral: "CORAL",
        Vermelha: "RED",
    };

    const searchName = data.name || '';
    const searchEmail = data.email || '';
    const searchPersonalPhone = data.personalPhone || '';
    const searchEmergencyPhone = data.emergencyPhone || '';
    const searchDay = data.day || '';
    const searchMonth = data.month || '';
    const searchYear = data.year || '';
    const searchWeight = data.weight || '';
    const searchCommission = data.commission || '';
    const searchBelt = data.belt || 'todas';
    const searchStripe = data.stripe || 'todos';

    const query: any = {};
    if (["Student", "Instructor", "Admin"].includes(String(data.type))) query.type = data.type
    query.genre = data.genre;
    if (searchName) query.name = { startsWith: searchName, mode: 'insensitive' };
    if (searchEmail) query.email = { contains: searchEmail, mode: 'insensitive' };
    if (searchPersonalPhone) query.phone = { contains: searchPersonalPhone };
    if (searchEmergencyPhone) query.emergency_phone = { contains: searchEmergencyPhone };
    if (searchWeight) {
        query.weight = parseFloat(searchWeight);
    }
    if (searchCommission) {
        query.instructor = {
            commissionPerStudent: parseFloat(searchCommission)
        };
    }

    if (searchBelt !== 'todas' || searchStripe !== 'todos') {
        const conditionBeltStripe: any = {};

        if (searchBelt !== 'todas') {
            const [belt] = Object.entries(beltDictionary).find(([key, val]) => val === searchBelt) || [searchBelt.toLocaleUpperCase()];
            conditionBeltStripe.belt = belt;
        }

        if (searchStripe !== 'todos') {
            conditionBeltStripe.stripe = parseInt(searchStripe);
        }

        query.OR = [
            { student: { is: conditionBeltStripe } },
            { instructor: { is: conditionBeltStripe } }
        ];
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

        query.birth_date = { gte: startDate, lte: endDate };
    }

    let users = await prisma.user.findMany({
        where: query,
        include: {
            student: true,
            instructor: true,
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!searchYear && (searchMonth || searchDay)) {
        users = users.filter((user) => {
            if (!user.birth_date) return false;

            const dataNascimento = new Date(user.birth_date);
            const monthBanco = dataNascimento.getUTCMonth() + 1;
            const dayBanco = dataNascimento.getUTCDate();

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

    query.searchDay = searchDay
    query.searchMonth = searchMonth
    query.searchYear = searchYear

    return { query, users };
}