"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function UsuarioCreate() {
  return (
    <div className="w-full max-w-4xl mx-auto p-10 bg-white rounded-2xl shadow-md space-y-10">
      
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-indigo-700">
          Editar Usuário
        </h1>
        <FieldDescription className="text-gray-600">
          Atualize os dados do usuário
        </FieldDescription>
      </div>

      {/* Formulário */}
      <FieldGroup className="space-y-8">

        {/* Grupo: Identificação */}
        <div className="space-y-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Tipo de Usuário</FieldLabel>
            <select className="w-full h-12 border-indigo-400 rounded-md bg-white text-base px-3 focus:ring-2 focus:ring-indigo-500">
              <option>Aluno</option>
              <option>Instrutor</option>
              <option>Admin</option>
            </select>
          </Field>

          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Nome Completo</FieldLabel>
            <Input placeholder="Digite o nome completo..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>

          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">E-mail</FieldLabel>
            <Input type="email" placeholder="Digite o e-mail..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Contatos */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Telefone Pessoal</FieldLabel>
            <Input placeholder="Digite o telefone..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Telefone de Emergência</FieldLabel>
            <Input placeholder="Digite o telefone..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Status (Faixa e Listras) */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Faixa</FieldLabel>
            <select className="w-full h-12 border-indigo-400 rounded-md bg-white text-base px-3 focus:ring-2 focus:ring-indigo-500">
              <option>Branca</option>
              <option>Azul</option>
              <option>Roxa</option>
              <option>Marrom</option>
              <option>Preta</option>
              <option>Coral</option>
              <option>Vermelha</option>
            </select>
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Listras</FieldLabel>
            <Input type="number" placeholder="0-4" className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

        {/* Grupo: Dados adicionais */}
        <div className="grid grid-cols-2 gap-6">
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Peso</FieldLabel>
            <Input type="number" placeholder="Digite o peso..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
          <Field>
            <FieldLabel className="text-lg font-semibold text-gray-700">Comissão</FieldLabel>
            <Input type="number" placeholder="Digite a comissão..." className="h-12 text-base border-indigo-400 focus:ring-indigo-500" />
          </Field>
        </div>

      </FieldGroup>

      {/* Botões */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" type="button" className="h-12 px-6 text-base font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">
          Limpar
        </Button>
        <Button type="submit" className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold">
          Editar
        </Button>
      </div>
    </div>
  );
}
