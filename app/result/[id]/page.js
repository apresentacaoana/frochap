'use client'

import { StatusScreen, initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago('TEST-96b59b6b-afd0-4226-9dae-1edda2c65253');

const ResultPage = ({params}) => {
    return (
        <StatusScreen initialization={{paymentId: params.id}} />
    )
}

export default ResultPage