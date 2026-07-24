import Fine from "../model/fine.model.js";
import { errorHandler } from "../utils/error.js";
import { sendEmail } from "./email.controller.js";
import PDFDocument from "pdfkit";

export const fineIssue = async (req, res, next) => {
  const now = new Date();
  const issueDate = now.toLocaleDateString("en-CA");
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const expire = new Date(now);
  expire.setDate(expire.getDate() + 14);
  const formattedExpireDate = expire.toLocaleDateString("en-CA");

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
    res.status(200).json(fines);
  } catch (error) {
    next(error);
  }
};

export const getFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fine = await Fine.find({ dId: fineId });

    if (fine.length > 0) {
      res.status(200).json(fine);
    } else {
      return next(errorHandler(404, "Fine not found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getFineOfficer = async (req, res, next) => {
  try {
    const fineIdOfficer = req.params.pId;

    const fineOfficer = await Fine.find({ pId: fineIdOfficer });

    if (fineOfficer.length > 0) {
      res.status(200).json(fineOfficer);
    } else {
      return next(errorHandler(404, "Fine not found"));
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
      return next(errorHandler(404, "Fine not found"));
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
    const blockedFines = await Fine.find({ block: true });

    if (blockedFines.length === 0) {
      return next(errorHandler(404, "No blocked fines found"));
    }

    return res.status(200).json(blockedFines);
  } catch (error) {
    next(error);
  }
};

export const fineUpdate = async (req, res, next) => {
  try {
    const fineId = req.params._id;

    const updateFine = await Fine.findByIdAndUpdate(
        fineId,
        {
          $set: {
            block: req.body.block,
            state: req.body.state,
          },
        },
        { new: true }
    );

    if (!updateFine) {
      return next(errorHandler(404, "Fine not found"));
    }

    return res.status(200).json(updateFine);
  } catch (error) {
    next(error);
  }
};

export const getBlockFine = async (req, res, next) => {
  try {
    const fineId = req.params._id;

    const fine = await Fine.findById(fineId);

    if (!fine) {
      return next(errorHandler(404, "Fine not found"));
    }

    return res.status(200).json(fine);
  } catch (error) {
    next(error);
  }
};


export const getUnpaidFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fine = await Fine.find({ dId: fineId, state: false });

    if (fine.length > 0) {
      res.status(200).json(fine);
    } else {
      return next(errorHandler(404, "No unpaid fines found"));
    }
  } catch (error) {
    next(error);
  }
};

export const getblockdriverFine = async (req, res, next) => {
  try {
    const fineId = req.params.dId;

    const fines = await Fine.find({
      dId: fineId,
      block: true,
    });

    if (fines.length === 0) {
      return next(errorHandler(404, "No blocked fines found"));
    }

    return res.status(200).json(fines);
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

export const generateFinePDF = async (req, res, next) => {
  try {
    const { date, pId, dId, vNo, pStation } = req.query;

    const filter = {};
    if (date) {
      const selectedDate = new Date(date);

      filter.issueDate = {
        $gte: selectedDate,
      };
    }
    if (pId) filter.pId = pId;
    if (dId) filter.dId = dId;
    if (vNo) filter.vNo = vNo;
    if (pStation) filter.pStation = pStation;

    const fines = await Fine.find(filter);

    if (fines.length === 0) {
      return next(
          errorHandler(404, "No fines found with the specified filters")
      );
    }


    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      info: {
        Title: "Traffic Fine Report",
        Author: "Traffic Management System",
      },
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "inline; filename=fines_report.pdf"
    );
    doc.pipe(res);

    // Helper function
    const getFineAmount = (charge) => {
      if (!charge) return 0;

      // "LKR 2500" -> 2500
      const amount = charge.replace(/[^0-9.]/g, "");

      return Number(amount) || 0;
    };

    // Draw Table Header Function

    const drawTableHeader = () => {

      const tableLeft = 50;
      const tableTop = doc.y;

      doc
          .fillColor("#3498db")
          .rect(tableLeft, tableTop, 500, 20)
          .fill();


      doc
          .fillColor("#ffffff")
          .font("Helvetica-Bold")
          .fontSize(10)

          .text("No.", tableLeft, tableTop + 5, {
            width: 30
          })

          .text("Driver ID", tableLeft + 30, tableTop + 5, {
            width: 80
          })

          .text("Driver Name", tableLeft + 110, tableTop + 5, {
            width: 100
          })

          .text("Vehicle No", tableLeft + 210, tableTop + 5, {
            width: 80
          })

          .text("Violation", tableLeft + 290, tableTop + 5, {
            width: 120
          })

          .text("Amount", tableLeft + 410, tableTop + 5, {
            width: 80,
            align:"right"
          });
      return tableTop + 25;
    };

    // PDF Header
    doc
        .fillColor("#2c3e50")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(
            "TRAFFIC FINE REPORT",
            {
              align:"center"
            }
        );
    doc.moveDown(2);

    let rowTop = drawTableHeader();

    // Table Rows
    fines.forEach((fine,index)=>{


      // Check page overflow
      if(rowTop + 30 > doc.page.height - 60){
        doc.addPage();
        rowTop = drawTableHeader();
      }

      const amount = getFineAmount(
          fine.charge
      );

      const rowColor =
          index % 2 === 0
              ? "#ffffff"
              : "#f8f9fa";

      doc
          .fillColor(rowColor)
          .rect(50,rowTop,500,25)
          .fill();

      doc
          .fillColor("#2c3e50")
          .font("Helvetica")
          .fontSize(10)

          .text(
              `${index+1}`,
              50,
              rowTop+7,
              {
                width:30
              }
          )

          .text(
              fine.dId || "-",
              80,
              rowTop+7,
              {
                width:80
              }
          )

          .text(
              fine.dName || "-",
              160,
              rowTop+7,
              {
                width:100,
                ellipsis:true
              }
          )

          .text(
              fine.vNo || "-",
              260,
              rowTop+7,
              {
                width:80
              }
          )

          .text(
              fine.violation || "-",
              340,
              rowTop+7,
              {
                width:120,
                ellipsis:true
              }
          )

          .fillColor("#e74c3c")
          .text(
              `LKR ${amount.toFixed(2)}`,
              460,
              rowTop+7,
              {
                width:80,
                align:"right"
              }
          );
      rowTop += 30;
    });

    // Total
    if(rowTop + 40 > doc.page.height - 60){
      doc.addPage();
      rowTop = 50;

    }

    const totalAmount = fines.reduce(
        (sum,fine)=>
            sum + getFineAmount(fine.charge),
        0
    );

    doc
        .fillColor("#2c3e50")
        .rect(50,rowTop,500,30)
        .fill();

    doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(12)

        .text(
            `Total Fines: ${fines.length}`,
            60,
            rowTop+10
        )

        .text(
            `Total Amount: LKR ${totalAmount.toFixed(2)}`,
            320,
            rowTop+10,
            {
              width:220,
              align:"right"
            }
        );

    // Footer
    doc
        .fillColor("#7f8c8d")
        .fontSize(10)
        .text(
            `Generated on ${new Date().toLocaleString()}`,
            50,
            doc.page.height - 40,
            {
              align:"center",
              width:500
            }
        );
    doc.end();
  } catch(error){
    next(error);
  }
};

