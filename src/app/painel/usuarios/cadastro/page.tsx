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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsuarioCadastro() {
  const [userType, setUserType] = useState("");
  const [genre, setGenre] = useState(""); // Corrigido
  const [belt, setBelt] = useState("");   // Corrigido

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
        userType === "aluno"
          ? "Student"
          : userType === "instrutor"
          ? "Instructor"
          : "Admin",
      belt: beltDictionary[belt] || belt,
      genre: genre,
      stripe: 0,
      birth_date: new Date().toISOString(), // ajuste depois
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

  return (
  <div className={`my-6 mx-6 font-thin ${fonts.oswald.className}`}>

    <div className="space-y-20">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 border p-10 rounded-md shadow bg-gray-50"
      >
        <h2 className="text-3xl font-bold text-indigo-700">Cadastrar Usuário</h2>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tipo de Usuário */}
          <div className="space-y-2">
        <label className="text-lg font-semibold text-gray-700"> Tipo de Usuário </label> 
        <Select onValueChange={setUserType} >   
         <SelectTrigger className="w-full h-10 bg-white border-indigo-400 focus:ring-indigo-500 text-[16px]">
             <SelectValue placeholder="Selecione o tipo" /> </SelectTrigger>
              <SelectContent position="popper">
                <div className={fonts.oswald.className}>
                  <SelectGroup>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="instrutor">Instrutor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </div>
                  </SelectContent> 
        </Select>

          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Nome Completo
            </label>
            <Input name="name" placeholder="Digite o nome..." />
          </div>

          {/* Gênero */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Gênero</label>
            <Select onValueChange={setGenre} 
  
>              <SelectTrigger className="w-full h-10 bg-white border-indigo-400 focus:ring-indigo-500 text-[16px]">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">E-mail</label>
            <Input name="email" placeholder="Digite o e-mail..." />
          </div>

          {/* Telefone Pessoal */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Telefone Pessoal
            </label>
            <Input name="personalPhone" placeholder="Digite o telefone..." />
          </div>

          {/* Telefone de Emergência */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Telefone de Emergência
            </label>
            <Input name="emergencyPhone" placeholder="Digite o telefone..." />
          </div>

          {/* Faixa */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Faixa</label>
            <Select onValueChange={setBelt} 
 
>              <SelectTrigger className="w-full h-10 bg-white border-indigo-400 focus:ring-indigo-500 text-[16px]">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="Branca">Branca</SelectItem>
                  <SelectItem value="Azul">Azul</SelectItem>
                  <SelectItem value="Roxa">Roxa</SelectItem>
                  <SelectItem value="Marrom">Marrom</SelectItem>
                  <SelectItem value="Preta">Preta</SelectItem>
                  <SelectItem value="Coral">Coral</SelectItem>
                  <SelectItem value="Vermelha">Vermelha</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Peso</label>
            <Input name="weight" placeholder="Digite o peso..." />
          </div>

          {/* Comissão */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Comissão
            </label>
            <Input name="commission" placeholder="Digite a comissão..." />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold">
            <Link href="/painel/usuarios">Limpar</Link>
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold">
            Cadastrar usuário
          </Button>
        </div>
      </form>
    </div>
    </div>
  );
}
