"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Deletar Publicação
export async function deletePublication(formData: FormData) {
    try {
        const publicationId = formData.get("id") as string;

        if (!publicationId) return;

        await prisma.publication.delete({
            where: { id: publicationId }
        });

        revalidatePath("/painel/publicacoes");
    } catch (error) {
        console.error("Erro ao deletar:", error);
    }
}

// Criar Publicação
export async function createPublication(prevState: any, formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const authorId = formData.get("authorId") as string; // Captura direto como string

        // Validação básica dos campos obrigatórios
        if (!title || !content || !authorId || authorId === "none") {
            return {
                status: "error",
                message: "Por favor, preencha todos os campos obrigatórios."
            };
        }

        // Salvando no banco via Prisma usando o ID recebido diretamente como String
        await prisma.publication.create({
            data: {
                title: title,
                content: content,
                name: authorId, // Passa a string direto para a propriedade 'name' do schema
            }
        });

        // Atualiza o cache da página de listagem
        revalidatePath("/painel/publicacoes");

        return {
            status: "success",
            message: "Publicação cadastrada com sucesso!"
        };

    } catch (error) {
        console.error("Erro no servidor ao criar publicação:", error);
        return {
            status: "error",
            message: (error as Error).message || "Erro interno ao processar o cadastro."
        };
    }
}

// Atualizar Publicação
export async function updatePublication(prevState: any, formData: FormData) {
    try {
        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const authorId = formData.get("authorId") as string; // Captura direto como string

        // Validação básica dos campos obrigatórios
        if (!id || !title || !content || !authorId || authorId === "none") {
            return {
                status: "error",
                message: "Por favor, preencha todos os campos obrigatórios."
            };
        }

        // Atualizando os dados no banco via Prisma
        await prisma.publication.update({
            where: { id: id },
            data: {
                title: title,
                content: content,
                name: authorId, // Atualiza salvando na coluna 'name'
            }
        });

        // Atualiza o cache da listagem para renderizar os novos dados na tabela
        revalidatePath("/painel/publicacoes");

        return {
            status: "success",
            message: "Publicação atualizada com sucesso!"
        };

    } catch (error) {
        console.error("Erro no servidor ao atualizar publicação:", error);
        return {
            status: "error",
            message: (error as Error).message || "Erro interno ao processar a atualização."
        };
    }
}