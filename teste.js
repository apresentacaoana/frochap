const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "alexfernando.contact@gmail.com",
        pass: "murk hocx nztr vgtr"
    }
})

let emailOptions = {
    from: "alexfernando.contact@gmail.com",
    to: "etsudot@gmail.com",
    subject: "Ative sua conta - Postos Kotinski",
    html: `<a href="https://frochap.vercel.app/confirm?email=teste">Clique aqui</a> para ativar a sua conta.`
}

transporter.sendMail(emailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });