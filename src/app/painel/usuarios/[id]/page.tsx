"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function UsuarioCreate() {
  // Estados para controlar os selects
  const [userType, setUserType] = useState("aluno");
  const [belt, setBelt] = useState("Branca");
  const [genre, setGenre] = useState("masculino"); // Novo estado para gênero

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
      stripe: Number(formData.get("stripe")),
      type: userType === "aluno" ? "Student" : userType === "instrutor" ? "Instructor" : "Admin",
      belt: belt,
      genre: genre, // Atributo adicionado aqui
      birth_date: new Date().toISOString(), 
    };

    try {
      const response = await fetch("/api/users/ID_DO_USUARIO", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao atualizar usuário");

      alert("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alterações");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-10 bg-white rounded-2xl shadow-md space-y-10">
      
      <div>
        <h1 className="text-3xl font-bold text-indigo-700">
          Editar Usuário
        </h1>
        <FieldDescription className="text-gray-600">
          Atualize os dados do usuário
        </FieldDescription>
      </div>

      <FieldGroup className="space-y-8">

        {/* Grupo: Identificação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Tipo de Usuário</FieldLabel>
            <select 
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full h-12 border-indigo-400 rounded-md bg-white text-base px-3 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aluno">Aluno</option>
              <option value="instrutor">Instrutor</option>
              <option value="admin">Admin</option>
            </select>
          </Field>

          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Gênero</FieldLabel>
            <select 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full h-12 border-indigo-400 rounded-md bg-white text-base px-3 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </Field>
        </div>

        <div className="space-y-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Nome Completo</FieldLabel>
            <Input name="name" placeholder="Digite o nome completo..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>

          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">E-mail</FieldLabel>
            <Input name="email" type="email" placeholder="Digite o e-mail..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Contatos */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Telefone Pessoal</FieldLabel>
            <Input name="personalPhone" placeholder="Digite o telefone..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Telefone de Emergência</FieldLabel>
            <Input name="emergencyPhone" placeholder="Digite o telefone..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Status (Faixa e Listras) */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Faixa</FieldLabel>
            <select 
              value={belt}
              onChange={(e) => setBelt(e.target.value)}
              className="w-full h-12 border-indigo-400 rounded-md bg-white text-base px-3 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Branca">Branca</option>
              <option value="Azul">Azul</option>
              <option value="Roxa">Roxa</option>
              <option value="Marrom">Marrom</option>
              <option value="Preta">Preta</option>
              <option value="Coral">Coral</option>
              <option value="Vermelha">Vermelha</option>
            </select>
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Listras</FieldLabel>
            <Input name="stripe" type="number" placeholder="0-4" className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Dados adicionais */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Peso</FieldLabel>
            <Input name="weight" type="number" placeholder="Digite o peso..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Comissão</FieldLabel>
            <Input name="commission" type="number" placeholder="Digite a comissão..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

      </FieldGroup>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          variant="outline" 
          type="reset" 
          className="h-12 px-6 text-base font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Limpar
        </Button>
        <Button 
          type="submit" 
          className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold"
        >
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
}