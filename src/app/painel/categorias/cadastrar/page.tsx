"use client";
import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    FaTh, 
    FaSave, 
    FaArrowLeft, 
    FaLayerGroup, 
    FaWeightHanging, 
    FaTag 
} from 'react-icons/fa';
import Link from "next/link";
import { createCategory } from "@/services/categories-services";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Confirmation from "@/components/ui/confirmation";

export default function CreateCategoryPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(createCategory, { 
        message: "", 
        status: "" 
    });

    const handleConfirm = () => {
        formRef.current?.requestSubmit(); // Dispara o formulário respeitando as validações do HTML5
    };

    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error("Erro", {
                    description: state.message,
                });
            } else if (state.status === "success") {
                toast.success("Sucesso!", {
                    description: state.message,
                });
                router.push("/painel/categorias");
            }
        }
    }, [state]);

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header Responsivo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaTh className="text-red-700 text-3xl md:text-5xl" />
                    Nova Categoria
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/categorias" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">
                    
                    {/* Nome da Categoria - Full Width */}
                    <div className="space-y-2">
                        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <FaTag className="text-red-700" /> Nome da Categoria
                        </label>
                        <Input 
                            name="name" 
                            required 
                            placeholder="Ex: Infantil B - Pena" 
                            className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        
                        {/* Grupo: Faixa Etária */}
                        <div className="space-y-4 p-4 border rounded-md bg-zinc-50/50">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FaLayerGroup className="text-red-700" /> Faixa Etária (anos)
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase text-gray-500">Mínima</span>
                                    <Input name="start_age_group" type="number" required placeholder="0" className="h-11 bg-white" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase text-gray-500">Máxima</span>
                                    <Input name="finish_age_group" type="number" required placeholder="18" className="h-11 bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* Grupo: Faixa de Peso */}
                        <div className="space-y-4 p-4 border rounded-md bg-zinc-50/50">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                                <FaWeightHanging className="text-red-700" /> Faixa de Peso (kg)
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase text-gray-500">Mínimo</span>
                                    <Input name="start_weight_range" type="number" step="0.1" required placeholder="0.0" className="h-11 bg-white" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold uppercase text-gray-500">Máximo</span>
                                    <Input name="finish_weight_range" type="number" step="0.1" required placeholder="120.0" className="h-11 bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* Descrição - Full Width no Desktop */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-lg font-semibold text-gray-700">Descrição</label>
                            <Textarea 
                                name="description" 
                                rows={3}
                                placeholder="Notas adicionais sobre a categoria..." 
                                className="bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg resize-none"
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            asChild 
                            className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold"
                        >
                            <Link href="/painel/categorias" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Criação"
                            message="Tem certeza que deseja criar esta categoria? Esta ação não pode ser desfeita."
                            isPending={isPending}
                            buttonText="Criar Categoria"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}