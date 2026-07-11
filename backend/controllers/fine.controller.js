import Fine from "../model/fine.model.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from "./email.controller.js";
import PDFDocument from "pdfkit";

export const fineIssue = async (req, res, next) => {
  const now = new Date();
  const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const issueDate = offsetDate.toISOString().split("T")[0];
  const time = now.toTimeString().split(" ")[0].slice(0, 5);
  //now.setDate(now.getDate() + 14);
  //const formattedExpireDate = now.toISOString().split("T")[0];
  const yesterdayDate = new Date(offsetDate);
  yesterdayDate.setDate(yesterdayDate.getDate() + 14);
  const formattedExpireDate = yesterdayDate.toISOString().split("T")[0];

  const {
    _id,
    dId,
    dName,
    email,
    vNo,
    place,
    violation,
    pId,
    pName,
    pStation,
    charge,
  } = req.body;

  console.log(_id);
  if (
    !dId ||
    !dName ||
    !email ||
    !vNo ||
    !place ||
    !violation ||
    !pId ||
    !pName ||
    !pStation ||
    !charge ||
    dId == "" ||
    dName == "" ||
    email == "" ||
    vNo == "" ||
    place == "" ||
    violation == "" ||
    pId == "" ||
    pName == "" ||
    pStation == "" ||
    charge == ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const createFine = Fine({
      dId,
      dName,
      email,
      vNo,
      issueDate,
      time,
      place,
      expireDate: formattedExpireDate,
      violation,
      pId,
      pName,
      pStation,
      charge,
      state: false,
    });

    const savedFine = await createFine.save();

    const emailBodyFine = `
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
        <h2 style="color: white;">🚨 Traffic Fine Notice. <br /> Driver Id-: ${dId} 🚨</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${dName}</strong>,</p>
        <p><strong>You have been issued a traffic fine for the following violation:
          
        </strong></p>
        
        <div class="details">
          <p><strong>Violation:</strong> ${violation}</p>
          <p><strong>Charge:</strong> ${charge}</p>
          <p><strong>Issue Date:</strong> ${issueDate}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Location:</strong> ${place}</p>
          
          <p><strong>Expiry Date:</strong> ${formattedExpireDate}</p>
          <p><strong>Vehicle No:</strong> ${vNo}</p>
          <p><strong>Police Officer Id:</strong> ${pId}</p>
          <p><strong>Police Officer name:</strong> ${pName}</p>
          <p><strong>Police Officer Station:</strong> ${pStation}</p><br>
          <p><strong>Your Payment Id:</strong> <span style="color: blue; font-weight: bold;">${savedFine._id}</span></p>

        </div>
        
        <p>Please pay your fine before the due date to avoid further penalties.</p>
        
        <p style="text-align: center;">
          <a href="http://localhost:5173/payment" class="button">Pay Fine Now</a>
        </p>
      </div>
      <div class="footer">
        🚔 Traffic Fine Management System | Contact Us: sadmin@gmail.com
      </div>
    </div>
  </body>
  </html>
`;
    await sendEmail(email, "Notice: Traffic Fine", emailBodyFine);
    // await sendEmail(email, "Notice: Traffic Fine", emailBodyFine);
    res.json("Fine registration is successfull");
  } catch (error) {
    next(error);
  }
};

