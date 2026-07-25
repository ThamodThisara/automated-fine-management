import Fine from "../model/fine.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error(
      "Email configuration missing. Please add EMAIL_USER and EMAIL_PASS to .env"
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const checkFinesAndSendEmails = async () => {
  const now = new Date();

  // Adjust to local timezone
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  // Yesterday
  const yesterday = new Date(offsetDate);
  yesterday.setDate(yesterday.getDate() - 1);

  // Yesterday 00:00:00
  const startDate = new Date(yesterday);
  startDate.setHours(0, 0, 0, 0);

  // Today 00:00:00
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  try {
    console.log(
        `Checking unpaid blocked fines between ${startDate.toISOString()} and ${endDate.toISOString()}`
    );

    const fines = await Fine.find({
      expireDate: {
        $gte: startDate,
        $lt: endDate,
      },
      state: false,
      block: true,
    });

    if (fines.length === 0) {
      console.log("No unpaid blocked fines found.");
      return;
    }

    for (const fine of fines) {
      const emailBody = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
          }
          .header {
            background: #d32f2f;
            color: white;
            text-align: center;
            padding: 10px;
            font-size: 20px;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
          }
          .details {
            background: #ffebee;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            color: #777;
            margin-top: 20px;
            font-size: 14px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <div class="header">
            🚨 Fine Payment Reminder <br />
            Driver ID: ${fine.dId}
          </div>

          <div class="content">
            <p>Dear <strong>${fine.dName}</strong>,</p>

            <p>
              Your fine payment due date has expired.
              You are now required to make the payment at your police station.
            </p>

            <div class="details">
              <p><strong>Issue Date:</strong> ${
          fine.issueDate.toISOString().split("T")[0]
      }</p>

              <p><strong>Violation:</strong> ${fine.violation}</p>

              <p><strong>Charge:</strong> ${fine.charge}</p>

              <p><strong>Time:</strong> ${fine.time}</p>

              <p><strong>Place:</strong> ${fine.place}</p>

              <p><strong>Expiry Date:</strong> ${
          fine.expireDate.toISOString().split("T")[0]
      }</p>

              <p><strong>Vehicle No:</strong> ${fine.vNo}</p>
            </div>

            <p style="background:yellow;padding:8px;font-weight:bold;">
              Legal action will now be taken for the delay in paying the fine.
            </p>
          </div>

          <div class="footer">
            🚔 Traffic Fine Management System
          </div>
        </div>
      </body>
      </html>
      `;

      try {
        await sendEmail(
            fine.email,
            "Reminder: Unpaid Fine Payment",
            emailBody
        );

        if (process.env.ADMIN_NOTIFICATION_EMAIL) {
          await sendEmail(
              process.env.ADMIN_NOTIFICATION_EMAIL,
              "Reminder: Unpaid Traffic Fine",
              emailBody
          );
        }
      } catch (error) {
        console.error(`Failed to send reminder email for fine ${fine._id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching fines:", error);
  }
};

export const updateBlockedFines = async () => {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const today = offsetDate.toISOString().split("T")[0];

  const yesterdayDate = new Date(offsetDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  try {
    console.log(
      `Updating block state for fines expiring today: ${yesterdayStr}`
    );

    const result = await Fine.updateMany(
      { expireDate: yesterdayStr, block: false },
      { $set: { block: true } }
    );

    console.log(`${result.modifiedCount} fines updated to blocked.`);
  } catch (error) {
    console.error("Error updating fines:", error);
  }
};

export const checkFinesAndSendReminder = async () => {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const today = offsetDate.toISOString().split("T")[0];

  try {
    //console.log(`Checking fines issued before today: ${reminderStr}`);

    const fines = await Fine.find({
      state: false, // Only unpaid fines
    });

    for (const fine of fines) {
      const issueDateNew = new Date(fine.issueDate);
      //const dueDate = new Date(issueDate);
      //dueDate.setDate(issueDate.getDate() + 10);
      issueDateNew.setDate(issueDateNew.getDate() + 10);
      const formattedIssueDate = issueDateNew.toISOString().split("T")[0];
      console.log(formattedIssueDate);

      if (formattedIssueDate === today) {
        const emailBody = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: #d32f2f;
        color: #ffffff;
        text-align: center;
        padding: 10px;
        font-size: 20px;
        border-radius: 8px 8px 0 0;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .content p {
        font-size: 16px;
      }
      .details {
        background: #ffebee;
        padding: 15px;
        border-radius: 5px;
        margin: 10px 0;
      }
      .details p {
        margin: 5px 0;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #777777;
        margin-top: 20px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        color: #ffffff;
        background: #d32f2f;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .button:hover {
        background: #b71c1c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2 style="color: white;">🚨 Fine Payment Reminder. <br /> Driver Id-: ${
          fine.dId
        } 🚨</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${fine.dName}</strong>,</p>
        <p><strong>You have not paid the fine. Your fine will expire after four days. 
        Please make sure to pay your fine before it expires.
          
        </strong></p>
        
        <div class="details">
          <p><strong>Violation:</strong> ${fine.violation}</p>
          <p><strong>Charge:</strong> ${fine.charge}</p>
          <p><strong>Issue Date:</strong> ${
            fine.issueDate.toISOString().split("T")[0]
          }</p>
          <p><strong>Time:</strong> ${fine.time}</p>
          <p><strong>Location:</strong> ${fine.place}</p>
          
          <p><strong>Expiry Date:</strong> ${
            fine.expireDate.toISOString().split("T")[0]
          }</p>
          <p><strong>Vehicle No:</strong> ${fine.vNo}</p>
          <p><strong>Police Officer Id:</strong> ${fine.pId}</p>
          <p><strong>Police Officer name:</strong> ${fine.pName}</p>
          <p><strong>Police Officer Station:</strong> ${fine.pStation}</p><br>
          <p><strong>Your Payment Id:</strong> <span style="color: blue; font-weight: bold;">${
            fine._id
          }</span></p>

        </div>
        
        <p>Please pay your fine before the due date to avoid further penalties.</p>
        
        <p style="text-align: center;">
          <a href="http://localhost:5173/payment" class="button">Pay Fine Now</a>
        </p>
      </div>
      <div class="footer">
        🚔 Traffic Fine Management System | Contact Us: sadmin@gmail.com.com
      </div>
    </div>
  </body>
  </html>
`;

        try {
          await sendEmail(fine.email, "Reminder: Unpaid Fine Payment", emailBody);
          //  await sendEmail(fine.dName, "Reminder: Unpaid Traffic Fine", emailBody);
        } catch (error) {
          // Don't let one bad recipient stop the rest of the batch.
          console.error(`Failed to send reminder email for fine ${fine._id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching fines:", error);
  }
};
