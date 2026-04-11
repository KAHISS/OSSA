export default function Header() {
  return (
    <header className="bg-zinc-900 p-6 shadow flex justify-between items-center">      
      <div className="text-right">
        <h2 className="text-xl text-white font-semibold">
          Bem-vindo de volta, <span className="text-red-600">Admin!</span>
        </h2>
        <p className="text-sm text-white">
          Aqui está o resumo das atividades da sua academia.
        </p>
      </div>
    </header>
  );
}
