import { processOrder } from "@/app/actions/mp"; 
import { getUserByEmail } from "@/db/service";
import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'

export async function POST(request) {
    const { email, nome, sendType } = await request.json();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "alexfernandorochadealmeida@gmail.com",
            pass: "Herbert!23"
        }
    })
    try {

        if(sendType == "confirm") {
            let responseUser = await getUserByEmail(email)
            let emailOptions = {
                from: "alexfernandorochadealmeida@gmail.com",
                to: responseUser.email,
                subject: "Ative sua conta - Postos Kotinski",
                text: `<a href="https://frochap.vercel.app/confirm?email=${responseUser.id}">Clique aqui</a> para ativar a sua conta.`
            }

            transporter.sendMail(emailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            return NextResponse.json({message: "Email de confirmação enviado"});

        } else if (sendType == 'change') {
            let responseUser = await getUserByEmail(email)
            let emailOptions = {
                from: "alexfernandorochadealmeida@gmail.com",
                to: responseUser.email,
                subject: "Redefinir Senha - Postos Kotinski",
                text: `<a href="https://frochap.vercel.app/changepassword?email=${responseUser.id}">Clique aqui</a> para redefinir a senha.`
            }

            transporter.sendMail(emailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            if(responseUser) {
                return NextResponse.json({message: "Email de confirmação enviado"});
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Erro ao tentar enviar email' });
    }
}