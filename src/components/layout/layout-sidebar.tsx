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
import { AvatarDropdown } from "./layout-dropdown"

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
    id: "users",
    name: "Usuarios",
    href: "/painel/usuarios",
  },
  {
    id: "categories",
    name: "Categorias",
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
          loading="eager"
          style={{ width: 'auto', height: 'auto' }}
        />
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900">   
        <SidebarGroup title="Dashboard" className="bg-zinc-900">
          <SidebarGroupLabel className={`text-gray-400 text-2xl ${anton.className} `}>Módulos</SidebarGroupLabel>
          <SidebarMenu className="mt-2 text-center">
            {modules.map((module) => (
              <SidebarMenuButton 
                key={module.id}
                className="text-white text-lg font-bold bg-zinc-900 hover:bg-red-500 transition-colors duration-300 hover:text-white font-mono h-10 flex items-center justify-between cursor-pointer"
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
      <SidebarFooter className="flex flex-col justify-center w-full h-25 bg-zinc-900" >
        <AvatarDropdown/>
        <div className="flex justify-center">
          <span className="text-gray-500">Ossa! {new Date().getFullYear()}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}