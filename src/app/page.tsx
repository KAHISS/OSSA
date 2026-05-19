import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fonts } from "@/utils/fonts";
import Image from "next/image";
import "@/styles/globals.css";
import Link from "next/link";

export default function LoginPage() {
  return (
    <html lang="pt-br" className="h-full">
      <body className="h-full bg-[#111111] flex items-center justify-center font-sans antialiased">
        <main className="w-full max-w-[450px] p-6">
          
          {/* Card de Login inspirado no design do Dashboard */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-800">

            <div className="p-8 md:p-10 bg-white">
              <header className="mb-8 flex flex-col items-center text-center">
                <h1 className={`${fonts.bebas.className} text-[5rem]`}>LOG<span className="text-red-600">I</span>N</h1>
              </header>

              <form className="space-y-5">
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
                    placeholder="Digite seu e-mail..." 
                    className="w-full h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 pl-[1rem] text"
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
                    placeholder="Digite sua senha..." 
                    className="w-full h-12 bg-white border-gray-300 focus-visible:ring-zinc-900 text-[20px] px-1"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    asChild 
                    className="w-full p-7 bg-black hover:bg-[#333] text-white h-12 rounded-lg uppercase font-black tracking-widest text-sm shadow-lg transition-transform active:scale-95"
                  >
                    <Link
                      href="/painel/dashboard"
                    >
                      <Image
                        src="/images/logo.png"
                        alt="Ossa! Logo"
                        width={100}
                        height={40}
                        className="dark:invert mr-2 cursor-pointer"
                      />
                    </Link>    
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Rodapé Externo (igual ao seu menu lateral) */}
          <div className="mt-6 text-center">
             <p className="text-gray-500 text-[13px] font-bold uppercase tracking-[0.3em]">
               Respeito • Honra • Disciplina
             </p>
          </div>
        </main>
      </body>
    </html>
  );
}