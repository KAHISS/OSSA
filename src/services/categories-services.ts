"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(formData: FormData) {
    "use server";
    const categoryId = formData.get("id") as string;

    await prisma.category.delete({
        where: { id: categoryId }
    });

    revalidatePath("/painel/usuarios");
}

export async function createCategory(prevState: any, formData: FormData) {

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const start_age_group = parseInt(formData.get("start_age_group") as string) || 0;
    const finish_age_group = parseInt(formData.get("finish_age_group") as string) || 0;
    const start_weight_range = parseFloat(formData.get("start_weight_range") as string) || 0;
    const finish_weight_range = parseFloat(formData.get("finish_weight_range") as string) || 0;

    if (!name || !start_age_group || !finish_age_group || !start_weight_range || !finish_weight_range) {
        return { message: "Todos os campos são obrigatórios.", status: "error" };
    }

    if (name === "") {
        return { message: "O campo 'Nome da Categoria' não pode estar vazio.", status: "error" };
    }

    if (isNaN(start_age_group) || isNaN(finish_age_group) || isNaN(start_weight_range) || isNaN(finish_weight_range)) {
        return { message: "Os campos de faixa etária e faixa de peso devem ser números válidos.", status: "error" };
    }

    await prisma.category.create({
        data: {
            name,
            description,
            age_group: `${start_age_group}-${finish_age_group}`,
            weight_range: `${start_weight_range}-${finish_weight_range}`
        }
    });

    return { message: `Categoria ${name} criada com sucesso!`, status: "success" };
}

// Função para Editar uma categoria existente
export async function updateCategory(prevState: any, formData: FormData) {

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const start_age_group = parseInt(formData.get("start_age_group") as string) || 0;
    const finish_age_group = parseInt(formData.get("finish_age_group") as string) || 0;
    const start_weight_range = parseFloat(formData.get("start_weight_range") as string) || 0;
    const finish_weight_range = parseFloat(formData.get("finish_weight_range") as string) || 0;

    if (!name || !start_age_group || !finish_age_group || !start_weight_range || !finish_weight_range) {
        return { message: "Todos os campos são obrigatórios.", status: "error" };
    }

    if (name === "") {
        return { message: "O campo 'Nome da Categoria' não pode estar vazio.", status: "error" };
    }

    if (isNaN(start_age_group) || isNaN(finish_age_group) || isNaN(start_weight_range) || isNaN(finish_weight_range)) {
        return { message: "Os campos de faixa etária e faixa de peso devem ser números válidos.", status: "error" };
    }

    await prisma.category.update({
        where: { id },
        data: {            
            name,
            description,
            age_group: `${start_age_group}-${finish_age_group}`,
            weight_range: `${start_weight_range}-${finish_weight_range}`
        }
    });

    return { message: `Categoria ${name} atualizada com sucesso!`, status: "success" };
}


export async function validateData(data: any) {

    const searchName = data.name || '';
    const searchDescription = data.description || '';
    const searchAgeGroup = data.age_group || '';
    const searchWeightRange = data.weight_range || '';

    const query: any = {};
    if (searchName) query.name = { startsWith: searchName, mode: 'insensitive' };
    if (searchDescription) query.description = { contains: searchDescription, mode: 'insensitive' };
    if (searchAgeGroup) query.age_group = { contains: searchAgeGroup };
    if (searchWeightRange) query.weight_range = { contains: searchWeightRange };

    const categories = await prisma.category.findMany({
        where: query,
        orderBy: { createdAt: 'desc' }
    });

    return {query, categories}
}