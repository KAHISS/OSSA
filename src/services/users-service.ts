import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteUser(formData: FormData) {
    "use server";
    const idDoUsuario = formData.get("id") as string;

    await prisma.user.delete({
        where: { id: idDoUsuario }
    });

    revalidatePath("/painel/usuarios");
}