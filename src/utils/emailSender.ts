import nodemailer from "nodemailer";
import sendgridTransport from "nodemailer-sendgrid-transport";

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY || "",
    },
  })
);

const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  token: string
) => {
  try {
    await transporter.sendMail({
      to: to,
      from: "shop@node-complete.com",
      subject: subject,
      html: `
          <p>${text}</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default sendEmail;
