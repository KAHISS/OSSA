import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import SummaryCards from '@/components/ui/SummaryCards';
import PendingPaymentsTable from '@/components/ui/PendingPaymentsTable';

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <Header />
        <SummaryCards totalPendente={1250} totalRecebido={4500} />
        <PendingPaymentsTable />
      </main>
    </div>
  );
}
