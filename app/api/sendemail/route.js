import { processOrder } from "@/app/actions/mp"; 
import { getUserByEmail } from "@/db/service";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { NextResponse } from "next/server";

export async function POST(request) {
    const mailerSend = new MailerSend({
                apiKey: "mlsn.ac6a6c43182d172c06dd6d1cfb6f81bdad0eeda20b8ab67508d60643d09c3c9c"
            })
    const { email, nome, sendType } = await request.json();

    try {

        if(sendType == "confirm") {
            const sentFrom = new Sender("kotinski@amane.com.br", "Postos Kotinski")
            const recipients = [
                new Recipient(email, nome)
            ]

            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setReplyTo(sentFrom)
                .setSubject("Confirme a sua conta - Postos Kotinski")
                .setHtml(`<p>Para que possa confirmar sua conta </p><a href="https://frochap.vercel.app/confirm?email=${id}"></a>`)
                .setText("Assim que concluir a confirmação terá acesso a conta");

            await mailerSend.email.send(emailParams);
            return NextResponse.json({message: "Email de confirmação enviado"});

        } else if (sendType == 'change') {
            let responseUser = await getUserByEmail(email.toLowerCase())

            if(responseUser) {
                const sentFrom = new Sender("kotinski@amane.com.br", "Postos Kotinski")
                const recipients = [
                    new Recipient(email, nome)
                ]
        
                const emailParams = new EmailParams()
                    .setFrom(sentFrom)
                    .setTo(recipients)
                    .setReplyTo(sentFrom)
                    .setSubject("Redefinir senha - Postos Kotinski")
                    .setHtml(`<p>Para que possa trocar a senha da sua conta </p><a href="https://frochap.vercel.app/confirm?email=${id}"></a>`)
                    .setText("Teste");
        
                await mailerSend.email.send(emailParams);
                return NextResponse.json({message: "Email de confirmação enviado"});
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Erro ao tentar enviar email' });
    }
}