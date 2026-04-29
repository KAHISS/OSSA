"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fonts } from "@/utils/fonts";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowLeft, FaTh } from "react-icons/fa";
import Confirmation from "@/components/ui/confirmation";
import { createFilterLink } from "@/utils/filters";
import { useSearchParams } from "next/navigation";

export default function UsuarioCadastro() {
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "todos";
  const currentGenre = searchParams.get("genre") || "todos";
  const [belt, setBelt] = useState("");
  const [isPending, setIsPending] = useState(false);

  const beltDictionary: Record<string, string> = {
    Branca: "WHITE",
    Cinza: "Gray",
    Amarela: "YELLOW",
    Laranja: "ORANGE",
    Verde: "GREEN",
    Azul: "BLUE",
    Roxa: "PURPLE",
    Marrom: "BROWN",
    Preta: "BLACK",
    Coral: "CORAL",
    Vermelha: "RED",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("personalPhone"),
      emergency_phone: formData.get("emergencyPhone"),
      weight: Number(formData.get("weight")),
      commission: Number(formData.get("commission")),
      type:
        currentType === "aluno"
          ? "Student"
          : currentType === "instrutor"
          ? "Instructor"
          : "Admin",
      belt: beltDictionary[belt] || belt,
      genre: currentGenre === "M" ? "M" : currentGenre === "F" ? "F" : "Other",
      stripe: Number(formData.get("stripe")),
      birth_date: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar usuário");

      const result = await response.json();
      console.log("Usuário criado:", result);
      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  function handleConfirm(): void {
    // Disparar o envio do formulário programaticamente ou via ref se necessário
    const form = document.querySelector('form');
    if(form) form.requestSubmit();
  }

  return (
    <div className={`my-4 mx-4 md:my-6 md:mx-6 font-thin ${fonts.oswald.className}`}>
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className={`text-4xl md:text-5xl ${fonts.bebas.className} flex items-center gap-3`}>
          <FaTh className="text-red-700 text-3xl md:text-5xl" />
          Novo Usuário
        </h1>

        <Button variant="outline" asChild className="w-full sm:w-auto h-10 md:h-11 px-6 text-lg md:text-xl font-semibold border-zinc-900 text-zinc-900">
          <Link href="/painel/usuarios" className="flex items-center justify-center gap-2">
            <FaArrowLeft className="text-xs" /> Voltar
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg space-y-6">
        {(() => {
          const params = new URLSearchParams();
          if (currentType && currentType !== "todos") params.set("type", currentType);
          if (currentGenre && currentGenre !== "todos") params.set("genre", currentGenre);

          return (
            <>
              <input type="hidden" name="type" value={currentType} />
              <input type="hidden" name="genre" value={currentGenre} />

              <div className="flex flex-wrap items-center justify-between w-full gap-4">
                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                 
                  <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentType === 'Student' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                    <Link href={createFilterLink('type', 'Student', params)} className="!no-underline hover:no-underline">Aluno</Link>
                  </Button>
                  <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentType === 'Instructor' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                    <Link href={createFilterLink('type', 'Instructor', params)} className="!no-underline hover:no-underline">Instrutore</Link>
                  </Button>
                  <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentType === 'Admin' ? 'bg-white shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                    <Link href={createFilterLink('type', 'Admin', params)} className="!no-underline hover:no-underline">Admin</Link>
                  </Button>
                </div>

                <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 w-fit">
                  
                  <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentGenre === 'M' ? 'bg-cyan-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                    <Link href={createFilterLink('genre', 'M', params)} className="!no-underline hover:no-underline">Masculino</Link>
                  </Button>
                  <Button variant="ghost" asChild className={`h-9 px-5 rounded-md text-[16px] font-medium transition-all ${currentGenre === 'F' ? 'bg-pink-500 shadow-sm text-black hover:bg-white' : 'text-gray-500 hover:text-black'}`}>
                    <Link href={createFilterLink('genre', 'F', params)} className="!no-underline hover:no-underline">Feminino</Link>
                  </Button>
                </div>
              </div>
            </>
          );
        })()}

        {/* --- GRID DE CAMPOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nome - Ocupa 2 colunas */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-lg font-semibold text-gray-700">Nome Completo</label>
            <Input name="name" placeholder="Digite o nome..." />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">E-mail</label>
            <Input name="email" placeholder="Digite o e-mail..." />
          </div>

          {/* Telefone Pessoal */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Telefone Pessoal</label>
            <Input name="personalPhone" placeholder="Digite o telefone..." />
          </div>

          {/* Telefone de Emergência */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Telefone de Emergência</label>
            <Input name="emergencyPhone" placeholder="Digite o telefone..." />
          </div>

          {/* Faixa - Consulta mantida exatamente igual */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Faixa</label>
            <Select value={belt} onValueChange={setBelt}>
              <input type="hidden" name="belt" value={belt} />
              <SelectTrigger className="w-full h-10 bg-white border-gray-300 focus:ring-zinc-900 text-[16px]">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent className={fonts.oswald.className}>
                <SelectGroup>
                  <SelectLabel>Faixas</SelectLabel>
                  <SelectItem value="todas"><span className="ml-6">Todas as Faixas</span></SelectItem>
                  <SelectItem value="Branca">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm shadow-sm"></div>
                      <span>Faixa Branca</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Cinza">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-600 border border-gray-300 rounded-sm shadow-sm"></div>
                      <span>Faixa Cinza</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Amarela">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 border border-gray-300 rounded-sm shadow-sm"></div>
                      <span>Faixa Amarela</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Laranja">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 border border-gray-300 rounded-sm shadow-sm"></div>
                      <span>Faixa Laranja</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Verde">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 border border-gray-300 rounded-sm shadow-sm"></div>
                      <span>Faixa Verde</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Azul">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-sm shadow-sm"></div>
                      <span>Faixa Azul</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Roxa">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-600 rounded-sm shadow-sm"></div>
                      <span>Faixa Roxa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Marrom">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#5C4033] rounded-sm shadow-sm"></div>
                      <span>Faixa Marrom</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Preta">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-black rounded-sm shadow-sm"></div>
                      <span>Faixa Preta</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Coral">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm shadow-sm bg-[linear-gradient(to_bottom_right,#ef4444_50%,#000000_50%)]"></div>
                      <span>Faixa Coral (Vermelha e Preta)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Vermelha">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 rounded-sm shadow-sm"></div>
                      <span>Faixa Vermelha</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Grid interna para campos pequenos (Grau, Peso, Comissão) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Grau</label>
              <Input name="stripe" type="number" placeholder="0-4" />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Peso</label>
              <Input name="weight" placeholder="Kg" />
            </div>

            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700">Comissão</label>
              <Input name="commission" placeholder="%" />
            </div>
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
            <Link href="/painel/usuarios" className="flex justify-center">Cancelar</Link>
          </Button>
          <Confirmation
            title="Confirmar Criação"
            message="Tem certeza que deseja criar este usuário? Esta ação não pode ser desfeita."
            isPending={isPending}
            buttonText="Criar Usuário"
            handleConfirm={handleConfirm}
            classNameButton="w-full sm:w-auto bg-zinc-900 text-white h-12 px-8 text-xl font-semibold"
          />
        </div>
      </form>
    </div>
  );
}