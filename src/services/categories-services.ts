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