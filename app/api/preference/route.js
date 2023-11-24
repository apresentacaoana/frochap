import { processOrder } from "@/app/actions/mp"; 
import { NextResponse } from "next/server";

export async function POST(request) {
    const { id, nome, preco } = await request.json();

    try {
        const preferencia = await processOrder(id, nome, preco);
        return NextResponse.json(preferencia);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Erro ao processar o pedido' });
    }
}