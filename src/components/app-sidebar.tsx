import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Bebas_Neue, Montserrat, Yuji_Syuku, Anton} from 'next/font/google'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
})

const yuji = Yuji_Syuku({
  subsets: ['latin'],
  weight: '400',
})

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const modules = [
  {
    name: "Usuarios",
    href: "/painel/usuarios",
  },
  {
    name: "categorias",
    href: "/painel/categorias",
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="w-full flex items-center h-25 justify-center bg-zinc-900">
        <Image
          src="/images/logo.png"
          alt="Ossa! Logo"
          width={150}
          height={24}
          className="dark:invert"
        />
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900">   
        <SidebarGroup title="Dashboard" className="bg-zinc-900">
          <SidebarGroupLabel className={`text-gray-400 text-lg font-mono `}>Módulos</SidebarGroupLabel>
          <SidebarMenu className="mt-2 text-center">
            {modules.map((module) => (
              <SidebarMenuButton className="text-white text-lg font-bold bg-zinc-900 hover:bg-red-500 hover:text-white font-mono h-10 flex items-center justify-between"
                variant={"outline"}
              >
                <a href={`${module.href}`} className={`text-center ${anton.className}`}>{module.name}</a>
                <div className="w-10 h-10 bg-zinc-900 ml-8">
                  <div className="w-2 h-10 bg-white ml-5"></div>
                </div>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup title="Settings" />
      </SidebarContent>
      <SidebarFooter className="w-full h-25 bg-zinc-900" >
        <div className="flex items-center gap-4 justify-center p-3">
          <Avatar>
            <AvatarImage src="/images/avatar.png" alt="User Avatar" />
            <AvatarFallback className="bg-black text-white font-bold border-2 border-white">AD</AvatarFallback>
          </Avatar>
          <span className={`text-white font-bold ${montserrat.className}`}>Administrador</span>
        </div>
        <div className="w-full h-full flex item500s-end justify-center">
          <p className={`text-gray-400 text-sm font-mono ${montserrat.className}`}>Ossa! - {new Date().getFullYear()}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}