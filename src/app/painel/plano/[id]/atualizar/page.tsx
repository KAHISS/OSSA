"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    FaArrowLeft, 
    FaEdit,
    FaGem,
    FaRibbon,
    FaTag
} from 'react-icons/fa';
import Link from "next/link";
import { updatePlan } from "@/services/plan-services";
import { useActionState, useEffect, useRef, useState, use } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditPlanPage({ params }: PageProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    
    // Desembrulha com segurança o ID da URL no lado do cliente
    const resolvedParams = use(params);
    const planId = resolvedParams?.id;

    const [state, formAction, isPending] = useActionState(updatePlan, { 
        message: "", 
        status: "" 
    });

    const [formValues, setFormValues] = useState({
        id: "",
        title: "",
        period: "",
        description: "",
        price: ""
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const handleConfirm = () => {
        formRef.current?.requestSubmit(); 
    };

    // Monitora o resultado da Server Action de atualização
    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error("Erro", { description: state.message });
            } else if (state.status === "success") {
                toast.success("Sucesso!", { description: state.message });
                router.push("/painel/plano");
            }
        }
    }, [router, state]);

    // Busca os dados tentando as duas possíveis rotas da sua API
    useEffect(() => {
        if (!planId) return;

        async function loadPlan() {
            try {
                // Tentativa 1: Rota estrita com /atualizar no final
                let response = await fetch(`/api/plano/${planId}/atualizar`);
                
                // Tentativa 2: Caso a primeira dê 404, tenta a rota limpa por ID
                if (!response.ok) {
                    response = await fetch(`/api/plano/${planId}`);
                }

                if (!response.ok) {
                    throw new Error("Plano não encontrado no banco de dados.");
                }

                const plano = await response.json();

                setFormValues({
                    id: plano.id,
                    title: plano.title || "",
                    period: plano.period || "",
                    description: plano.description || "",
                    price: plano.price !== undefined && plano.price !== null ? String(plano.price) : "",
                });
                
                setLoadError(null);
            } catch (error) {
                setLoadError((error as Error).message);
            } finally {
                setIsLoading(false);
            }
        }

        loadPlan();
    }, [planId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <p className="text-gray-600 text-xl font-semibold">Carregando dados do plano...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
                <div className="bg-white rounded-lg border p-6 shadow-sm max-w-4xl">
                    <p className="text-red-600 text-xl font-semibold mb-4">⚠️ {loadError}</p>
                    <Button asChild className="bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-6 text-lg font-semibold cursor-pointer">
                        <Link href="/painel/plano">Voltar para listagem</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaGem className="text-red-700 text-3xl md:text-5xl" />
                    Editar Plano
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/plano" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            {/* Formulário */}
            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">
                    <input type="hidden" name="id" value={formValues.id} />
                    
                    {/* Título do Plano */}
                    <div className="space-y-2">
                        <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                            <FaGem className="text-red-700" /> Título
                        </label>
                        <Input 
                            name="title" 
                            required 
                            placeholder="Título do plano" 
                            value={formValues.title}
                            onChange={handleChange}
                            className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Período */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaRibbon className="text-red-700" /> Duração
                            </label>
                            <Select 
                                name="period" 
                                required 
                                value={formValues.period} 
                                onValueChange={(value) => setFormValues(prev => ({ ...prev, period: value }))}
                            >
                                <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                    <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-300">
                                    <SelectItem value="Mensal">Mensal</SelectItem>
                                    <SelectItem value="Trimestral">Trimestral</SelectItem>
                                    <SelectItem value="Semestral">Semestral</SelectItem>
                                    <SelectItem value="Anual">Anual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Preço */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaTag className="text-red-700" /> Preço
                            </label>
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                required
                                value={formValues.price}
                                onChange={handleChange}
                                placeholder="Preço do plano (ex: 29.99)"
                                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                            />
                        </div>

                        {/* Descrição */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaEdit className="text-red-700" /> Benefícios
                            </label>
                            <Textarea 
                                name="description" 
                                rows={4}
                                required
                                value={formValues.description}
                                onChange={handleChange}
                                placeholder="Descrição detalhada das vantagens do plano..." 
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
                            <Link href="/painel/plano" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Edição"
                            message="Deseja salvar os novos dados do plano no sistema?"
                            isPending={isPending}
                            buttonText="Atualizar Plano"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}