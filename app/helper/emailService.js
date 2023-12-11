const nodemailer = require("nodemailer");
const fs = require("fs").promises;

async function sendEmail(Email, ccMail, html, buffer, filename, subject) {
  try {
    // Create a transporter object with your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      service: "gmail", // e.g., 'gmail'
      auth: {
        user: "exbraineducation1130@gmail.com",
        pass: "skgaivcpmjiebsgk"
      }
    });
    // Read the HTML template file
    // const html = await fs.readFile(
    //   "./app/util/mail/attendance_report.html",
    //   "utf8"
    // );
    // const emailBody = html
    //   .replace(/{{passworddata}}/g, Password)
    //   .replace(/{{emaildata}}/g, Email)
    //   .replace(/{{siteLink}}/g, process.env.DOMAIN_NAME)
    //   .replace(/{{siteName}}/g, process.env.WEBSITE_NAME);
    // Define the email options
    const mailOptions = {
      from: "exbraineducation1130@gmail.com",
      to: Email,
      cc: ccMail,
      subject: subject,
      html: html,
      attachments: buffer == "" ? "" : [{ filename: filename, content: buffer }]
    };
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    return { data: info };
  } catch (error) {
    return { error: "error" };
  }
}

module.exports = { sendEmail };
