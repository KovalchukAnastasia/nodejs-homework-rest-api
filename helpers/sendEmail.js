const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const { SENDGRID_KEY } = process.env;

sgMail.setApiKey(SENDGRID_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: "kovalchuk.anastasia0612@gmail.com" };
    await sgMail.send(email);
    return true;
  } catch (error) {
    return error;
  }
};

// const sendEmail = {
//   to: "kovalchuk.anastasia0612@gmail.com",
//   from: "kovalchuk.anastasia0612@gmail.com",
//   subject: "Please Verify Your Sender Identity",
//   html: "Let's verify your sender identity so you can start sending.",
// };

// sgMail
//   .send(sendEmail)
//   .then(() => console.log("Verification successful"))
//   .catch((error) => console.log(error.message));

module.exports = sendEmail;
