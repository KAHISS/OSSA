"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    FaArrowLeft, 
    FaEdit,
    FaRegNewspaper
} from 'react-icons/fa';
import Link from "next/link";
import { updatePublication } from "@/services/publication-services";
import { useActionState, useEffect, useRef, useState, use, ChangeEvent } from "react";
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

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditPublicationPage({ params }: PageProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    
    const resolvedParams = use(params); 
    const publicationId = resolvedParams?.id;

    const [state, formAction, isPending] = useActionState(updatePublication, { 
        message: "", 
        status: "" 
    });

    const [formValues, setFormValues] = useState({
        id: "",
        title: "",
        content: ""
    });
    
    const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string>("");
    
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const handleConfirm = () => {
        formRef.current?.requestSubmit(); 
    };

    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error(state.message);
            } else if (state.status === "success") {
                toast.success("Publicação atualizada com sucesso!");
                router.push("/painel/publicacoes");
            }
        }
    }, [router, state]);

    useEffect(() => {
        if (!publicationId) return;

        async function loadData() {
            try {
                const instructorsResponse = await fetch("/api/usuarios");
                if (!instructorsResponse.ok) throw new Error("Erro ao carregar instrutores.");
                const instructorsData = await instructorsResponse.json();
                setInstructors(instructorsData);

                let response = await fetch(`/api/publicacoes/${publicationId}/atualizar`);
                
                if (!response.ok) {
                    response = await fetch(`/api/api/publicacoes/${publicationId}/atualizar`);
                    if (!response.ok) {
                        throw new Error("Publicação não encontrada no banco de dados.");
                    }
                }

                const publicacao = await response.json();
                
                setFormValues({
                    id: publicacao.id,
                    title: publicacao.title || "",
                    content: publicacao.content || ""
                });
                
                setSelectedInstructor(publicacao.instructorId || "");
                setLoadError(null);

            } catch (error) {
                setLoadError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [publicationId]);

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    }

    if (isLoading) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <p className="text-gray-600 text-xl font-semibold">Carregando dados da publicação...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <div className="bg-white rounded-lg border p-6 shadow-sm max-w-4xl">
                    <p className="text-red-600 text-xl font-semibold mb-4">⚠️ {loadError}</p>
                    <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-6 text-lg font-semibold cursor-pointer">
                        <Link href="/painel/publicacoes">Voltar para listagem</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaRegNewspaper className="text-red-700 text-3xl md:text-5xl" />
                    Editar Publicação
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/publicacoes" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">
                    <input type="hidden" name="id" value={formValues.id} />
                    
                    {/* Campo: Título da Publicação */}
                    <div className="space-y-2">
                        <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <FaRegNewspaper className="text-red-700 text-base" /> Título da Publicação
                        </label>
                        <Input 
                            name="title" 
                            required 
                            value={formValues.title}
                            onChange={handleChange}
                            className="h-11 bg-white border-gray-300 focus-visible:ring-zinc-900 max-w-md"
                        />
                    </div>

                    {/* Campo: Instrutor Responsável (Ajustado) */}
                    <div className="space-y-2">
                        <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            Instrutor Responsável
                        </label>
                        <Select 
                            required 
                            value={selectedInstructor} 
                            onValueChange={setSelectedInstructor}
                        >
                            {/* APLICADO: h-11, text-base e max-w-md para reduzir o tamanho */}
                            <SelectTrigger className="w-full max-w-md h-11 bg-white border-gray-300 focus:ring-zinc-900 text-base text-zinc-700">
                                <SelectValue placeholder="Selecione o instrutor" />
                            </SelectTrigger>
                            <SelectContent className={fonts.oswald.className}>
                                <SelectGroup>
                                    <SelectLabel>Instrutores Disponíveis</SelectLabel>
                                    {instructors.length === 0 ? (
                                        <SelectItem value="none" disabled>Nenhum instructor disponível</SelectItem>
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

                    {/* Campo: Conteúdo Informativo */}
                    <div className="space-y-2">
                        <label className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <FaEdit className="text-red-700 text-base" /> Conteúdo informativo
                        </label>
                        <Textarea 
                            name="content" 
                            rows={8}
                            required
                            value={formValues.content}
                            onChange={handleChange}
                            className="bg-white border-gray-300 focus-visible:ring-zinc-900 text-base resize-none"
                        />
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold hover:bg-gray-300">
                            <Link href="/painel/publicacoes">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Edição"
                            message="Deseja salvar as alterações desta publicação no sistema?"
                            isPending={isPending}
                            buttonText="Salvar Alterações"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold hover:bg-zinc-800"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}