export const getAllFines = async (req, res, next) => {
  try {
    const fines = await Fine.find();

    if (fines) {
      res.status(200).json(fines);
    } else {
      return next(400, "User not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fine = await Fine.find({ dId: fineId });

    if (fine) {
      res.status(200).json(fine);
    } else {
      return next(404, "Fine not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getFineOfficer = async (req, res, next) => {
  try {
    const fineIdOfficer = req.params.pId;

    const fineOfficer = await Fine.find({ pId: fineIdOfficer });

    if (fineOfficer) {
      res.status(200).json(fineOfficer);
    } else {
      return next(404, "Fine not found");
    }
  } catch (error) {
    next(error);
  }
};

//export const getFineByOid = async (req, res, next) => {
// try {
//  const fineId = req.params._id;

// const fine = await Fine.findById(fineId);

// if (fine) {
//  res.status(200).json(fine);
//} else {
// return next(404, "Fine not found");
// }
//} catch (error) {
// next(error);
//}
//};

export const getFineByOid = async (req, res, next) => {
  try {
    const fineId = req.params._id;

    const fine = await Fine.findById(fineId);

    if (!fine) {
      return next(404, "Fine not found");
    }

    if (!fine.block && !fine.state) {
      return res.status(200).json(fine);
    } else {
      return res
        .status(403)
        .json({ message: "Fine cannot be processed for payment" });
    }
  } catch (error) {
    next(error);
  }
};

export const getBlockFines = async (req, res, next) => {
  try {
    const fines = await Fine.find();

    if (!fines) {
      return next(404, "Fine not found");
    }
    const blockedFines = fines.filter((fine) => fine.block === true);

    if (blockedFines.length > 0) {
      return res.status(200).json(blockedFines);
    } else {
      return res.status(404).json({ message: "No blocked fines found" });
    }
  } catch (error) {
    next(error);
  }
};

export const fineUpdate = async (req, res, next) => {
  try {
    const fine = await Fine.findOne({ _id: req.params._id });

    const updateFine = await Fine.findByIdAndUpdate(
      fine._id,
      {
        $set: {
          block: req.body.block,
          state: req.body.state,
        },
      },
      { new: true }
    );
    res.status(200).json(updateFine);
    console.log("Success");
  } catch (error) {
    next(error);
  }
};

export const getBlockFine = async (req, res, next) => {
  try {
    const fineId = req.params._id;
    const fine = await Fine.findOne({ _id: fineId });

    if (fine) {
      res.status(200).json(fine);
    } else {
      return next(404, "Rule not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getUnpaidFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fine = await Fine.find({ dId: fineId, state: false });

    if (fine) {
      res.status(200).json(fine);
    } else {
      return next(404, "Rule not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getblockdriverFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fine = await Fine.find({ dId: fineId, block: true });

    if (fine) {
      res.status(200).json(fine);
    } else {
      return next(404, "Rule not found");
    }
  } catch (error) {
    next(error);
  }
};

// export const generateFinePDF = async (req, res) => {
//   try {
//     const { date, pId, dId, vNo } = req.query;

//     const filter = {};
//     if (date) {
//       const selectedDate = new Date(date);
//       const nextDay = new Date(selectedDate);
//       nextDay.setDate(nextDay.getDate() + 1);

//       filter.issueDate = {
//         $gte: selectedDate,
//         $lt: nextDay
//       };
//     }
//     if (pId) filter.pId = pId;
//     if (dId) filter.dId = dId;
//     if (vNo) filter.vNo = vNo;

//     const fines = await Fine.find(filter);

//     if (fines.length === 0) {
//       return res.status(404).json({ message: 'No fines found with the specified filters' });
//     }

//     const doc = new PDFDocument({ margin: 30, size: 'A4' });

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=fines_report.pdf');

//     doc.pipe(res);

//     doc.fontSize(18).text('Traffic Fine Report', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(12).text('Filters Applied:', { underline: true });
//     if (date) doc.text(`Date: ${new Date(date).toLocaleDateString()}`);
//     if (pId) doc.text(`Police ID: ${pId}`);
//     if (dId) doc.text(`Driver ID: ${dId}`);
//     if (vNo) doc.text(`Vehicle No: ${vNo}`);
//     doc.moveDown();

//     // Add table headers
//     doc.fontSize(12).text('No.', { continued: true }).moveUp();
//     doc.text('Driver ID', { align: 'left', width: 80, continued: true });
//     doc.text('Driver Name', { align: 'left', width: 100, continued: true });
//     doc.text('Vehicle No', { align: 'left', width: 80, continued: true });
//     doc.text('Violation', { align: 'left', width: 120, continued: true });
//     doc.text('Fine Amount', { align: 'right' });
//     doc.moveDown();

//     // Add fine data
//     let y = doc.y;
//     fines.forEach((fine, index) => {
//       doc.fontSize(10)
//         .text(`${index + 1}.`, { width: 30, align: 'left' })
//         .text(fine.dId, { width: 80, align: 'left' })
//         .text(fine.dName, { width: 100, align: 'left' })
//         .text(fine.vNo, { width: 80, align: 'left' })
//         .text(fine.violation, { width: 120, align: 'left' })
//         .text(`Rs. ${fine.charge}`, { width: 80, align: 'right' });

//       doc.moveDown();
//     });

//     doc.moveDown();
//     const totalFines = fines.reduce((sum, fine) => sum + parseFloat(fine.charge.split(' ')[1]), 0);
//     doc.fontSize(12)
//       .text(`Total Fines: ${fines.length}`, { align: 'left' })
//       .text(`Total Amount: Rs. ${totalFines.toFixed(2)}`, { align: 'right' });

//     // Add footer
//     doc.fontSize(10)
//       .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

//     doc.end();

//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).json({ message: 'Error generating PDF report' });
//   }
// }

export const generateFinePDF = async (req, res) => {
  try {
    const { date, pId, dId, vNo, pStation } = req.query;

    const filter = {};
    if (date) {
      const selectedDate = new Date(date);

      // Find fines where issueDate >= selectedDate
      filter.issueDate = {
        $gte: selectedDate,
      };
      console.log(filter);
    }
    if (pId) filter.pId = pId;
    if (dId) filter.dId = dId;
    if (vNo) filter.vNo = vNo;
    if (pStation) filter.pStation = pStation;

    const fines = await Fine.find(filter);

    if (fines.length === 0) {
      return res
        .status(404)
        .json({ message: "No fines found with the specified filters" });
    }

    // Create PDF with better margins
    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      info: {
        Title: "Traffic Fine Report",
        Author: "Traffic Management System",
        Creator: "Your Application Name",
        Producer: "PDFKit",
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=fines_report.pdf"); // Changed to inline for viewing

    doc.pipe(res);

    // Add header with logo and title
    doc
      .fillColor("#2c3e50")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("TRAFFIC FINE REPORT", { align: "center" });

    doc.moveDown(0.5);

    // Add decorative line
    doc
      .strokeColor("#3498db")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(1);

    // Filters section with colored background
    doc
      .fillColor("#ffffff")
      .rect(50, doc.y, 500, 70)
      .fill("#f8f9fa")
      .stroke("#dee2e6");

    doc
      .fillColor("#2c3e50")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("FILTERS APPLIED:", 60, doc.y + 10);

    doc.fillColor("#7f8c8d").font("Helvetica");

    let filterY = doc.y + 30;
    if (date) {
      doc.text(`• Date: ${new Date(date).toLocaleDateString()}`, 60, filterY);
      filterY += 20;
    }
    if (pId) {
      doc.text(`• Police ID: ${pId}`, 60, filterY);
      filterY += 20;
    }
    if (dId) {
      doc.text(`• Driver ID: ${dId}`, 60, filterY);
      filterY += 20;
    }
    if (vNo) {
      doc.text(`• Vehicle No: ${vNo}`, 60, filterY);
      filterY += 20;
    }

    doc.moveDown(2);

    // Table header with colored background
    const tableTop = doc.y;
    const tableLeft = 50;
    const colWidths = [30, 80, 100, 80, 120, 80];

    // Header background
    doc
      .fillColor("#ffffff")
      .rect(tableLeft, tableTop, 500, 20)
      .fill("#3498db")
      .stroke("#3498db");

    // Header text
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("No.", tableLeft, tableTop + 5, { width: colWidths[0] })
      .text("Driver ID", tableLeft + colWidths[0], tableTop + 5, {
        width: colWidths[1],
      })
      .text(
        "Driver Name",
        tableLeft + colWidths[0] + colWidths[1],
        tableTop + 5,
        { width: colWidths[2] }
      )
      .text(
        "Vehicle No",
        tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
        tableTop + 5,
        { width: colWidths[3] }
      )
      .text(
        "Violation",
        tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        tableTop + 5,
        { width: colWidths[4] }
      )
      .text(
        "Fine Amount",
        tableLeft +
          colWidths[0] +
          colWidths[1] +
          colWidths[2] +
          colWidths[3] +
          colWidths[4],
        tableTop + 5,
        { width: colWidths[5], align: "right" }
      );

    // Table rows with alternating colors
    let rowTop = tableTop + 20;
    fines.forEach((fine, index) => {
      // Alternate row colors
      const rowColor = index % 2 === 0 ? "#ffffff" : "#f8f9fa";

      doc
        .fillColor(rowColor)
        .rect(tableLeft, rowTop, 500, 20)
        .fill()
        .stroke("#dee2e6");

      doc
        .fillColor("#2c3e50")
        .font("Helvetica")
        .fontSize(10)
        .text(`${index + 1}.`, tableLeft, rowTop + 5, { width: colWidths[0] })
        .text(fine.dId, tableLeft + colWidths[0], rowTop + 5, {
          width: colWidths[1],
        })
        .text(fine.dName, tableLeft + colWidths[0] + colWidths[1], rowTop + 5, {
          width: colWidths[2],
        })
        .text(
          fine.vNo,
          tableLeft + colWidths[0] + colWidths[1] + colWidths[2],
          rowTop + 5,
          { width: colWidths[3] }
        )
        .text(
          fine.violation,
          tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
          rowTop + 5,
          { width: colWidths[4] }
        )
        .fillColor("#e74c3c") // Red color for fine amount
        .text(
          `LKR ${parseFloat(fine.charge.split(" ")[1]).toFixed(2)}`,
          tableLeft +
            colWidths[0] +
            colWidths[1] +
            colWidths[2] +
            colWidths[3] +
            colWidths[4],
          rowTop + 5,
          { width: colWidths[5], align: "right" }
        );

      rowTop += 30;
    });

    // Add total summary with colored background
    doc
      .fillColor("#ffffff")
      .rect(tableLeft, rowTop, 500, 30)
      .fill("#2c3e50")
      .stroke("#2c3e50");

    const totalFines = fines.reduce(
      (sum, fine) => sum + parseFloat(fine.charge.split(" ")[1]),
      0
    );

    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Total Fines: ${fines.length}`, tableLeft + 10, rowTop + 10)
      .text(
        `Total Amount: LKR ${totalFines.toFixed(2)}`,
        tableLeft + 300,
        rowTop + 10,
        { width: 190, align: "right" }
      );

    rowTop += 40;

    // Add interactive elements (links)
    {
      /*doc
      .fillColor("#3498db")
      .text(
        "For payment instructions, visit our website: ",
        tableLeft,
        rowTop,
        { continued: true }
      )
      .text("www.trafficfines.gov.lk/payment", {
        link: "https://www.trafficfines.gov.lk/payment",
        underline: true,
      });*/
    }

    rowTop += 20;

    // Add QR code placeholder (you can replace with actual QR code generation)
    //doc.fillColor("#000000").text("Scan to pay:", tableLeft, rowTop);

    // This is a placeholder - you would use a QR code library here
    // doc
    // .rect(tableLeft, rowTop + 20, 80, 80)
    // .fill("#ffffff")
    // .stroke("#000000")
    // .fillColor("#000000")
    // .text("QR Code", tableLeft + 10, rowTop + 50);

    // Add footer with page numbers
    doc.page.margins.bottom = 0;
    doc
      .fillColor("#7f8c8d")
      .fontSize(10)
      .text(
        `Generated on ${new Date().toLocaleString()} • Page ${
          doc.bufferedPageRange().count
        } of ${doc.bufferedPageRange().count}`,
        50,
        doc.page.height - 30,
        {
          align: "center",
          width: 500,
        }
      );

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF report" });
  }
};
