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
    <div className="space-y-20">
      {/* Cadatrar Usuário */}
      <form className="space-y-6 border p-10 rounded-md shadow bg-gray-50">
        <h2 className="text-3xl font-bold text-indigo-700">Cadastrar Usuário</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tipo de Usuário */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Tipo de Usuário</label>
            <Select name="userType">
             <SelectTrigger className="w-full h-10 bg-white border-indigo-400 focus:ring-indigo-500 text-[16px]">
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
            <label className="text-lg font-semibold text-gray-700">Nome Completo</label>
            <Input name="name" placeholder="Digite o nome..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">E-mail</label>
            <Input name="email" placeholder="Digite o e-mail..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>

          {/* Telefone Pessoal */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Telefone Pessoal</label>
            <Input name="personalPhone" placeholder="Digite o telefone..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>

          {/* Telefone de Emergência */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Telefone de Emergência</label>
            <Input name="emergencyPhone" placeholder="Digite o telefone..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>

          {/* Faixa */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Faixa</label>
            <Select name="belt">
             <SelectTrigger className="w-full h-16 bg-white border-indigo-400 focus:ring-indigo-500 text-[16px]">
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
            <label className="text-lg font-semibold text-gray-700">Peso</label>
            <Input name="weight" placeholder="Digite o peso..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>

          {/* Comissão */}
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700">Comissão</label>
            <Input name="commission" placeholder="Digite a comissão..." className="h-10 border-indigo-400 focus:ring-indigo-500  text-[16px]" />
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
         <Button variant="secondary" asChild className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-6 font-semibold text-lg">
            <Link href="/painel/usuarios">Limpar</Link>
          </Button>
         <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold text-lg">
            Cadastrar usuário
          </Button>
        </div>
      </form>

    
    
    </div>
  );
}
