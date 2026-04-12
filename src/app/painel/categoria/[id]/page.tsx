"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CategoriaPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [categoria, setCategoria] = useState({
    nome: "",
    descricao: "",
    faixa_etaria: "",
    faixa_peso: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Buscar categoria
 useEffect(() => {
  async function fetchCategoria() {
    try {
      const res = await fetch(`/api/categorias/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Mapeia os campos do back para os nomes usados no front
      setCategoria({
        nome: data.name || "",
        descricao: data.description || "",
        faixa_etaria: data.age_group || "",
        faixa_peso: data.weight_range || "",
      });
    } catch (err) {
      setError("Erro ao carregar categoria");
    } finally {
      setLoading(false);
    }
  }

  if (id) fetchCategoria();
}, [id]);


  // Atualizar categoria
async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  try {
    const res = await fetch(`/api/categorias/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // Converte os nomes do front para os nomes esperados pelo back
      body: JSON.stringify({
        name: categoria.nome,
        description: categoria.descricao,
        age_group: categoria.faixa_etaria,
        weight_range: categoria.faixa_peso,
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    alert("Categoria atualizada com sucesso!");
  } catch (err) {
    alert("Erro ao atualizar categoria");
  }
}


 return (
  <div className="min-h-screen bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100">
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Editar Categoria
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Nome"
          value={categoria.nome}
          onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
          className="w-full border p-2 rounded bg-blue-50 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

        <input
          type="text"
          placeholder="Descrição"
          value={categoria.descricao || ""}
          onChange={(e) =>
            setCategoria({ ...categoria, descricao: e.target.value })
          }
          className="w-full border p-2 rounded bg-green-50 focus:border-green-500 focus:ring focus:ring-green-200"
        />

        <input
          type="text"
          placeholder="Faixa etária"
          value={categoria.faixa_etaria}
          onChange={(e) =>
            setCategoria({ ...categoria, faixa_etaria: e.target.value })
          }
          className="w-full border p-2 rounded bg-yellow-50 focus:border-yellow-500 focus:ring focus:ring-yellow-200"
        />

        <input
          type="text"
          placeholder="Faixa de peso"
          value={categoria.faixa_peso}
          onChange={(e) =>
            setCategoria({ ...categoria, faixa_peso: e.target.value })
          }
          className="w-full border p-2 rounded bg-pink-50 focus:border-pink-500 focus:ring focus:ring-pink-200"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md"
        >
          Atualizar
        </button>
      </form>
    </div>
  </div>
);
}