import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import stripePackage from "stripe";
import Fine from "../model/fine.model.js";
import { errorHandler } from "../utils/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const stripe = stripePackage(process.env.STRIPE);

export const checkout = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Guard against malformed/blocked-fine payloads so a bad request returns a clear
    // 400 instead of crashing on undefined fields.
    if (!data || !data._id || !data.charge || !data.email) {
      return next(errorHandler(400, "Invalid fine data for payment."));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email, // Attach user's email
      metadata: {
        driverId: data.dId,
        driverName: data.dName,
        vehicleNo: data.vNo,
        issuedAt: String(data.issueDate ?? ""), // issueDate is serialized as an ISO string
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
              description: `Issued by ${data.pName} at ${data.place} on ${String(
                data.issueDate ?? ""
              )}`,
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

export const updateSuccessPayment = async (req, res, next) => {
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
    next(error);
  }
};
