"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaTrashAlt } from "react-icons/fa";

interface PopupDeleteProps {
    message: string;
    action: (formData: FormData) => void;
    id: string;
}

export function ButtonDelete({ message, action, id }: PopupDeleteProps) {
    const [isOpen, setIsOpen] = useState(false);

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
                                className="h-10 px-4"
                            >
                                Cancelar
                            </Button>

                            <form action={async (formData) => {
                                await action(formData);
                                setIsOpen(false);
                            }}>
                                <input type="hidden" name="id" value={id} />
                                <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white h-10 px-4"
                                >
                                    Confirmar
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}