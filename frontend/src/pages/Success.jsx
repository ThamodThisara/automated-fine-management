import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState(sessionId ? "loading" : "error");
  const [message, setMessage] = useState(
    sessionId ? "" : "No payment session was found."
  );

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/pay/update-fine", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
          }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.message || "We could not confirm your payment.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("error");
        setMessage("Something went wrong while confirming your payment.");
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-teal-100 dark:border-gray-700 transform transition-all duration-500 hover:shadow-2xl">
        <div
          className={`h-2 ${
            status === "error"
              ? "bg-red-400"
              : "bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 animate-gradient-x"
          }`}
        ></div>

        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {status !== "error" && (
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900 rounded-full animate-ping opacity-75"></div>
              )}
              {status === "error" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-red-500 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-green-500 relative z-10"
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
              )}
            </div>
          </div>

          {status === "loading" && (
            <>
              <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-4">
                Confirming Payment...
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Please wait while we verify your payment with Stripe.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-4">
                Payment Successful!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Your fine has been updated.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
                Payment Not Confirmed
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {message}
              </p>
            </>
          )}

          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
              Back to Home Page
            </Button>
          </Link>

          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Transaction ID: {sessionId || "N/A"}
            </p>
            {status === "success" && (
              <div className="mt-4 flex justify-center space-x-4">
                <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure Payment
                </span>
                <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Receipt Sent
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
