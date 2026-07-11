import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import stripePackage from "stripe";
import Fine from "../model/fine.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const stripe = stripePackage(process.env.STRIPE);

export const checkout = async (req, res, next) => {
  try {
    const { data } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email, // Attach user's email
      metadata: {
        driverId: data.dId,
        driverName: data.dName,
        vehicleNo: data.vNo,
        issuedAt: data.issueDate.$date,
        place: data.place,
        violation: data.violation,
        officerId: data.pId,
        officerName: data.pName,
        policeStation: data.pStation,
        charge: data.charge, // Store original charge
      },
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Traffic Violation: ${data.violation}`,
              description: `Issued by ${data.pName} at ${data.place} on ${data.issueDate.$date}`,
            },
            unit_amount: parseInt(data.charge.replace(/\D+/g, "")) * 100, // Rupees -> smallest currency unit (cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/payment/success?session_id=${data._id}`,
      cancel_url: "http://localhost:5173/login/",
    });

    console.log("Stripe Session Created:", session);

    res.json({ id: session.id });
  } catch (error) {
    next(error);
  }
};

export const updateSuccessPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;
    // console.log(sessionId);

    // Retrieve payment session from Stripe
    // const session = await stripe.checkout.sessions.retrieve(sessionId);
    // const fineId = session.metadata.fineId;

    // if (session.payment_status === "paid") {
    // Update fine state in database
    await Fine.findByIdAndUpdate(sessionId, { state: true });

    res.json({ success: true, message: "Fine updated successfully" });
    // } else {
    // res.json({ success: false, message: "Payment not completed" });
    // }
  } catch (error) {
    // console.error("Error updating fine:", error);
    res.status(500).json({ success: false, error: "Failed to update fine" });
  }
};
