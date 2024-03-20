import { processOrder } from "@/app/actions/mp"; 
import { getUserByEmail } from "@/db/service";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { NextResponse } from "next/server";
import { MailtrapClient } from "mailtrap"
import { Resend } from "resend";

export async function POST(request) {
    const { email, nome, sendType } = await request.json();
    const sender = {name: "Postos Kotinski", email: "kotinski@amane.com.br"}
    const resend = new Resend("re_CravZWzR_HFeUJM8WzSkYiZ2yZhmESv3L")
    try {

        if(sendType == "confirm") {
            let responseUser = await getUserByEmail(email)

            resend.emails.send({
                from: sender.email,
                to: responseUser.email,
                subject: "Confirme sua Conta - Postos Kotinski",
                html: `<a href="https://frochap.vercel.app/confirm?email=${responseUser.id}">Clique aqui</a> para ativar a sua conta.`
            })

            return NextResponse.json({message: "Email de confirmação enviado"});

        } else if (sendType == 'change') {
            let responseUser = await getUserByEmail(email)


            // client.send({
            //   from: sender,
            //   to: [{email: responseUser.email}],
            //   subject: "Redefina sua Senha - Postos Kotinski",
            //   html: `<a href="https://frochap.vercel.app/changepassword?email=${responseUser.id}">Clique aqui</a> para redefinir a senha.`
            // })

            
            resend.emails.send({
                from: sender.email,
                to: responseUser.email,
                subject: "Redefina sua Senha - Postos Kotinski",
                html: `<a href="https://frochap.vercel.app/changepassword?email=${responseUser.id}">Clique aqui</a> para redefinir a senha.`
            })

            if(responseUser) {
                return NextResponse.json({message: "Email de confirmação enviado"});
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Erro ao tentar enviar email' });
    }
}