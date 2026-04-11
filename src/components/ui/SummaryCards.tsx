type SummaryProps = {
  totalPendente: number;
  totalRecebido: number;
  alunosAtrasados: number;
  alunosAtivos: number;
};

export default function SummaryCards({ totalPendente, totalRecebido, alunosAtrasados, alunosAtivos }: SummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-4 my-6">

      <div className="bg-red-100 p-4 rounded shadow">
        <h3 className="text-sm font-medium">TOTAL PENDENTE</h3>
        <p className="text-2xl font-bold text-red-600">R$ {totalPendente.toFixed(2)}</p>
      </div>

      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="text-sm font-medium">TOTAL RECEBIDO (MÊS)</h3>
        <p className="text-2xl font-bold text-green-600">R$ {totalRecebido.toFixed(2)}</p>
      </div>

      <div className="bg-red-100 p-4 rounded shadow">
        <h3 className="text-sm font-medium">ALUNOS ATRASADOS</h3>
        <p className="text-2xl font-bold text-red-600"> {alunosAtrasados}</p>
      </div>

      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="text-sm font-medium">ALINOS ATIVOS</h3>
        <p className="text-2xl font-bold text-green-600"> {alunosAtivos}</p>
      </div>

    </div>
  );
}
