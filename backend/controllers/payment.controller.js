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

    if (!data || !data._id || !data.charge || !data.email) {
      return next(errorHandler(400, "Invalid fine data for payment."));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email, // Attach user's email
      metadata: {
        fineId: String(data._id), // Used by updateSuccessPayment to know which fine to mark paid
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
      // Stripe substitutes {CHECKOUT_SESSION_ID} with the real session id on redirect, so
      // updateSuccessPayment can verify the payment with Stripe instead of trusting the client.
      success_url:
        "http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}",
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

    if (!sessionId) {
      return next(errorHandler(400, "Missing payment session id."));
    }

    // Ask Stripe directly whether this session was actually paid, rather than
    // trusting the client's say-so.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return next(errorHandler(402, "Payment not completed."));
    }

    const fineId = session.metadata?.fineId;
    if (!fineId) {
      return next(errorHandler(400, "Payment session has no associated fine."));
    }

    const updatedFine = await Fine.findByIdAndUpdate(
      fineId,
      { state: true },
      { new: true }
    );

    if (!updatedFine) {
      return next(errorHandler(404, "Fine not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Fine updated successfully",
      fine: updatedFine,
    });
  } catch (error) {
    next(error);
  }
};
