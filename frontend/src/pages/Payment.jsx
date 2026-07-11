import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export const Payment = () => {
  const [fineId, setFineId] = useState(null);
  const navigate = useNavigate();

  const makepayment = async (fineId) => {
    await fetch(`/api/v1/fine/getfinebyobjectid/${fineId}`)
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);

        const stripe = await loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        );
        const response = await fetch("/api/pay/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });

        const session = await response.json();
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (result.error) {
          console.error("Error redirecting to checkout: ", result.error);
        } else {
          navigate("/");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 flex items-center justify-center p-4 md:p-8">
      <form
        className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-cyan-100 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl"
        // onSubmit={makepayment(fineId)}
      >
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-cyan-600 dark:text-cyan-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">
            Payment Processing
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your payment details to complete the transaction
          </p>
        </div>

        {/* Payment ID Input */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Label
              htmlFor="paymentId"
              value="Payment ID"
              className="text-cyan-700 dark:text-cyan-300 font-medium text-sm uppercase tracking-wider flex items-center"
            />
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              (Required)
            </span>
          </div>
          <div className="relative">
            <TextInput
              id="paymentId"
              type="text"
              value={fineId}
              onChange={(e) => {
                setFineId(e.target.value);
              }}
              required
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-cyan-200 dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
              shadow
              placeholder="Enter your payment ID"
            />
            <div className="absolute left-3 top-3.5 text-cyan-500 dark:text-cyan-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This is the unique identifier for your fine
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button
            type="button"
            onClick={() => makepayment(fineId)}
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            Process Payment
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By proceeding, you agree to our{" "}
            <a
              href="#"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Privacy Policy
            </a>
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">
                Secure
              </span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">
                Encrypted
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
