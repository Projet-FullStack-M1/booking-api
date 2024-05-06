// Importation de Nodemailer
const nodemailer = require("nodemailer");

// Définition de la fonction sendEmail avec les paramètres mail, subject, text et html
const sendEmail = async (mail, subject, text, html) => {
  // Création d'un transporteur SMTP avec les paramètres de configuration
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Hôte SMTP
    port: process.env.SMTP_PORT, // Port SMTP
    secure: false, // Utilisation de TLS (true pour utiliser SSL)
    auth: {
      user: process.env.SMTP_USER, // Nom d'utilisateur SMTP
      pass: process.env.SMTP_PASSWORD, // Mot de passe SMTP
    },
  });

  // Vérification de la connexion SMTP
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error); // Affichage de l'erreur en cas d'échec de la vérification
    } else {
      console.log("SMTP Server is ready"); // Message de confirmation si la vérification réussit
    }
  });

  // Envoi de l'e-mail en utilisant les paramètres spécifiés
  let info = await transporter.sendMail({
    from: process.env.ADMIN_EMAIL, // Adresse e-mail de l'expéditeur
    to: mail, // Adresse e-mail du destinataire
    subject: subject, // Sujet de l'e-mail
    text: text, // Corps de l'e-mail en texte brut
    html: html, // Corps de l'e-mail en HTML
  });

  // Retourne les informations sur l'envoi de l'e-mail
  return info;
};

// Export de la fonction sendEmail pour qu'elle puisse être utilisée ailleurs dans l'application
module.exports = sendEmail;
