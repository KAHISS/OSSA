export default function Header() {
  return (
    <header className="bg-white p-6 shadow flex justify-between items-center">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="border px-3 py-2 rounded w-1/3"
      />
      <div className="text-right">
        <h2 className="text-xl font-semibold">
          Bem-vindo de volta, <span className="text-red-600">Admin!</span>
        </h2>
        <p className="text-sm text-gray-600">
          Aqui está o resumo das atividades da sua academia.
        </p>
      </div>
    </header>
  );
}
