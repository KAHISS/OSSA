import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Listar planos
export async function GET() {
    try {
        const plano = await prisma.plan.findMany();
        return NextResponse.json(plano);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao buscar planos' },
            { status: 500 }
        );
    }
}

// Criar plano
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Aceita tanto 'name' quanto 'title' para evitar quebras de compatibilidade no client
        const title = data.name || data.title; 
        const price = data.price;
        const period = data.period;
        const description = data.description;

        if (!title || !price || !period) {
            return NextResponse.json(
                { error: 'Campos obrigatórios faltando (title, price ou period)' },
                { status: 400 }
            );
        }
        
        const plano = await prisma.plan.create({
            data: {
                title: title,
                // Salva o período exatamente como veio do Select (ex: "Mensal", "Trimestral") 
                // e remove espaços em branco extras se houverem
                period: String(period).trim(),
                // Garante que o preço vá como número/Float adequado para o Prisma Decimal
                price: Number(price),
                description: description || "",
            },
        });

        return NextResponse.json(plano, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao criar plano: ' + (error as Error).message },
            { status: 500 }
        );
    }
}