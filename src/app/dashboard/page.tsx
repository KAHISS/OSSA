import Sidebar from "@/components/ui/Sidebar";
import TopBar from "@/components/ui/TopBar";
import Header from "@/components/ui/Header";
import SummaryCards from "@/components/ui/SummaryCards";
import PendingPaymentsTable from "@/components/ui/PendingPaymentsTable";

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <TopBar />

        <div className="p-6">
          <Header />
          <SummaryCards totalPendente={1250} totalRecebido={4500} alunosAtrasados={8} alunosAtivos={120}/>
          <PendingPaymentsTable />
        </div>
      </main>
    </div>
  );
}
