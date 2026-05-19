import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header do Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[250px] bg-zinc-200" /> {/* Título */}
          <Skeleton className="h-4 w-[150px] bg-zinc-200" />  {/* Subtítulo */}
        </div>
        <Skeleton className="h-11 w-[180px] bg-zinc-900/20" /> {/* Botão Nova Categoria */}
      </div>

      {/* Grid de Cards ou Linhas de Tabela */}
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-4">
              {/* Ícone ou Avatar da Categoria */}
              <Skeleton className="h-12 w-12 rounded-full bg-zinc-100" />
              
              <div className="space-y-2">
                {/* Nome da Categoria */}
                <Skeleton className="h-5 w-[200px] bg-zinc-200" />
                {/* Detalhes (Peso/Idade) */}
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-[80px] bg-zinc-100" />
                  <Skeleton className="h-4 w-[80px] bg-zinc-100" />
                </div>
              </div>
            </div>

            {/* Ações (Botões de Editar/Excluir) */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-md bg-zinc-100" />
              <Skeleton className="h-9 w-9 rounded-md bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}