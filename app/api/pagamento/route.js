import { createPayment } from "@/app/actions/mp";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { formData } = await request.json();

    try {
        const pagamento = await createPayment(formData);
        return NextResponse.json(pagamento);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao processar o pedido' });
    }
}