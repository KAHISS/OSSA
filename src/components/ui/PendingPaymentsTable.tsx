type Payment = {
  nome: string;
  emissao: string;
  vencimento: string;
  valor: number;
  tipo: string;
};

const pagamentos: Payment[] = [
  { nome: 'Carlos Gracie', emissao: '01/10/2025', vencimento: '10/10/2025', valor: 150, tipo: 'PLANO' },
  { nome: 'Hélio Gracie', emissao: '01/10/2025', vencimento: '10/10/2025', valor: 150, tipo: 'PLANO' },
  { nome: 'Rickson Gracie', emissao: '15/09/2025', vencimento: '20/09/2025', valor: 100, tipo: 'GRADUAÇÃO' },
  { nome: 'Royce Gracie', emissao: '05/10/2025', vencimento: '15/10/2025', valor: 150, tipo: 'PLANO' },
];

export default function PendingPaymentsTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Pagamentos Pendentes</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nome</th>
            <th>Emissão</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {pagamentos.map((p, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{p.nome}</td>
              <td>{p.emissao}</td>
              <td>{p.vencimento}</td>
              <td>R$ {p.valor.toFixed(2)}</td>
              <td>{p.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
