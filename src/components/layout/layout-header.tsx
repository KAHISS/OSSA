import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarDropdown } from "./layout-dropdown"

export default function Header() {
    return (
        <header className="flex justify-between items-center  w-full h-16 bg-white border-b-2 shadow-lg">
            
            <AvatarDropdown/>
        </header>
    )
}