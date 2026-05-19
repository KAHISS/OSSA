"use client"; // Obrigatório para usar hooks de estado

import { useFormState, useFormStatus } from "react-dom";
import { createCategory } from "@/services/categories-services";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sub-componente para o botão (para mostrar o estado de carregando)
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar Categoria"}
        </Button>
    );
}

export default function CreateCategoryPage() {
    // initialState define o valor inicial do retorno da action
    const [state, formAction] = useFormState(createCategory, { message: "", status: "" });

    return (
        <form action={formAction}>
            {/* Exibição da mensagem de erro ou sucesso */}
            {state?.message && (
                <div className={`p-4 mb-4 rounded ${state.status === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {state.message}
                </div>
            )}

            {/* Seus inputs aqui... */}
            <Input name="name" required />
            
            <SubmitButton />
        </form>
    );
}