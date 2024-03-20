const { default: MercadoPagoConfig, Preference, Payment } = require("mercadopago");

async function processOrder(id, nome, preco) {
    const client = new MercadoPagoConfig({
        accessToken: "TEST-8035770711685577-112317-b173328a68e230dfe2d31dc08aa6212f-1250850973",
        options: { timeout: 5000 }
    });

    const preference = new Preference(client);

    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id,
                        title: nome,
                        quantity: 1,
                        unit_price: preco,
                        currency_id: 'BRL'
                    }
                ],
                back_urls: {success: 'https://www.google.com.br/'},
                redirect_urls: {success: 'https://www.google.com.br/'}
            }
        });

        return result;
    } catch (error) {
        console.error("Erro ao criar a preferência:", error);
        throw error;
    }
}


async function createPayment(data) {
    const client = new MercadoPagoConfig({
        accessToken: "TEST-8035770711685577-112317-b173328a68e230dfe2d31dc08aa6212f-1250850973",
        options: { timeout: 5000 }
    });

    const payment = new Payment(client);

    try {
        const result = await payment.create({
            body: data 
        });

        return result;
    } catch (error) {
        console.error("Erro ao criar o pagamento:", error);
        throw error;
    }
}

module.exports = { processOrder, createPayment };
