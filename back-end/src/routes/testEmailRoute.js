import { sendEmail } from "../util/sendEmail";

export const testEmailRoute = {
  path: "/api/test-email",
  method: "post",
  handler: async (req, res) => {
    try {
      await sendEmail({
        to: process.env.MAIL_TO,
        from: process.env.MAIL_FROM,
        subject: "Does this work?",
        text: "If you're reading this, then yes, it works!"
      });
      res.sendStatus(200);
    }
    catch(error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}