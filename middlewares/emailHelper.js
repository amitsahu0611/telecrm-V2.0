/** @format */

// emailHelper.js

const nodemailer = require("nodemailer");
const path = require("path");
const SmtpConf = require("../models/smtpConf.model");

const EmailHelper = async (from, to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.11squaresolutions.com",
      port: 465,
      secure: true,
      auth: {
        user: "loms-law@11squaresolutions.com",
        pass: "lomslaw2024",
      },
    });

    const mailOptions = {
      from: `"LOMS Admin" <${from}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const generateTemplate = (url, resetToken) => {
  return `
    <html>
    <body>
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <p><a href="${url}/reset-password/${resetToken}">${url}/reset-password/${resetToken}</a></p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </body>
    </html>
  `;
};

// async function sendEmailWithAttachment(
//   companyId,
//   to,
//   subject,
//   text,
//   attachmentPath
// ) {
//   const smtpData = await SmtpConf.findOne({
//     where: {
//       company_id: companyId,
//     },
//   });
//   try {
//     const transporter = nodemailer.createTransport({
//       host: smtpData.host_name || "mail.11squaresolutions.com",
//       port: 465 || smtpData.port,
//       secure: true,
//       auth: {
//         user: smtpData.auth_user || "invoice@11squaresolutions.com",
//         pass: smtpData.auth_pass || "invoice@@24",
//       },
//     });

//     const mailOptions = {
//       from: `"Invoice Admin" <invoice@11squaresolutions.com>`,
//       to: to,
//       subject: subject,
//       text: text,
//       attachments: [
//         {
//           filename: path.basename(attachmentPath),
//           path: attachmentPath,
//         },
//       ],
//     };

//     console.log("mailOptions", mailOptions);

//     const info = await transporter.sendMail(mailOptions);

//     console.log("sended");
//     console.log("Email sent: " + info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }

async function sendEmailWithAttachment(
  companyId,
  to,
  subject,
  text,
  attachmentPath
) {
  try {
    console.log("companyId",companyId)

    let smtpData;

    if (companyId !== 0) {
       smtpData = await SmtpConf.findOne({
      where: {company_id: companyId, is_active: true, is_deleted: false},
    });
    }
    
    console.log("smtpData",smtpData)

    // Set default values if no SMTP config is found
    const smtpConfig = {
      host_name: companyId != 0 ? "smtp.gmail.com" : "mail.11squaresolutions.com" ,
      port: 465,
      auth_user: companyId != 0 ? smtpData?.auth_user : "invoice@11squaresolutions.com",
      auth_pass: companyId != 0 ? smtpData?.auth_pass : "invoice@@24",
    };

    console.log("smtpConfig",smtpConfig)

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host_name,
      port: smtpConfig.port,
      secure: true, // true for 465, false for others
      auth: {
        user: smtpConfig.auth_user,
        pass: smtpConfig.auth_pass,
      },
    });

    const mailOptions = {
      from: `"Invoice Admin" <${smtpConfig.auth_user}>`,
      // from:smtpConfig.auth_user,
      to: to,
      subject: subject,
      text: text,
      attachments: [
        {
          filename: path.basename(attachmentPath),
          path: attachmentPath,
        },
      ],
    };

    console.log("Sending email with options:", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {EmailHelper, generateTemplate, sendEmailWithAttachment};
