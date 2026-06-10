"use client";
import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    FaArrowLeft, 
    FaGem,
    FaEdit,
    FaRegNewspaper
} from 'react-icons/fa';
import Link from "next/link";
import { createPublication } from "@/services/publication-services";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";

import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

export default function CreatePublicationPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(createPublication, { 
        message: "", 
        status: "" 
    });
    const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([]);
    
    const [selectedInstructor, setSelectedInstructor] = useState<string>("");
    
    useEffect(() => {
        async function loadInstructors() {
            try {
                const response = await fetch("/api/usuarios");
                if (!response.ok) {
                    throw new Error("Erro ao carregar instrutores");
                } 
                const data = await response.json();
                setInstructors(data);
            } catch (error) {
                toast.error("Não foi possível carregar os instrutores. Tente novamente mais tarde.");
            }
        }
        loadInstructors();
    }, []);

    useEffect(() => {
        if (state.status === "success") {
            toast.success("Publicação criada com sucesso!");
            router.push("/painel/publicacoes");
        } else if (state.status === "error") {
            toast.error(state.message || "Ocorreu um erro ao criar a publicação. Tente novamente.");
        }
    }, [state, router]);
        
    function handleConfirm(): void {
        formRef.current?.requestSubmit(); 
    }

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaRegNewspaper className="text-red-700 text-3xl md:text-5xl" />
                    Nova Publicação
                </h1>
                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/publicacoes" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            {/* Formulário */}
            <form ref={formRef} action={formAction} className="max-w-4xl space-y-6">
                
                {/* Campo: Título */}
                <div className="space-y-2">
                    <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        <FaGem className="text-red-700 text-base" /> Título da Publicação
                    </label>
                    <Input 
                        name="title" 
                        required 
                        placeholder="Ex: Semanário de Defesa Pessoal" 
                        className="h-11 text-base placeholder:text-zinc-400 max-w-md"
                    />
                </div>

                {/* Campo: Conteúdo */}
                <div className="space-y-2">
                    <label htmlFor="content" className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        <FaEdit className="text-red-700 text-base" /> Conteúdo informativo
                    </label>
                    <Textarea 
                        id="content" 
                        name="content" 
                        required 
                        placeholder="Escreva aqui o corpo do aviso ou publicação..."
                        className="text-base placeholder:text-zinc-400 resize-y" 
                        rows={4} 
                    />
                </div>

                {/* Campo: Instrutor Responsável (Tamanho reduzido aplicado aqui) */}
                <div className="space-y-2">
                    <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        Instrutor Responsável
                    </label>
                    <Select required onValueChange={setSelectedInstructor}>
                        {/* ALTERADO: max-w-md limita a largura horizontal e h-11 reduz a altura para casar com o input de cima */}
                        <SelectTrigger className="w-full max-w-md h-11 bg-white border-gray-300 focus:ring-zinc-900 text-base text-zinc-700">
                            <SelectValue placeholder="Selecione o instrutor" />
                        </SelectTrigger>
                        <SelectContent className={fonts.oswald.className}>
                            <SelectGroup>
                                <SelectLabel>Instrutores Disponíveis</SelectLabel>
                                {instructors.length === 0 ? (
                                    <SelectItem value="none" disabled>Nenhum instrutor disponível</SelectItem>
                                ) : (
                                    instructors.map((instructor) => (
                                        <SelectItem key={instructor.id} value={instructor.id}>
                                            {instructor.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <input type="hidden" name="authorId" value={selectedInstructor} required />
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                    <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                        <Link href="/painel/publicacoes" className="flex justify-center">Cancelar</Link>
                    </Button>
                    <Confirmation
                        title="Confirmar Cadastro"
                        message="Deseja salvar nova publicação no sistema?"
                        isPending={isPending}
                        buttonText="Cadastrar Publicação"
                        handleConfirm={handleConfirm}
                        classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                    />
                </div>
            </form>
        </div>
    );
}