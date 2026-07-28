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
      blockNoticeSent:false,
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
            Driver NIC: ${fine.dNic}
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

        await Fine.findByIdAndUpdate(
            fine._id,
            {
              $set:{
                blockNoticeSent:true
              }
            }
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

  const yesterday = new Date(offsetDate);
  yesterday.setDate(yesterday.getDate() - 1);

  const startDate = new Date(yesterday);
  startDate.setHours(0,0,0,0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);


  try {
    console.log(`Updating block state for fines between ${startDate.toISOString()} and ${endDate.toISOString()}`);

    const result = await Fine.updateMany(
        {
          expireDate:{
            $gte:startDate,
            $lt:endDate
          },
          block:false
        },
        {
          $set:{
            block:true
          }
        }
    );
    console.log(`${result.modifiedCount} fines updated to blocked.`);
  } catch(error) {
    console.error("Error updating fines:", error);
  }
};

export const checkFinesAndSendReminder = async () => {
  const now = new Date();

  // Today 00:00:00
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);

  // Tomorrow 00:00:00
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);

  try {
    // Only unpaid fines which reminder was not sent
    const fines = await Fine.find({
      state: false,
      reminderSent: false,
    });

    if (fines.length === 0) {
      console.log("No fines need reminder.");
      return;
    }


    for (const fine of fines) {

      const reminderDate = new Date(fine.issueDate);

      // Reminder after 10 days from issue date
      reminderDate.setDate(reminderDate.getDate() + 10);


      // Check reminder date is today
      if (
          reminderDate >= startToday &&
          reminderDate < endToday
      ) {

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
      margin: auto;
      border-radius: 8px;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    }

    .header {
      background: #d32f2f;
      color: white;
      text-align: center;
      padding: 15px;
      font-size: 20px;
      border-radius: 8px 8px 0 0;
    }

    .content {
      padding: 20px;
      color: #333;
    }

    .details {
      background: #ffebee;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
    }

    .details p {
      margin: 8px 0;
    }

    .button {
      display: inline-block;
      padding: 10px 20px;
      background: #d32f2f;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
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
    🚨 Fine Payment Reminder 🚨
    <br>
    Driver NIC: ${fine.dNic}
  </div>


  <div class="content">

    <p>
      Dear <strong>${fine.dName}</strong>,
    </p>


    <p>
      You have not paid your traffic fine yet.
      Your fine payment due date is approaching.
      Please complete your payment before the expiry date
      to avoid further penalties.
    </p>


    <div class="details">

      <p>
        <strong>Violation:</strong> ${fine.violation}
      </p>

      <p>
        <strong>Charge:</strong> ${fine.charge}
      </p>

      <p>
        <strong>Issue Date:</strong>
        ${fine.issueDate.toISOString().split("T")[0]}
      </p>

      <p>
        <strong>Expiry Date:</strong>
        ${fine.expireDate.toISOString().split("T")[0]}
      </p>

      <p>
        <strong>Vehicle No:</strong>
        ${fine.vNo}
      </p>

      <p>
        <strong>Time:</strong>
        ${fine.time}
      </p>

      <p>
        <strong>Location:</strong>
        ${fine.place}
      </p>

      <p>
        <strong>Police Officer:</strong>
        ${fine.pName}
      </p>

      <p>
        <strong>Police Station:</strong>
        ${fine.pStation}
      </p>

      <p>
        <strong>Payment ID:</strong>

        <span style="color:blue;font-weight:bold;">
          ${fine._id}
        </span>
      </p>

    </div>


    <p>
      Please pay your fine before the due date.
    </p>


    <p style="text-align:center;">
      <a href="http://localhost:5173/payment" class="button">
        Pay Fine Now
      </a>
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

          // Mark reminder as sent after successful email
          await Fine.findByIdAndUpdate(
              fine._id,
              {
                $set:{
                  reminderSent:true
                }
              }
          );
        } catch(error) {
          console.error(`Failed to send reminder email for fine ${fine._id}:`, error);
        }
      }
    }
  } catch(error) {
    console.error("Error checking reminder fines:", error);

  }
};
