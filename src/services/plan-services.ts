"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Deletar Plano
export async function deletePlan(formData: FormData) {
    const planId = formData.get("id") as string;

    await prisma.plan.delete({
        where: { id: planId }
    });

    revalidatePath("/painel/plano");
}

// Criar Plano
export async function createPlan(prevState: any, formData: FormData) {
    try {
        const name = formData.get("name");
        const period = formData.get("period"); 
        const description = formData.get("description");
        const price = formData.get("price");

        if (!name || !period || !price) {
            return {
                status: "error",
                message: "Por favor, preencha todos os campos obrigatórios."
            };
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/plano`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                period: period, 
                description: description,
                price: parseFloat(price as string),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao salvar o plano na API");
        }

        return {
            status: "success",
            message: "Plano cadastrado com sucesso!"
        };

    } catch (error) {
        return {
            status: "error",
            message: (error as Error).message || "Erro interno ao processar o cadastro."
        };
    }
}

// Atualizar Plano (CORRIGIDO)
export async function updatePlan(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;       // 👈 CORREÇÃO: Pegando 'title' do input name="title"
    const period = formData.get("period") as string;     // 👈 CORREÇÃO: Adicionado o recebimento do período
    const price = parseFloat(formData.get("price") as string) || 0;
    const description = formData.get("description") as string;

    // Validações no servidor
    if (!id || !title || !period || !price || !description) {
        return { message: "Todos os campos são obrigatórios.", status: "error" };
    }

    if (title.trim() === "") {
        return { message: "O campo 'Título do Plano' não pode estar vazio.", status: "error" };
    }

    if (period.trim() === "") {
        return { message: "O campo 'Período' não pode estar vazio.", status: "error" };
    }

    if (price <= 0) {
        return { message: "O campo 'Preço' deve ser um número positivo.", status: "error" };
    }

    if (description.trim() === "") {
        return { message: "O campo 'Descrição' não pode estar vazio.", status: "error" };
    }

    try {
        // Executa a atualização no banco de dados mapeando corretamente as colunas do Prisma
        await prisma.plan.update({
            where: { id },
            data: {
                title: title,        // 👈 CORREÇÃO: Mapeado de 'name' para 'title' (coluna correta do banco)
                period: period,      // 👈 CORREÇÃO: Agora salvando o período editado pelo usuário
                price: price,
                description: description,
            },
        });

        revalidatePath("/painel/plano");
        return { message: "Plano atualizado com sucesso!", status: "success" };
    } catch (error) {
        console.error("Erro ao atualizar plano:", error);
        return { message: "Erro ao atualizar plano. Tente novamente.", status: "error" };
    }
}

// Validar / Listar Dados com Filtro
export async function validateData(data: any) {
    const query: any = await prisma.plan.findMany({
        where: {
            title: data.title ? { contains: data.title, mode: "insensitive" } : undefined,
            period: data.period ? { contains: data.period, mode: "insensitive" } : undefined,
            description: data.description ? { contains: data.description, mode: "insensitive" } : undefined,
            price: data.price ? parseFloat(data.price) : undefined,
        },
    });

    return { query };
}