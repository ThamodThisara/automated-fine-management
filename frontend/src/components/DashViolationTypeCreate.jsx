import React, { useContext, useState } from "react";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Datepicker,
  Select,
  FileInput,
  Alert,
} from "flowbite-react";
import { AuthContext } from "../context/AuthContext";

export const DashViolationTypeCreate = () => {
  const { authUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState(null);
  // const [errors, setErrors] = useState({});

  const handleTextboxDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //
  // const validate = () => {
  //   const next = {};
  //
  //   if (!formData.type || formData.type.trim().length < 3) {
  //     next.type = "Violation type must be at least 3 characters.";
  //   }
  //
  //   if (!formData.description || formData.description.trim().length < 10) {
  //     next.description = "Description is required (at least 10 characters).";
  //   }
  //
  //   const price = Number(formData.price);
  //   if (!formData.price || Number.isNaN(price) || price <= 0) {
  //     next.price = "Penalty amount must be a number greater than 0.";
  //   }
  //   return next;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const found = validate();
    //   setErrors(found);
    //   if (Object.keys(found).length > 0) return;
    try {
      const res = await fetch("/api/v1/violation/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({
          type: "failure",
          message: data.message || "Failed to add violation rule.",
        });
        return;
      }

      await fetch("/api/v1/activity/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "violationType-create",
          createdBy: authUser._id,
        }),
      });
      setStatus({ type: "success", message: "Violation rule added successfully." });
      e.target.reset();
      setFormData({});
      // setErrors({});
    } catch (error) {
      console.log(error);
      setStatus({ type: "failure", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
            Violation Rules & Information
          </h2>
          <p className="text-gray-600">
            Manage traffic violation rules and penalties
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <form className="p-6 sm:p-8 space-y-6" onSubmit={handleSubmit}>
            {status && (
              <Alert color={status.type === "success" ? "success" : "failure"}>
                <span className="font-medium">{status.message}</span>
              </Alert>
            )}
            {/* Violation Type */}
            <div>
              <Label
                htmlFor="type"
                value="Violation Type"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <div className="relative">
                <TextInput
                  id="type"
                  type="text"
                  required
                  shadow
                  className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  onChange={handleTextboxDataChange}
                  placeholder="e.g., Speeding, Red Light Violation"
                />
                {/*{errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}*/}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                value="Rule Description"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <textarea
                id="description"
                rows="5"
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Detailed description of the violation rule..."
                onChange={handleTextboxDataChange}
              ></textarea>
              {/*{errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}*/}
            </div>

            {/* Price */}
            <div>
              <Label
                htmlFor="price"
                value="Penalty Amount (LKR)"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">Rs.</span>
                </div>
                <TextInput
                  id="price"
                  type="text"
                  required
                  shadow
                  className="w-full pl-10 border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  onChange={handleTextboxDataChange}
                  placeholder="5000"
                />
                {/*{errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}*/}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                gradientDuoTone="redToOrange"
                className="w-full py-3 font-medium text-lg transition-all hover:scale-[1.01] active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Violation Rule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
