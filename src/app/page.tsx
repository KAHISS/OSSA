"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fonts } from "@/utils/fonts";
import Image from "next/image";
import "@/styles/globals.css";
// Importe o seu authClient. Ajuste o caminho conforme o seu projeto.
import { authClient } from "@/lib/auth-client"; 

export default function LoginPage() {
  const router = useRouter();
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para lidar com o login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita o recarregamento da página
    setLoading(true);
    setError("");

    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        // Redireciona para o dashboard com sucesso
        router.push("/painel/dashboard");
      },
      onError: (ctx) => {
        // Exibe o erro caso as credenciais estejam incorretas
        setError(ctx.error.message);
        setLoading(false);
      }
    });
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#111111] flex items-center justify-center font-sans antialiased">
          <main className="w-full max-w-[450px] p-6">
            
            {/* Card de Login inspirado no design do Dashboard */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-800">

              <div className="p-8 md:p-10 bg-white">
                <header className="mb-8 flex flex-col items-center text-center">
                  <h1 className={`${fonts.bebas.className} text-[5rem]`}>LOG<span className="text-red-600">I</span>N</h1>
                </header>

                {/* Adicionando o onSubmit no form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label 
                      htmlFor="email" 
                      className={`text-[1rem] uppercase font-black text-gray-600 ml-1 ${fonts.anton.className}`}
                    >
                      E-mail de Usuário
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail..." 
                      className="w-full h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 pl-[1rem]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label 
                      htmlFor="password" 
                      className={`text-[1rem] uppercase font-black text-gray-600 ml-1 ${fonts.anton.className}`}
                    >
                      Senha
                    </Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha..." 
                      className="w-full h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[20px] px-1"
                      required
                    />
                  </div>

                  {/* Exibição de erro */}
                  {error && (
                    <p className="text-red-600 text-sm font-bold text-center">
                      {error}
                    </p>
                  )}

                  <div className="pt-2">
                    {/* Removido o <Link> e transformado em botão de submit real */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full p-7 bg-black hover:bg-[#333] text-white h-12 rounded-lg uppercase font-black tracking-widest text-sm shadow-lg transition-transform active:scale-95 flex justify-center items-center"
                    >
                      {loading ? (
                        <span>Entrando...</span>
                      ) : (
                        <Image
                          src="/images/logo.png"
                          alt="Ossa! Logo"
                          width={100}
                          height={40}
                          className="dark:invert cursor-pointer"
                        />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Rodapé Externo */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-[13px] font-bold uppercase tracking-[0.3em]">
                Respeito • Honra • Disciplina
              </p>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}