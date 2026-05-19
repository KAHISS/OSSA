"use server";

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

export async function createUser(prevState: any, formData: FormData) {
    "use server";

    const name = (formData.get("name") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const emergency_phone = (formData.get("emergency_phone") as string)?.trim() || "";
    const weight = parseFloat(formData.get("weight") as string);
    const commission = parseFloat(formData.get("commission") as string);
    const genre = (formData.get("genre") as string)?.trim() || "";
    const birth_date = formData.get("birth_date") as string;
    const type = (formData.get("type") as string)?.trim() || "";
    const belt = (formData.get("belt") as string)?.trim() || "WHITE";
    const stripe = parseInt(formData.get("stripe") as string) || 0;

    if (!name || !email || !phone || !emergency_phone || !genre || !birth_date || !type) {
        return { message: "Todos os campos obrigatórios devem ser preenchidos.", status: "error" };
    }

    const parsedBirthDate = new Date(birth_date);
    if (Number.isNaN(parsedBirthDate.getTime())) {
        return { message: "Data de nascimento inválida.", status: "error" };
    }

    if (Number.isNaN(weight)) {
        return { message: "O campo Peso deve ser um número válido.", status: "error" };
    }

    if (type === "Instructor" && Number.isNaN(commission)) {
        return { message: "O campo Comissão deve ser um número válido.", status: "error" };
    }

    await prisma.user.create({
        data: {
            name,
            email,
            genre,
            birth_date: parsedBirthDate,
            phone,
            emergency_phone,
            weight,
            type: type as any,
            student:
                type === "Student"
                    ? {
                          create: {
                              belt: (belt || "WHITE") as any,
                              stripe,
                          },
                      }
                    : undefined,
            instructor:
                type === "Instructor"
                    ? {
                          create: {
                              belt: (belt || "WHITE") as any,
                              stripe,
                              commissionPerStudent: Number.isNaN(commission) ? 0 : commission,
                          },
                      }
                    : undefined,
        },
    });

    revalidatePath("/painel/usuarios");

    return { message: `Usuário ${name} criado com sucesso!`, status: "success" };
}

export async function updateUser(prevState: any, formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const emergency_phone = (formData.get("emergency_phone") as string)?.trim() || "";
    const weight = parseFloat(formData.get("weight") as string);
    const commission = parseFloat(formData.get("commission") as string) || 0;
    const genre = (formData.get("genre") as string)?.trim() || "";
    const birth_date = formData.get("birth_date") as string;
    const type = (formData.get("type") as string)?.trim() || "";
    const belt = (formData.get("belt") as string)?.trim() || "WHITE";
    const stripe = parseInt(formData.get("stripe") as string) || 0;

    if (!id || !name || !email || !phone || !emergency_phone || !genre || !birth_date || !type) {
        return { message: "Todos os campos obrigatórios devem ser preenchidos.", status: "error" };
    }

    const parsedBirthDate = new Date(birth_date);
    if (Number.isNaN(parsedBirthDate.getTime())) {
        return { message: "Data de nascimento inválida.", status: "error" };
    }

    if (Number.isNaN(weight)) {
        return { message: "O campo Peso deve ser um número válido.", status: "error" };
    }

    if (type === "Instructor" && Number.isNaN(commission)) {
        return { message: "O campo Comissão deve ser um número válido.", status: "error" };
    }

    if (type === "Student") {
        await prisma.instructor.deleteMany({ where: { id } });
    } else if (type === "Instructor") {
        await prisma.student.deleteMany({ where: { id } });
    } else {
        await prisma.student.deleteMany({ where: { id } });
        await prisma.instructor.deleteMany({ where: { id } });
    }

    const updateData: any = {
        name,
        email,
        genre,
        birth_date: parsedBirthDate,
        phone,
        emergency_phone,
        weight,
        type: type as any,
    };

    if (type === "Student") {
        updateData.student = {
            upsert: {
                create: {
                    belt: (belt || "WHITE") as any,
                    stripe,
                },
                update: {
                    belt: (belt || "WHITE") as any,
                    stripe,
                },
            },
        };
    } else if (type === "Instructor") {
        updateData.instructor = {
            upsert: {
                create: {
                    belt: (belt || "WHITE") as any,
                    stripe,
                    commissionPerStudent: Number.isNaN(commission) ? 0 : commission,
                },
                update: {
                    belt: (belt || "WHITE") as any,
                    stripe,
                    commissionPerStudent: Number.isNaN(commission) ? 0 : commission,
                },
            },
        };
    }

    await prisma.user.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/painel/usuarios");

    return { message: `Usuário ${name} atualizado com sucesso!`, status: "success" };
}

export async function validateData(data: any) {

    const beltDictionary: Record<string, string> = {
        Branca: "WHITE",
        Cinza: "GRAY", // corrigido
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
    const searchGenre = data.genre || '';
    const searchPersonalPhone = data.personalPhone || '';
    const searchEmergencyPhone = data.emergencyPhone || '';
    const searchDay = data.day || '';
    const searchMonth = data.month || '';
    const searchYear = data.year || '';
    const searchWeight = data.weight || '';
    const searchType = data.type || '';
    const searchCommission = data.commission || '';
    const searchBelt = data.belt || 'todas';
    const searchStripe = data.stripe || 'todos';

    const query: any = {};
    
    if (searchGenre && searchGenre !== 'todos') {
        query.genre = searchGenre;
    }

    if (searchType && searchType !== 'todos') {
        query.type = searchType;
    }

    if (searchName.trim() !== '') {
        query.name = { contains: searchName.trim(), mode: 'insensitive' };
    }
    if (searchEmail.trim() !== '') {
        query.email = { contains: searchEmail.trim(), mode: 'insensitive' };
    }
    if (searchPersonalPhone.trim() !== '') {
        query.phone = { contains: searchPersonalPhone.trim() }; 
    }
    if (searchEmergencyPhone.trim() !== '') {
        query.emergency_phone = { contains: searchEmergencyPhone.trim() };
    }

    if (searchWeight.trim() !== '') {
        query.weight = parseFloat(searchWeight);
    }
    if (searchCommission.trim() !== '') {
        query.instructor = {
            is: { commissionPerStudent: parseFloat(searchCommission) }
        };
    }
    
    // filtro de faixa e grau
    if (searchBelt !== 'todas' || searchStripe !== 'todos') {
        const conditionBeltStripe: any = {};

        if (searchBelt !== 'todas') {
            const translatedBelt = beltDictionary[searchBelt] || searchBelt.toUpperCase();
            conditionBeltStripe.belt = translatedBelt;
        }

        if (searchStripe !== 'todos') {
            conditionBeltStripe.stripe = parseInt(searchStripe);
        }

        query.OR = [
            { student: { is: conditionBeltStripe } },
            { instructor: { is: conditionBeltStripe } }
        ];
    }

    // filtro por data
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

    // filtro adicional (dia/mês sem ano)
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

    query.searchDay = searchDay;
    query.searchMonth = searchMonth;
    query.searchYear = searchYear;

    return { query, users };
}