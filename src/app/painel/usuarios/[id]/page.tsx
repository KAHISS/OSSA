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
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
      
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold text-blue-700">
          Editar Usuário
        </h1>
        <FieldDescription>
          Preencha os dados que deseja alterar
        </FieldDescription>
      </div>

      {/* Formulário */}
      <FieldGroup className="space-y-4">

        {/* Nome */}
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Nome" />
          <Input placeholder="Sobrenome" />
        </div>

        {/* Email */}
        <Input type="email" placeholder="Email" />

        {/* Data */}
        <Field>
          <FieldLabel>Data de nascimento</FieldLabel>
          <Input type="date" />
        </Field>

        {/* Senha */}
        <Input type="password" placeholder="Senha" />

        {/* Telefones */}
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Telefone" />
          <Input placeholder="Telefone de emergência" />
        </div>

        {/* Peso */}
        <Input type="number" placeholder="Peso" />

        {/* Tipo */}
        <Field>
          <FieldLabel>Tipo de usuário</FieldLabel>
          <select className="w-full border p-2 rounded bg-blue-50 focus:ring-2 focus:ring-blue-200">
            <option>Student</option>
            <option>Instructor</option>
            <option>Admin</option>
          </select>
        </Field>

        {/* Faixa e Listras */}
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Faixa (WHITE, BLUE...)" />
          <Input type="number" placeholder="Listras (0-4)" />
        </div>

        {/* Comissão */}
        <Input type="number" placeholder="Comissão por aluno" />

      </FieldGroup>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </div>
  );
}