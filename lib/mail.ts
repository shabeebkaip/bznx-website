import nodemailer from "nodemailer";

export async function sendEnquiryEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const { name, email, phone, service, message } = data;

  // Create transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure the email
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL, 
    subject: `New Enquiry: ${service}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #091d37; text-transform: uppercase; border-bottom: 2px solid #26D0CE; padding-bottom: 10px;">New Enquiry Notification</h2>
        <p style="font-size: 14px; color: #666;">You have received a new message from the BZNX contact form.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; font-weight: bold;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; font-weight: bold;">Phone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; font-weight: bold;">Service:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9;">${service}</td>
          </tr>
        </table>

        <div style="margin-top: 30px; background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #26D0CE;">
          <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Client Message:</p>
          <p style="margin: 0; color: #333; line-height: 1.6; font-style: italic;">"${message}"</p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">BZNX Administration System</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${process.env.EMAIL}`);
    return true;
  } catch (error) {
    console.error("Nodemailer error:", error);
    return false;
  }
}
