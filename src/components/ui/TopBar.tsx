export default function TopBar() {
  return (
    <div className="w-full bg-zinc-800 p-4 shadow-sm flex items-center">
      <input
        type="text"
        placeholder="Pesquisar..."
        className="bg-white border px-4 py-2 rounded w-full max-w-md"
      />
    </div>
  );
}
