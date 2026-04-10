export default function Sidebar() {
  return (
    <aside className="bg-zinc-900 text-white w-64 h-screen p-4">
      <h1 className="text-xl font-bold mb-6">Syspa</h1>
      <nav className="space-y-4">
        {['Usuários', 'Turmas', 'Cerimônias', 'Pagamentos', 'Categorias', 'Matrículas', 'Planos', 'Fichas Médicas'].map((item) => (
          <div key={item} className="hover:text-gray-300 cursor-pointer">{item}</div>
        ))}
      </nav>
    </aside>
  );
}
