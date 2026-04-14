import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bebas_Neue, Montserrat, Yuji_Syuku, Anton} from 'next/font/google'

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-3 h-14 justify-center p-3 cursor-pointer">
            <Avatar className="bg-b">
                <AvatarImage alt="shadcn" />
                <AvatarFallback className="bg-black text-white border-2 border-white">AD</AvatarFallback>
            </Avatar>
            <span className={`text-white text-2xl font-bold ${bebas.className}`}>Administrador</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">Perfil</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" className="cursor-pointer">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
