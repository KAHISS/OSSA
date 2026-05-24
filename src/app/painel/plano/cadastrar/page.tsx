"use client";
import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    FaTh, 
    FaArrowLeft, 
    FaTag, 
    FaEdit,
    FaRibbon
} from 'react-icons/fa';
import Link from "next/link";
import { createPlan } from "@/services/plan-services";
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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"; // CORREÇÃO: Centralizado os imports do Select da sua UI local

export default function CreatePlanPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(createPlan, { 
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
                router.push("/painel/plano");
            }
        }
    }, [state, router]);

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaTh className="text-red-700 text-3xl md:text-5xl" />
                    Novo Plano
                </h1>
                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/plano" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>
            
            <form ref={formRef} action={formAction} className="space-y-4">
                <div>
                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <FaTh className="text-red-700" /> Nome do Plano
                    </label>
                    <Input name="name" required placeholder="Ex: Plano Básico" />
                </div>
                
                <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <FaRibbon className="text-red-700" /> Período
                    </label>
                    {/* CORREÇÃO: Ajustado para usar os subcomponentes corretos da sua pasta ui/select e alterado name para period */}
                    <Select name="period" required>
                        <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                            <SelectValue placeholder="Selecione o periodo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                            <SelectItem value="Mensal">Mensal</SelectItem>
                            <SelectItem value="Trimestral">Trimestral</SelectItem>
                            <SelectItem value="Semestral">Semestral</SelectItem>
                            <SelectItem value="Anual">Anual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                  
                <div>
                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <FaEdit className="text-red-700" /> Descrição
                    </label>
                    <Textarea name="description" required placeholder="Descreva os detalhes do plano..." />
                </div>
                
                <div>
                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <FaTag className="text-red-700" /> Preço
                    </label>
                    <Input name="price" type="number" step="0.01" required placeholder="Preço do plano (ex: 29.99)" />
                </div>
                
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                    <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                        <Link href="/painel/plano" className="flex justify-center">Cancelar</Link>
                    </Button>
                    <Confirmation
                        title="Confirmar Cadastro"
                        message="Deseja salvar o novo plano no sistema?"
                        isPending={isPending}
                        buttonText="Cadastrar Plano"
                        handleConfirm={handleConfirm}
                        classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                    />
                </div>
            </form>

            {/* Diálogo de Confirmação */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {/* O botão de salvar já dispara o formulário, então não precisamos de um trigger separado */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Criação</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza de que deseja criar este plano? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}