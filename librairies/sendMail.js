const nodemailer = require('nodemailer');

exports.mailToken = (token) => {


    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'randimbisoabhmke@outlook.fr',
          pass: '270195micheBeh'
        }
      });

      const emailContent = `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Voici votre code de réanitialisation  <b>${token}</b>`

  const mailOptions = {

  from: 'randimbisoabhmke@outlook.fr',
  to: 'misuketiana@gmail.com',
  subject: 'Réinitialisation de mot de passe',
  html: emailContent

}


transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail envoyé : ' + info.response);
    }
  })

}