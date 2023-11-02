import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  const emailInfo = await transporter.sendMail(options);

  return emailInfo.accepted.length < 1 ? false : true;
};

export default sendEmail;
