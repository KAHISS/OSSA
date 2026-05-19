"use client";

import { fonts } from "@/utils/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    FaUserPlus, 
    FaArrowLeft, 
    FaUser, 
    FaEnvelope, 
    FaCalendarAlt, 
    FaPhone, 
    FaPhoneSlash, 
    FaVenusMars, 
    FaUserShield, 
    FaWeightHanging,
    FaRibbon,
    FaListOl,
    FaPercentage 
} from 'react-icons/fa';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createUser } from "@/services/users-services";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Confirmation from "@/components/ui/confirmation";

export default function CreateUserPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    
    const [userType, setUserType] = useState<string>("");

    const [state, formAction, isPending] = useActionState(createUser, { 
        message: "", 
        status: "" 
    });

    const handleConfirm = () => {
        formRef.current?.requestSubmit();
    };

    useEffect(() => {
        if (state?.message) {
            if (state.status === "error") {
                toast.error("Erro", { description: state.message });
            } else if (state.status === "success") {
                toast.success("Sucesso!", { description: state.message });
                router.push("/painel/usuarios");
            }
        }
    }, [state, router]);

    return (
        <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
                    <FaUserPlus className="text-red-700 text-3xl md:text-5xl" />
                    Novo Usuário
                </h1>

                <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
                    <Link href="/painel/usuarios" className="flex items-center justify-center gap-2">
                        <FaArrowLeft className="text-xs" /> Voltar
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-lg border p-4 md:p-8 shadow-sm">
                <form ref={formRef} action={formAction} className="space-y-6 md:space-y-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        
                        {/* Nome Completo */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaUser className="text-red-700" /> Nome Completo
                            </label>
                            <Input 
                                name="name" 
                                required 
                                placeholder="Digite o nome completo" 
                                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaEnvelope className="text-red-700" /> E-mail
                            </label>
                            <Input 
                                name="email" 
                                type="email"
                                required 
                                placeholder="exemplo@email.com" 
                                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-2">
                            <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <FaCalendarAlt className="text-red-700" /> Data de Nascimento
                            </label>
                            <Input 
                                name="birth_date" 
                                type="date"
                                required 
                                className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                            />
                        </div>

                        {/* Gênero e Peso */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaVenusMars className="text-red-700" /> Gênero
                                </label>
                                <select 
                                    name="genre" 
                                    required 
                                    className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                                >
                                    <option value="">Selecione</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaWeightHanging className="text-red-700" /> Peso (kg)
                                </label>
                                <Input 
                                    name="weight" 
                                    type="number" 
                                    step="0.01" 
                                    required 
                                    placeholder="00.00" 
                                    className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                                />
                            </div>
                        </div>

                        {/* Tipo de Usuário e Comissão */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-1">
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaUserShield className="text-red-700" /> Tipo de Usuário
                                </label>
                                <select 
                                    name="type" 
                                    required 
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Student">Aluno</option>
                                    <option value="Instructor">Instrutor</option>
                                    <option value="Admin">Administrador</option>
                                </select>
                            </div>

                            {userType === "Instructor" && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                        <FaPercentage className="text-red-700" /> Comissão (%)
                                    </label>
                                    <Input 
                                        name="commission" 
                                        type="number" 
                                        required 
                                        placeholder="0" 
                                        className="h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-lg"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Graduação: Faixa e Graus */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaRibbon className="text-red-700" /> Faixa
                                </label>
                                <Select name="belt" required>
                                    <SelectTrigger className="w-full h-12 bg-white border-gray-300 focus:ring-zinc-900 text-lg">
                                        <SelectValue placeholder="Selecione a faixa" />
                                    </SelectTrigger>
                                    <SelectContent className={fonts.oswald.className}>
                                        <SelectGroup>
                                            <SelectLabel>Graduações</SelectLabel>
                                            <SelectItem value="WHITE">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Branca</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="GRAY">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-gray-600 border border-gray-300 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Cinza</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="YELLOW">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-yellow-400 border border-gray-300 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Amarela</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="ORANGE">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-orange-500 border border-gray-300 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Laranja</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="GREEN">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-green-600 border border-gray-300 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Verde</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="BLUE">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Azul</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="PURPLE">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-purple-600 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Roxa</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="BROWN">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-[#5C4033] rounded-sm shadow-sm"></div>
                                                    <span>Faixa Marrom</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="BLACK">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-black rounded-sm shadow-sm"></div>
                                                    <span>Faixa Preta</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="CORAL">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-sm shadow-sm bg-[linear-gradient(to_bottom_right,#ef4444_50%,#000000_50%)]"></div>
                                                    <span>Faixa Coral</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="RED">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-red-600 rounded-sm shadow-sm"></div>
                                                    <span>Faixa Vermelha</span>
                                                </div>
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <FaListOl className="text-red-700" /> Graus
                                </label>
                                <select 
                                    name="degrees" 
                                    required 
                                    className="flex h-12 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
                                >
                                    <option value="0">0 Graus</option>
                                    <option value="1">1 Grau</option>
                                    <option value="2">2 Graus</option>
                                    <option value="3">3 Graus</option>
                                    <option value="4">4 Graus</option>
                                </select>
                            </div>
                        </div>

                        {/* Telefones */}
                        <div className="space-y-4 p-4 border rounded-md bg-zinc-50/50 md:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                        <FaPhone className="text-red-700" /> Telefone Celular
                                    </label>
                                    <Input name="phone" required placeholder="(00) 00000-0000" className="h-11 bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                        <FaPhoneSlash className="text-red-700" /> Telefone de Emergência
                                    </label>
                                    <Input name="emergency_phone" required placeholder="(00) 00000-0000" className="h-11 bg-white" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 md:gap-4 pt-6 border-t border-gray-100">
                        <Button type="button" variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 text-gray-800 h-12 px-8 text-xl font-semibold">
                            <Link href="/painel/usuarios" className="flex justify-center">Cancelar</Link>
                        </Button>
                        <Confirmation
                            title="Confirmar Cadastro"
                            message="Deseja salvar o novo usuário no sistema?"
                            isPending={isPending}
                            buttonText="Cadastrar Usuário"
                            handleConfirm={handleConfirm}
                            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}