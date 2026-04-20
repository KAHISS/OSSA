"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsuarioList() {
  return (
    <div className="space-y-8">
      {/* Filtros de Busca */}
      <form className="space-y-6 border p-6 rounded-md shadow bg-gray-50">
        <h2 className="text-lg font-bold text-indigo-700">Cadastrar Usuário</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tipo de Usuário */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tipo de Usuário</label>
            <Select name="userType">
              <SelectTrigger className="h-10 border-indigo-400 focus:ring-indigo-500">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aluno">Alunos</SelectItem>
                  <SelectItem value="instrutor">Instrutores</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
            <Input name="name" placeholder="Digite o nome..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">E-mail</label>
            <Input name="email" placeholder="Digite o e-mail..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>

          {/* Telefone Pessoal */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Telefone Pessoal</label>
            <Input name="personalPhone" placeholder="Digite o telefone..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>

          {/* Telefone de Emergência */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Telefone de Emergência</label>
            <Input name="emergencyPhone" placeholder="Digite o telefone..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>

          {/* Faixa */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Faixa</label>
            <Select name="belt">
              <SelectTrigger className="h-10 border-indigo-400 focus:ring-indigo-500">
                <SelectValue placeholder="Selecione a faixa" />
              </SelectTrigger>
              <SelectContent>
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
            <label className="text-sm font-semibold text-gray-700">Peso</label>
            <Input name="weight" placeholder="Digite o peso..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>

          {/* Comissão */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Comissão</label>
            <Input name="commission" placeholder="Digite a comissão..." className="h-10 border-indigo-400 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" asChild className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            <Link href="/painel/usuarios">Limpar</Link>
          </Button>
          <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
            Cadastrar usuários
          </Button>
        </div>
      </form>

      {/* Tabela de Usuários */}
      <div className="border rounded-md shadow bg-white p-6">
        <h2 className="text-lg font-bold text-indigo-700 mb-4">Usuários</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-100 text-left text-sm font-semibold text-indigo-900">
              <th className="p-2">Nome</th>
              <th className="p-2">Email</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Peso</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Status</th>
              <th className="p-2">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50">
              <td className="p-2">João</td>
              <td className="p-2">joao.silva@exemplo.com</td>
              <td className="p-2">-</td>
              <td className="p-2">11999999999</td>
              <td className="p-2">Aluno</td>
              <td className="p-2 text-green-600 font-semibold">Branca</td>
              <td className="p-2 flex gap-2">
                <Button variant="outline" size="sm" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">Editar</Button>
                <Button variant="destructive" size="sm" className="bg-red-600 text-white hover:bg-red-700">Excluir</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
