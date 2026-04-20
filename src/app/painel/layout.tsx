import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/layout-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col gap-2">
        <SidebarTrigger size={"icon"} className="text-2xl hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer fixed"/>
        {children}
      </main>
    </SidebarProvider>
    
  )
}