"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "sonner";

interface DeleteActionResult {
    message: string;
    status: "success" | "error" | string;
}

interface PopupDeleteProps {
    message: string;
    // A action pode (opcionalmente) retornar { message, status } para que o
    // ButtonDelete exiba um toast explicando por que a exclusão não pôde
    // ser feita (ex: registro usado como chave estrangeira em outra tabela).
    action: (formData: FormData) => Promise<DeleteActionResult | void> | void;
    id: string;
}

export function ButtonDelete({ message, action, id }: PopupDeleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <>
            <Button
                type="button"
                onClick={() => setIsOpen(true)}
                className="h-9 px-4 text-[15px] font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-sm"
            >
                <FaTrashAlt /> Excluir
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>

                        <p className="text-gray-600 mb-6">
                            {message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={isDeleting}
                                className="h-10 px-4"
                            >
                                Cancelar
                            </Button>

                            <form
                                action={async (formData) => {
                                    setIsDeleting(true);

                                    try {
                                        const result = await action(formData);

                                        // Action não retornou nada (padrão "fire and forget") ->
                                        // mantém o comportamento original, sem toast.
                                        if (!result) {
                                            setIsOpen(false);
                                            return;
                                        }

                                        if (result.status === "error") {
                                            // Não pôde excluir (ex: registro vinculado por chave
                                            // estrangeira em outra tabela) -> avisa o usuário e
                                            // mantém o item na lista.
                                            toast.error("Não foi possível excluir", {
                                                description: result.message,
                                            });
                                        } else {
                                            toast.success(result.message);
                                        }
                                    } catch (error) {
                                        toast.error("Não foi possível excluir", {
                                            description:
                                                "Ocorreu um erro inesperado ao tentar excluir este registro.",
                                        });
                                    } finally {
                                        setIsDeleting(false);
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <input type="hidden" name="id" value={id} />
                                <Button
                                    type="submit"
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 text-white h-10 px-4 disabled:opacity-60"
                                >
                                    {isDeleting ? "Excluindo..." : "Confirmar"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
